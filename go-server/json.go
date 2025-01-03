package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"
)

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	data, err := json.Marshal(payload)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(data)
}

func respondWithError(w http.ResponseWriter, code int, msg string) {
	if code > 499 {
		log.Println("Responding with 5XX error: ", msg)
	}
	type errResponse struct {
		Error string `json:"error"`
	}

	if containsDuplicateKeyError(msg) {
		msg = getDuplicateKeyName(msg)
		code = http.StatusConflict
	}

	respondWithJSON(w, code, errResponse{
		Error: msg,
	})
}

func containsDuplicateKeyError(msg string) bool {
	return strings.Contains(msg, "duplicate key value violates unique constraint")
}

func getDuplicateKeyName(msg string) string {
	words := strings.Split(msg, "\"")

	result := strings.Replace(words[1], "_", " ", -1)
	result = strings.Title(result)
	return strings.Replace(result, " Key", "", -1) + " already exists"
}
