package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "net/http"
    "time"

    "github.com/google/uuid"
    // _ "github.com/go-sql-driver/mysql"
)


type LoginRequest struct {
    Email    string `json:"email"`
    Password string `json:"password"`
}

type RegisterRequest struct {
    ID string `json:"id"`
    Email    string `json:"email"`
    Password string `json:"password"`
    CreatedDate string `json:"created_date"`
}

func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    var req LoginRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }

    var hashedPassword string
    var userID string
    err := db.QueryRow("SELECT id, password FROM users WHERE email = ?", req.Email).Scan(&userID, &hashedPassword)
    if err == sql.ErrNoRows {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    } else if err != nil {
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }

    if !checkPasswordHash(req.Password, hashedPassword) {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    json.NewEncoder(w).Encode(map[string]string{
        "userId": userID,
        "email": req.Email,
    })
}

func registerHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    if r.Method != http.MethodPost {
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        return
    }

    var req RegisterRequest
    err := json.NewDecoder(r.Body).Decode(&req)
    if err != nil {
        fmt.Println("JSON decode error:", err)
        http.Error(w, "Invalid request", http.StatusBadRequest)
        return
    }
    fmt.Println("Decoded register request:", req)

    // Check if user already exists
    var exists bool
    err = db.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE email = ?)", req.Email).Scan(&exists)
    if err != nil {
        fmt.Println("Database error checking user existence:", err)
        http.Error(w, "Database error", http.StatusInternalServerError)
        return
    }
    if exists {
        fmt.Println("Email already registered:", req.Email)
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(map[string]string{"message": "Email already registered"})
        return
    }

    // Generate UUID and current time
    userID := uuid.New().String()
    fmt.Println(userID)
    createdDate := time.Now().Format("2006-01-02 15:04:05") // MySQL DATETIME format

    // Hash the password
    hashedPassword, err := hashPassword(req.Password)
    if err != nil {
        fmt.Println("Error hashing password:", err)
        http.Error(w, "Error hashing password", http.StatusInternalServerError)
        return
    }

    // Insert user into database
    _, err = db.Exec("INSERT INTO users (id, email, password, created_date) VALUES (?, ?, ?, ?)",
        userID, req.Email, hashedPassword, createdDate)
    if err != nil {
        fmt.Println("Error inserting user into DB:", err)
        http.Error(w, "Error saving user", http.StatusInternalServerError)
        return
    }

    fmt.Println("Registration successful for:", req.Email)
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]string{"message": "Registration successful"})
}


