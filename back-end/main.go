package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/google/uuid"
	_ "github.com/go-sql-driver/mysql"
)

// Task struct to represent a task
type Task struct {
	ID       string `json:"id"`        // UUID as string
	Label    string `json:"label"`
	Priority string `json:"priority"`
	DueTime  string `json:"dueTime"`
	Done     bool   `json:"done"`
}

// CORS middleware for handling cross-origin requests
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow CORS from the frontend URL
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // Adjust this for your frontend URL
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// Database setup function
func setupDatabase() (*sql.DB, error) {
	// Connection string (user:password@protocol(address)/dbname)
	dsn := "root:1234@tcp(127.0.0.1:3306)/todo_db"
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, err
	}

	// Ensure the database is reachable
	err = db.Ping()
	if err != nil {
		return nil, err
	}

	return db, nil
}

// Handler for /tasks route to GET and POST tasks
func tasksHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		// GET all tasks
		rows, err := db.Query("SELECT id, label, priority, due_time, done FROM tasks")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var tasks []Task
		for rows.Next() {
			var t Task
			var dueTime sql.NullString
			err := rows.Scan(&t.ID, &t.Label, &t.Priority, &dueTime, &t.Done)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Set dueTime if valid
			if dueTime.Valid {
				t.DueTime = dueTime.String
			}

			tasks = append(tasks, t)
		}

		// Respond with the tasks as JSON
		json.NewEncoder(w).Encode(tasks)

	case http.MethodPost:
		// POST a new task
		var t Task
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Generate a new UUID for the task
		t.ID = uuid.New().String()

		// Insert the new task into the database
		_, err := db.Exec("INSERT INTO tasks (id, label, priority, due_time, done) VALUES (?, ?, ?, ?, ?)",
			t.ID, t.Label, t.Priority, t.DueTime, t.Done)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Respond with the new task
		json.NewEncoder(w).Encode(t)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

// Handler for /tasks/{id} route to PUT and DELETE tasks
func taskByIDHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")

	id := strings.TrimPrefix(r.URL.Path, "/tasks/")
	if id == "" {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	switch r.Method {
	case http.MethodPut:
        var t Task
        if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
            log.Println("Failed to decode PUT body:", err)
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }
    
        log.Printf("PUT /tasks/%s - Incoming task: %+v\n", id, t)
    
        res, err := db.Exec("UPDATE tasks SET label=?, priority=?, due_time=?, done=? WHERE id=?",
            t.Label, t.Priority, t.DueTime, t.Done, id)
    
        if err != nil {
            log.Println("SQL update error:", err)
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
    
        rowsAffected, _ := res.RowsAffected()
        log.Printf("Rows affected: %d\n", rowsAffected)
    
        t.ID = id
        json.NewEncoder(w).Encode(t)
    

	case http.MethodDelete:
		// DELETE a task
		_, err := db.Exec("DELETE FROM tasks WHERE id=?", id)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent) // 204 No Content

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func main() {
	// Set up the database connection
	db, err := setupDatabase()
	if err != nil {
		log.Fatal("Database connection failed:", err)
	}
	defer db.Close()

	// Set up the HTTP routes
	http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
		tasksHandler(w, r, db)
	})

	http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
		taskByIDHandler(w, r, db)
	})

	// Wrap the handlers with CORS middleware
	fmt.Println("Server running at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(http.DefaultServeMux)))
}
