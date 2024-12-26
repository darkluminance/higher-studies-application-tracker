package main

import (
	"net/http"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/auth"
	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
)

type authedHandler func(http.ResponseWriter, *http.Request, database.User)

func (apiConfig *apiConfig) middlewareAuth(handler authedHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString, err := auth.GetAuthToken(r.Header)
		if err != nil {
			respondWithError(w, http.StatusUnauthorized, "Not logged in")
			return
		}

		username, err := ParseJWT(w, tokenString)
		if err != nil || len(username) == 0 {
			respondWithError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		user, err := apiConfig.DB.GetUserByUsername(r.Context(), username)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Internal server error")
			return
		}

		handler(w, r, user)
	}
}
