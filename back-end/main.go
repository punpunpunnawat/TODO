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

type Task struct {
    ID           string `json:"id"`
    Label        string `json:"label"`
    Priority     string `json:"priority"`
    DueTime      string `json:"dueTime"`
    CompleteTime string `json:"completeTime"`
    DeleteTime   string `json:"deleteTime"`
    Completed    bool   `json:"completed"`
    Deleted      bool   `json:"deleted"`
}

func enableCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}

func setupDatabase() (*sql.DB, error) {
    dsn := "root:1234@tcp(127.0.0.1:3306)/todo_db"
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, err
    }

    err = db.Ping()
    if err != nil {
        return nil, err
    }

    return db, nil
}

func tasksHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
    w.Header().Set("Content-Type", "application/json")

    switch r.Method {
    case http.MethodGet:
        rows, err := db.Query("SELECT id, label, priority, due_time, completed, deleted, complete_time, delete_time FROM tasks")
        if err != nil {
            http.Error(w, err.Error(), http.StatusInternalServerError)
            return
        }
        defer rows.Close()

        var tasks []Task
        for rows.Next() {
            var t Task
            var dueTime sql.NullString
            err := rows.Scan(&t.ID, &t.Label, &t.Priority, &dueTime, &t.Completed, &t.Deleted, &t.CompleteTime, &t.DeleteTime)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            if dueTime.Valid {
                t.DueTime = dueTime.String
            }

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

        _, err := db.Exec(`
            INSERT INTO tasks (id, label, priority, due_time, completed, deleted, complete_time, delete_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            t.ID, t.Label, t.Priority, t.DueTime, t.Completed, t.Deleted, t.CompleteTime, t.DeleteTime)
		if err != nil {
			log.Printf("Failed to insert task into database: %v\n", err)
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
            log.Println("Failed to decode PUT body:", err)
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        dueTime := t.DueTime

        res, err := db.Exec(`
            UPDATE tasks 
            SET label=?, priority=?, due_time=?, completed=?, deleted=?, complete_time=?, delete_time=? 
            WHERE id=?`,
            t.Label, t.Priority, dueTime, t.Completed, t.Deleted, t.CompleteTime, t.DeleteTime, id)

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

    fmt.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", enableCORS(http.DefaultServeMux)))
}
