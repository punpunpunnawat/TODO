package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type RegisterRequest struct {
	ID          string `json:"id"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	CreatedDate string `json:"created_date"`
}

func generateJWT(userID string) (string, error) {
	claims := jwt.MapClaims{
		"userId": userID,
		"exp":    time.Now().Add(time.Hour * 72).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
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

	fmt.Printf("Login attempt: email=%s\n", req.Email)

	var hashedPassword string
	var userID string
	err := db.QueryRow("SELECT id, password FROM users WHERE email = ?", req.Email).Scan(&userID, &hashedPassword)
	if err == sql.ErrNoRows {
		fmt.Printf("No user found with email: %s\n", req.Email)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	} else if err != nil {
		fmt.Printf("DB query error for email %s: %v\n", req.Email, err)
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	if !checkPasswordHash(req.Password, hashedPassword) {
		fmt.Printf("Password mismatch for user %s\n", req.Email)
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := generateJWT(userID)
	if err != nil {
		fmt.Printf("JWT generation failed for user %s: %v\n", req.Email, err)
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token":  token,
		"userId": userID,
		"email":  req.Email,
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

	userID := uuid.New().String()
	fmt.Println(userID)
	createdDate := time.Now().Format("2006-01-02 15:04:05")

	hashedPassword, err := hashPassword(req.Password)
	if err != nil {
		fmt.Println("Error hashing password:", err)
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

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
