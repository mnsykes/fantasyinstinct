package query

import (
	"api/models"
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	log "github.com/sirupsen/logrus"
)

func GetTeams() ([]models.Team, error) {
	dsn := "../../../DataGripProjects/FantasyInstinctApp/FantasyInstinct.db?_journal_mode=WAL&busy_timeout=5000"
	db, err := sql.Open("sqlite3", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}
	rows, err := db.Query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
	fmt.Println(rows)
}
