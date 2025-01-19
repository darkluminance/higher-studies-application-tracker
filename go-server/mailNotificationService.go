package main

import (
	"fmt"
	"net/smtp"
	"os"
)

func sendEmail(to string, subject string, body string) error {
	// Launch email sending in a goroutine
	go func() {
		from := os.Getenv("SMTP_EMAIL")
		password := os.Getenv("SMTP_PASSWORD")
		smtpHost := os.Getenv("SMTP_HOST")
		smtpPort := os.Getenv("SMTP_PORT")

		message := fmt.Sprintf("Subject: %s\r\n\r\n%s", subject, body)

		auth := smtp.PlainAuth("", from, password, smtpHost)

		err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, []byte(message))
		if err != nil {
			fmt.Printf("Error sending email: %v\n", err)
		} else {
			fmt.Printf("Successfully sent email to: %v\n", to)
		}
	}()

	return nil // Return immediately since email is sent asynchronously
}
