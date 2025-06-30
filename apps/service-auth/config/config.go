package config

import (
	"Sociax/service-auth/mailer"
	"Sociax/shared-go/database"
	"Sociax/shared-go/oteltracer"
	"Sociax/shared-go/rabbitmq"
	"Sociax/shared-go/utils"
	"sync"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/github"
	"golang.org/x/oauth2/google"
)

var (
	once              sync.Once
	ServiceName       string
	JwtSecret         []byte
	DatabaseConfig    database.Config
	MailerConfig      mailer.Config
	TracerConfig      oteltracer.Config
	RabbitMQConfig    rabbitmq.Config
	GoogleOAuthConfig oauth2.Config
	GitHubOAuthConfig oauth2.Config
)

func InitAllConfig() {
	once.Do(func() {
		ServiceName = utils.GetEnvOrFail("SERVICE_NAME")
		JwtSecret = []byte(utils.GetEnvOrFail("JWT_SECRET"))

		DatabaseConfig = database.Config{
			Host: utils.GetEnvOrFail("POSTGRES_HOST"),
			User: utils.GetEnvOrFail("POSTGRES_USER"),
			Pass: utils.GetEnvOrFail("POSTGRES_PASS"),
			DB:   utils.GetEnvOrFail("POSTGRES_DB"),
			Port: utils.GetEnvOrFail("POSTGRES_PORT"),
		}

		MailerConfig = mailer.Config{
			Host:  utils.GetEnvOrFail("SMTP_HOST"),
			Port:  utils.GetEnvIntOrFail("SMTP_PORT"),
			User:  utils.GetEnvOrFail("SMTP_USER"),
			Pass:  utils.GetEnvOrFail("SMTP_PASS"),
			Email: utils.GetEnvOrFail("SMTP_EMAIL"),
		}

		TracerConfig = oteltracer.Config{
			Endpoint: utils.GetEnvOrFail("TRACER_ENDPOINT"),
			Service:  utils.GetEnvOrFail("SERVICE_NAME"),
		}

		RabbitMQConfig = rabbitmq.Config{
			User:      utils.GetEnvOrFail("RABBITMQ_USER"),
			Password:  utils.GetEnvOrFail("RABBITMQ_PASS"),
			Host:      utils.GetEnvOrFail("RABBITMQ_HOST"),
			QueueName: utils.GetEnvOrFail("RABBITMQ_QUEUE"),
		}

		GoogleOAuthConfig = oauth2.Config{
			ClientID:     utils.GetEnvOrFail("GOOGLE_CLIENT_ID"),
			ClientSecret: utils.GetEnvOrFail("GOOGLE_CLIENT_SECRET"),
			RedirectURL:  utils.GetEnvOrFail("GOOGLE_REDIRECT_URL"),
			Scopes:       []string{"email", "profile"},
			Endpoint:     google.Endpoint,
		}

		GitHubOAuthConfig = oauth2.Config{
			ClientID:     utils.GetEnvOrFail("GITHUB_CLIENT_ID"),
			ClientSecret: utils.GetEnvOrFail("GITHUB_CLIENT_SECRET"),
			RedirectURL:  utils.GetEnvOrFail("GITHUB_REDIRECT_URL"),
			Scopes:       []string{"user:email"},
			Endpoint:     github.Endpoint,
		}
	})
}
