package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := setupDatabase()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
	defer db.Close()

	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		tasksHandler(w, r, db)
	})
	http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
		taskByIDHandler(w, r, db)
	})
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		loginHandler(w, r, db)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Register called")
		registerHandler(w, r, db)
	})

	port := os.Getenv("PORT")

	fmt.Println("Server running at http://localhost:" + port)
	log.Fatal(http.ListenAndServe(":"+port, enableCORS(http.DefaultServeMux)))
}
