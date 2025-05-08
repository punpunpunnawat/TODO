package main

import (
    "database/sql"
    _ "github.com/go-sql-driver/mysql"
)

func setupDatabase() (*sql.DB, error) {
    dsn := "root:1234@tcp(127.0.0.1:3306)/todo_db"
    db, err := sql.Open("mysql", dsn)
    if err != nil {
        return nil, err
    }
    if err = db.Ping(); err != nil {
        return nil, err
    }
    return db, nil
}
