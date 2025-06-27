package otelmetrics

import (
	"context"
	"log"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetrichttp"
	"go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.34.0"
)

func InitMetrics(endpoint string, service string) func() {
	ctx := context.Background()

	exporter, err := otlpmetrichttp.New(ctx,
		otlpmetrichttp.WithEndpoint(endpoint),
		otlpmetrichttp.WithInsecure(),
	)
	if err != nil {
		log.Fatal(err)
	}

	mp := metric.NewMeterProvider(
		metric.WithReader(metric.NewPeriodicReader(exporter)),
		metric.WithResource(resource.NewWithAttributes(
			semconv.SchemaURL,
			semconv.ServiceNameKey.String(service),
		)),
	)

	otel.SetMeterProvider(mp)

	return func() {
		_ = mp.Shutdown(ctx)
	}
}
