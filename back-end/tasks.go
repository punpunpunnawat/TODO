package main

import (
    "database/sql"
    "encoding/json"
    "log"
    "net/http"
    "strings"
    "time"

    "github.com/google/uuid"
)

type Task struct {
    ID             string `json:"id"`
    UserID         string `json:"userID"`
    Label          string `json:"label"`
    Priority       int    `json:"priority"`
    DueDate        string `json:"dueDate"`
    Completed      bool   `json:"completed"`
    CompletedDate  string `json:"completedDate"`
    Deleted        bool   `json:"deleted"`
    DeletedDate    string `json:"deletedDate"`
    CreatedAt      string `json:"createdAt"`
}

func tasksHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    w.Header().Set("Content-Type", "application/json")

    switch r.Method {
    case http.MethodGet:
        userID := r.URL.Query().Get("user_id")
        if userID == "" {
            http.Error(w, "Missing user_id", http.StatusBadRequest)
            return
        }

        rows, err := db.Query(`SELECT id, user_id, label, priority, due_date, completed, completed_date, deleted, deleted_date, created_at FROM tasks WHERE user_id = ?`, userID)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var tasks []Task
        for rows.Next() {
            var t Task
            var dueDate, completedDate, deletedDate, createdAt sql.NullString
            err := rows.Scan(&t.ID, &t.UserID, &t.Label, &t.Priority, &dueDate, &t.Completed, &completedDate, &t.Deleted, &deletedDate, &createdAt)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            t.DueDate = dueDate.String
            t.CompletedDate = completedDate.String
            t.DeletedDate = deletedDate.String
            t.CreatedAt = createdAt.String
            tasks = append(tasks, t)
        }

        json.NewEncoder(w).Encode(tasks)

    case http.MethodPost:
        var t Task
        if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        t.ID = uuid.New().String()
        t.CreatedAt = time.Now().Format("2006-01-02 15:04:05")

        _, err := db.Exec(`
            INSERT INTO tasks (id, user_id, label, priority, due_date, completed, completed_date, deleted, deleted_date, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            t.ID, t.UserID, t.Label, t.Priority, t.DueDate, t.Completed, t.CompletedDate, t.Deleted, t.DeletedDate, t.CreatedAt)
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

    switch r.Method {
    case http.MethodPut:
        var t Task
        if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        _, err := db.Exec(`
            UPDATE tasks 
            SET label=?, priority=?, due_date=?, completed=?, completed_date=?, deleted=?, deleted_date=?
            WHERE id=?`,
            t.Label, t.Priority, t.DueDate, t.Completed, t.CompletedDate, t.Deleted, t.DeletedDate, id)
        if err != nil {
            // http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }

        t.ID = id
        json.NewEncoder(w).Encode(t)

    case http.MethodDelete:
        _, err := db.Exec("DELETE FROM tasks WHERE id=?", id)
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        w.WriteHeader(http.StatusNoContent)

    default:
        http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
    }
}
