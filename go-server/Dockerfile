# Build stage
FROM golang:1.23-alpine AS builder

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

RUN go install github.com/pressly/goose/v3/cmd/goose@latest
COPY migrations/ ./migrations

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Final stage
FROM alpine:latest

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./app/main/migrations
COPY --from=builder /go/bin/goose /usr/local/bin/goose

# Create necessary directories and set permissions
RUN chmod +x /app/main

EXPOSE 8080

# Run the application
CMD ["sh", "-c", "goose -dir app/main/migrations postgres ${DB_URL} up && ./main"]