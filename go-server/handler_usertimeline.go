package main

import (
	"net/http"

	"github.com/darkluminance/higher-studies-application-tracker/go-server/internal/database"
)

func (apiConfig *apiConfig) handlerGetUserTimeline(w http.ResponseWriter, r *http.Request, user database.User) {
	timeline, err := apiConfig.DB.GetTimeline(r.Context(), user.ID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Timeline not found"+err.Error())
		return
	}

	respondWithJSON(w, http.StatusOK, timeline)
}
