package main

import (
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
)

type Priority string

const (
	Low    Priority = "LOW"
	Medium Priority = "MEDIUM"
	High   Priority = "HIGH"
)

type Task struct {
	ID            string `json:"id"`
	UserID        string `json:"userID"`
	Label         string `json:"label"`
	Priority      string `json:"priority"`
	DueDate       string `json:"dueDate"`
	Completed     bool   `json:"completed"`
	CompletedDate string `json:"completedDate"`
	Deleted       bool   `json:"deleted"`
	DeletedDate   string `json:"deletedDate"`
	CreatedDate   string `json:"createdDate"`
}

func tasksHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")

	switch r.Method {
	case http.MethodGet:
		userID, err := extractUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		rows, err := db.Query(`SELECT id, user_id, label, priority, due_date, completed, completed_date, deleted, deleted_date, created_date FROM tasks WHERE user_id = ?`, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var tasks []Task
		for rows.Next() {
			var t Task
			var dueDate, completedDate, deletedDate, createdDate sql.NullString
			err := rows.Scan(&t.ID, &t.UserID, &t.Label, &t.Priority, &dueDate, &t.Completed, &completedDate, &t.Deleted, &deletedDate, &createdDate)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			t.DueDate = dueDate.String
			t.CompletedDate = completedDate.String
			t.DeletedDate = deletedDate.String
			t.CreatedDate = createdDate.String
			tasks = append(tasks, t)
		}

		json.NewEncoder(w).Encode(tasks)

	case http.MethodPost:
		userID, err := extractUserIDFromToken(r)
		if err != nil {
			http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
			return
		}

		var t Task
		if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		t.ID = uuid.New().String()
		t.UserID = userID
		t.CreatedDate = time.Now().Format("2006-01-02 15:04:05")

		_, err = db.Exec(`
            INSERT INTO tasks (id, user_id, label, priority, due_date, completed, completed_date, deleted, deleted_date, created_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			t.ID, t.UserID, t.Label, t.Priority, t.DueDate, t.Completed, t.CompletedDate, t.Deleted, t.DeletedDate, t.CreatedDate)
		if err != nil {
			log.Printf("Failed to insert task: %v", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(t)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}

func taskByIDHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Content-Type", "application/json")
	id := strings.TrimPrefix(r.URL.Path, "/tasks/")
	if id == "" {
		http.Error(w, "Invalid task ID", http.StatusBadRequest)
		return
	}

	userID, err := extractUserIDFromToken(r)
	if err != nil {
		http.Error(w, "Unauthorized: "+err.Error(), http.StatusUnauthorized)
		return
	}

	switch r.Method {
	case http.MethodPut:
		if r.Header.Get("Content-Type") != "application/json" {
			http.Error(w, "Invalid Content-Type, expected application/json", http.StatusBadRequest)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		var t Task
		if err := json.Unmarshal(body, &t); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		var dueDate, completedDate, deletedDate sql.NullString
		if t.DueDate != "" {
			dueDate = sql.NullString{String: t.DueDate, Valid: true}
		}
		if t.CompletedDate != "" {
			completedDate = sql.NullString{String: t.CompletedDate, Valid: true}
		}
		if t.DeletedDate != "" {
			deletedDate = sql.NullString{String: t.DeletedDate, Valid: true}
		}

		_, err = db.Exec(`
            UPDATE tasks 
            SET label=?, priority=?, due_date=?, completed=?, completed_date=?, deleted=?, deleted_date=?
            WHERE id=? AND user_id=?`,
			t.Label, t.Priority, dueDate, t.Completed, completedDate, t.Deleted, deletedDate, id, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		t.ID = id
		t.UserID = userID
		json.NewEncoder(w).Encode(t)

	case http.MethodDelete:
		_, err := db.Exec("DELETE FROM tasks WHERE id=? AND user_id=?", id, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)

	default:
		http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
	}
}
