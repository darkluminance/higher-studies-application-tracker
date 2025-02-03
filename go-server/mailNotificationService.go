package main

import (
	"context"
	"fmt"
	"net/smtp"
	"os"
	"time"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
)

func sendEmail(to string, subject string, body string) error {
	// Launch email sending in a goroutine
	go func() {
		from := os.Getenv("SMTP_EMAIL")
		password := os.Getenv("SMTP_PASSWORD")
		smtpHost := os.Getenv("SMTP_HOST")
		smtpPort := os.Getenv("SMTP_PORT")
		fmt.Printf("Sending mail to: %v\n", to)

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

func (apiConfig *apiConfig) checkForNotificationsToSend() {
	currentTime := time.Now()
	fmt.Printf("Checking for notifications to send at %v\n", currentTime)

	notifications, err := apiConfig.DB.GetNotificationsToSendNow(context.Background(), currentTime)
	if err != nil {
		fmt.Printf("Error while checking for notifications: %v\n", err)
	}

	for _, notification := range notifications {
		mailSubject := ""
		if string(notification.NotificationType.NotificationsTypeEnum) == string(database.NotificationsTypeEnumDEADLINE) {
			mailSubject = "Upcoming University Deadline!"
		} else if string(notification.NotificationType.NotificationsTypeEnum) == string(database.NotificationsTypeEnumINTERVIEW) {
			mailSubject = "Upcoming Interview!"
		}
		sendEmail(notification.UserEmail, mailSubject, notification.Message)

		// Deletes the sent notification to save storage
		_, er := apiConfig.DB.DeleteNotification(context.Background(), notification.ID)
		if er != nil {
			fmt.Printf("Error while deleting notification %v: %v\n", notification.ID, er)
		}
	}
}
