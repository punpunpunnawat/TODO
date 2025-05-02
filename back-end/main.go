package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "strconv"
    "strings"

    _ "github.com/go-sql-driver/mysql"
)

type Task struct {
    ID       int    `json:"id"`
    Label    string `json:"label"`
    Priority string `json:"priority"`
    DueTime  string `json:"dueTime"`
    Done     bool   `json:"done"`
}

func main() {
    dsn := "root:1234@tcp(127.0.0.1:3306)/todo_db"
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        log.Fatal(err)
    }
    defer db.Close()

    http.HandleFunc("/tasks", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Content-Type", "application/json")

        switch r.Method {
        case http.MethodGet:
            rows, err := db.Query("SELECT * FROM tasks")
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }
            defer rows.Close()

            var tasks []Task
            for rows.Next() {
                var t Task
                err := rows.Scan(&t.ID, &t.Label, &t.Priority, &t.DueTime, &t.Done)
                if err != nil {
                    http.Error(w, err.Error(), http.StatusInternalServerError)
                    return
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

            res, err := db.Exec("INSERT INTO tasks (label, priority, due_time, done) VALUES (?, ?, ?, ?)",
                t.Label, t.Priority, t.DueTime, t.Done)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            id, _ := res.LastInsertId()
            t.ID = int(id)
            json.NewEncoder(w).Encode(t)

        default:
            http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        }
    })

    // สำหรับ PUT และ DELETE เช่น /tasks/1
    http.HandleFunc("/tasks/", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Content-Type", "application/json")

        idStr := strings.TrimPrefix(r.URL.Path, "/tasks/")
        id, err := strconv.Atoi(idStr)
        if err != nil {
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

            _, err := db.Exec("UPDATE tasks SET label=?, priority=?, due_time=?, done=? WHERE id=?",
                t.Label, t.Priority, t.DueTime, t.Done, id)
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
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

            w.WriteHeader(http.StatusNoContent) // 204 No Content

        default:
            http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        }
    })

    fmt.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
