package main

import (
    "database/sql"
    "encoding/json"
    "fmt"
    "log"
    "net/http"

    _ "github.com/go-sql-driver/mysql"
)

type Task struct {
    ID       int    `json:"id"`
    Label    string `json:"label"`
    Priority string `json:"priority"`
    DueTime  string `json:"due_time"`
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
        if r.Method == http.MethodGet {
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

            w.Header().Set("Content-Type", "application/json")
            json.NewEncoder(w).Encode(tasks)
        }
    })

    fmt.Println("Server running at http://localhost:8080")
    log.Fatal(http.ListenAndServe(":8080", nil))
}
