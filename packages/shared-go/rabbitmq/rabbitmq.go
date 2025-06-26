package rabbitmq

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/url"
	"time"

	"github.com/google/uuid"
	amqp "github.com/rabbitmq/amqp091-go"
)

type RPCClient struct {
	conn  *amqp.Connection
	ch    *amqp.Channel
	queue amqp.Queue
	logger *log.Logger
}

type Config struct {
	User      string
	Password  string
	Host      string
	QueueName string
	Logger    *log.Logger
}

func NewClient(cfg Config) (*RPCClient, error) {
	escapedPass := url.QueryEscape(cfg.Password)
	amqpURL := fmt.Sprintf("amqp://%s:%s@%s/", cfg.User, escapedPass, cfg.Host)

	conn, err := amqp.Dial(amqpURL)
	if err != nil {
		return nil, fmt.Errorf("RabbitMQ connection failed: %w", err)
	}

	ch, err := conn.Channel()
	if err != nil {
		return nil, fmt.Errorf("channel creation failed: %w", err)
	}

	if err := ch.Qos(1, 0, false); err != nil {
		return nil, fmt.Errorf("failed to set QoS: %w", err)
	}

	queue, err := ch.QueueDeclare(
		cfg.QueueName,
		true,  // durable
		false, // auto-delete
		false, // exclusive
		false, // no-wait
		nil,   // arguments
	)
	if err != nil {
		return nil, fmt.Errorf("queue declaration failed: %w", err)
	}

	logger := cfg.Logger
	if logger == nil {
		logger = log.Default()
	}

	return &RPCClient{conn: conn, ch: ch, queue: queue, logger: logger}, nil
}

func (c *RPCClient) Consume(controllers map[string]func([]byte) ([]byte, error)) error {
	msgs, err := c.ch.Consume(
		c.queue.Name,
		"",    // consumer tag
		false, // auto-ack
		false, // exclusive
		false, // no-local
		false, // no-wait
		nil,
	)
	if err != nil {
		return fmt.Errorf("failed to start consuming messages: %w", err)
	}

	go func() {
		for d := range msgs {
			start := time.Now()
			controller, exists := controllers[d.Type]
			if !exists {
				c.logger.Printf("no controller for message type: %s", d.Type)
				_ = d.Nack(false, false)
				continue
			}

			response, err := controller(d.Body)
			if err != nil {
				c.logger.Printf("controller error [%s]: %v", d.Type, err)
				_ = d.Nack(false, false)
				continue
			}

			err = c.ch.Publish(
				"",
				d.ReplyTo,
				false,
				false,
				amqp.Publishing{
					ContentType:   "application/json",
					CorrelationId: d.CorrelationId,
					Type:          d.Type,
					Body:          response,
				},
			)
			if err != nil {
				c.logger.Printf("failed to publish response: %v", err)
			}

			_ = d.Ack(false)
			duration := time.Since(start)
			c.logger.Printf("[%s] processed in %v", d.Type, duration)
		}
	}()

	return nil
}

func (c *RPCClient) Publish(ctx context.Context, targetQueue, msgType string, payload []byte) ([]byte, error) {
	corrID := uuid.New().String()

	replyQueue, err := c.ch.QueueDeclare(
		"", false, true, true, false, nil,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to declare reply queue: %w", err)
	}
	
	msgs, err := c.ch.Consume(replyQueue.Name, corrID, true, false, false, false, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to consume reply queue: %w", err)
	}
	defer c.ch.Cancel(corrID, false)

	err = c.ch.Publish(
		"",
		targetQueue,
		false,
		false,
		amqp.Publishing{
			ContentType:   "application/json",
			CorrelationId: corrID,
			ReplyTo:       replyQueue.Name,
			Type:          msgType,
			Body:          payload,
		},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to publish message: %w", err)
	}

	for {
		select {
		case msg := <-msgs:
			if msg.CorrelationId == corrID {
				return msg.Body, nil
			}
		case <-ctx.Done():
			return nil, errors.New("RPC timeout: no response received")
		}
	}
}

func (c *RPCClient) Close() {
	if c.ch != nil {
		_ = c.ch.Close()
	}
	if c.conn != nil {
		_ = c.conn.Close()
	}
}
