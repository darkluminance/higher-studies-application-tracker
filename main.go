package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/darkluminance/gotutorial/internal/database"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"

	_ "github.com/lib/pq"
)

type apiConfig struct {
	DB *database.Queries
}

func main() {
	godotenv.Load()

	port := os.Getenv("PORT")
	dbURL := os.Getenv("DB_URL")

	if port == "" {
		log.Fatal("Port must be set in the environment")
	}
	if dbURL == "" {
		log.Fatal("DB_URL must be set in the environment:")
	}

	conn, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatal("Can't connect to database:", err)
	}

	apiCfg := apiConfig{
		DB: database.New(conn),
	}

	router := chi.NewRouter()
	router.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300,
	}))

	v1Router := chi.NewRouter()
	v1Router.Get("/ready", handlerReadiness)
	v1Router.Get("/err", handlerError)
	v1Router.Get("/login", apiCfg.handlerGetUserByUsernameAndPassword)

	v1Router.Post("/users/create", apiCfg.handlerCreateUser)
	v1Router.Post("/users/get", apiCfg.handlerGetUserByUsername)
	v1Router.Get("/users/user/get", apiCfg.middlewareAuth(apiCfg.handlerGetUserByToken))

	v1Router.Post("/universitylist/create", apiCfg.middlewareAuth(apiCfg.handlerCreateUniversityList))
	v1Router.Post("/universitylist/university/add", apiCfg.middlewareAuth(apiCfg.handlerInsertUniversityIntoList))
	v1Router.Get("/universitylist/user/get", apiCfg.middlewareAuth(apiCfg.handlerGetUniversityListsOfUser))
	v1Router.Post("/universitylist/get", apiCfg.middlewareAuth(apiCfg.handlerGetUniversityListByID))
	v1Router.Post("/universitylist/update", apiCfg.middlewareAuth(apiCfg.handlerUpdateUniversityListByID))
	v1Router.Post("/universitylist/delete", apiCfg.middlewareAuth(apiCfg.handlerDeleteUniversityListByID))
	v1Router.Post("/universitylist/university/delete", apiCfg.middlewareAuth(apiCfg.handlerRemoveUniversityFromLists))

	v1Router.Post("/university/create", apiCfg.middlewareAuth(apiCfg.handlerCreateUniversity))
	v1Router.Get("/university/user/get", apiCfg.middlewareAuth(apiCfg.handlerGetUniversitiesOfUser))
	v1Router.Post("/university/get", apiCfg.middlewareAuth(apiCfg.handlerGetUniversityByID))
	v1Router.Post("/university/update", apiCfg.middlewareAuth(apiCfg.handlerUpdateUniversityByID))
	v1Router.Post("/university/delete", apiCfg.middlewareAuth(apiCfg.handlerDeleteUniversityByID))

	v1Router.Post("/recommenders/create", apiCfg.middlewareAuth(apiCfg.handlerCreateRecommender))
	v1Router.Post("/recommenders/update", apiCfg.middlewareAuth(apiCfg.handlerUpdateRecommenderByID))
	v1Router.Get("/recommenders/user/get", apiCfg.middlewareAuth(apiCfg.handlerGetRecommendersOfUser))
	v1Router.Post("/recommenders/get", apiCfg.middlewareAuth(apiCfg.handlerGetRecommenderByID))
	v1Router.Post("/recommenders/delete", apiCfg.middlewareAuth(apiCfg.handlerDeleteRecommenderByID))

	v1Router.Post("/faculties/create", apiCfg.middlewareAuth(apiCfg.handlerCreateFaculty))
	v1Router.Post("/faculties/update", apiCfg.middlewareAuth(apiCfg.handlerUpdateFacultyByID))
	v1Router.Get("/faculties/user/get", apiCfg.middlewareAuth(apiCfg.handlerGetFacultiesOfUser))
	v1Router.Post("/faculties/get", apiCfg.middlewareAuth(apiCfg.handlerGetFacultyByID))
	v1Router.Post("/faculties/delete", apiCfg.middlewareAuth(apiCfg.handlerDeleteFacultyByID))

	router.Mount("/v1", v1Router)

	server := &http.Server{
		Handler: router,
		Addr:    ":" + port,
	}

	fmt.Printf("Server is running on port %s\n", port)

	error := server.ListenAndServe()
	if error != nil {
		log.Fatal(error)
	}

}
