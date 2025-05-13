package main

import (
    "fmt"
    "log"
    "net/http"
)

func main() {
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

    fmt.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", enableCORS(http.DefaultServeMux)))
}
