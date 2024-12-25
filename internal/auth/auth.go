package auth

import (
	"errors"
	"net/http"
	"strings"
)

func GetAuthToken(headers http.Header) (string, error) {
	val := headers.Get("Authorization")
	if val == "" {
        return "", errors.New("missing authorization header")
    }
	parts := strings.SplitN(val, " ", 2)
	if len(parts)!= 2 || parts[0]!= "Bearer" {
        return "", errors.New("invalid authorization header format")
    }
	
	return parts[1], nil
}