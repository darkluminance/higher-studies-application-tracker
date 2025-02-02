-- +goose Up
CREATE TYPE notifications_type_enum AS ENUM ('DEADLINE', 'INTERVIEW');

CREATE TABLE notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_email VARCHAR(50) NOT NULL,
    notification_type notifications_type_enum,
    notification_ref_ID UUID,
    event_time TIMESTAMP NOT NULL,
    notify_time TIMESTAMP NOT NULL,
    message TEXT NOT NULL
);

-- +goose Down
DROP TABLE IF EXISTS notifications;
DROP TYPE IF EXISTS notifications_type_enum;