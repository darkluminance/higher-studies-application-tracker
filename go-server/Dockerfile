# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./
COPY migrations/ ./migrations

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Manually build `goose` inside the container
RUN go build -o goose ./goose

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the prebuilt `goose` binary from the build context
COPY goose /usr/local/bin/goose

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./app/main/migrations

# Create necessary directories and set permissions
RUN chmod +x /app/main

EXPOSE 8080

# Run the application
CMD ["sh", "-c", "goose -dir app/main/migrations postgres ${DB_URL} up && ./main"]