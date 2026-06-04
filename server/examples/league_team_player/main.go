package main

import (
	"fmt"
	"os"

	"github.com/pmurley/go-fantrax"
	log "github.com/sirupsen/logrus"
)

func main() {
	// Get league ID from environment variable or use default
	leagueID := os.Getenv("FANTRAX_LEAGUE_ID")
	leagueID = "er2bf6v3mhairboa"
	if leagueID == "" {
		leagueID = "er2bf6v3mhairboa" // Default from the example
	}

	// Create client with caching enabled
	client, err := fantrax.NewClient(leagueID, true)
	if err != nil {
		log.Fatalf("Failed to create client: %v", err)
	}

	rosterInfo, err := client.GetTeamRosters()
	if err != nil {
		log.Fatalf("Failed to get team rosters: %v", err)
	}

	playerIds, err := client.GetPlayerIds(fantrax.MLB)
	if err != nil {
		log.Fatalf("Failed to get player IDs: %v", err)
	}

	fmt.Printf("Total players: %d\n", len(*playerIds))

	for _, roster := range rosterInfo.Rosters {
		for _, player := range roster.RosterItems {
			playerInfo := (*playerIds)[player.ID]
			fmt.Printf("Name: %s		ID: %s		Team: %s	Status: %s\n", playerInfo.Name, player.ID, roster.TeamName, player.Status)
		}
	}

}
