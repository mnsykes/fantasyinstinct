package main

import (
	"api/auth_client"
	"fmt"
	"net/http"
	"os"
	"sort"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
	log "github.com/sirupsen/logrus"
)

func init() {
	if err := godotenv.Load(".env"); err != nil {
		log.Print(".env file not found")
	}
}

var leagueId = os.Getenv("FANTRAX_LEAGUE_ID")

func main() {

	// Get league ID from environment variable
	leagueID := os.Getenv("FANTRAX_LEAGUE_ID")

	leagueID = "er2bf6v3mhairboa"
	if leagueID == "" {
		log.Fatal("FANTRAX_LEAGUE_ID must be set")
	}

	// Create client (caching disabled for fresh data)
	fmt.Println("Creating auth client...")
	client, err := auth_client.NewClient(leagueID, false)

	if err != nil {
		log.Fatalf("Failed to create auth client: %v", err)
	}

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/playerPool", func(c *gin.Context) {
		// Fetch all players
		players, err := client.GetPlayerPool()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, players)

	})

	router.GET("/standings", func(c *gin.Context) {
		// Fetch all players
		standings, err := client.GetStandings()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, standings)

	})

	router.GET("/league", func(c *gin.Context) {
		// Fetch all players
		league, err := client.GetLeagueHomeInfo()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, league)

	})

	router.GET("/transactions", func(c *gin.Context) {
		// Fetch all players
		transactions, err := client.GetTransactionHistory("50")
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, transactions)

	})

	router.GET("/matchups", func(c *gin.Context) {
		// Fetch all players
		matchups, err := client.GetAllMatchups()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, matchups)

	})

	router.GET("/roster/:id", func(c *gin.Context) {
		// Fetch all players
		teamId := c.Param("id")

		roster, err := client.GetMyTeamRosterInfoRaw("", teamId)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Player pool is empty"})
		}
		c.JSON(http.StatusOK, roster)
		return
	})

	router.GET("/current", func(c *gin.Context) {
		current, err := client.GetLeagueSetupMatchups()
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Current period is empty"})
		}
		c.JSON(http.StatusOK, current)
		return
	})

	// ── 4. Rankings routes ────────────────────────────────────────────────

	// GET /rankings — all periods all teams
	router.GET("/rankings", func(c *gin.Context) {
		rankings, err := client.GetAllPeriodRankings()
		if err != nil {
			log.Printf("❌ GET /rankings error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "failed to get rankings",
				"details": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, rankings)
	})

	// GET /rankings/latest — most recent period only
	router.GET("/rankings/latest", func(c *gin.Context) {
		latest, err := client.GetLatestPeriodRankings()
		if err != nil {
			log.Printf("❌ GET /rankings/latest error: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "failed to get latest period rankings",
				"details": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, latest)
	})

	// GET /rankings/period/:period — single period by number
	router.GET("/rankings/period/:period", func(c *gin.Context) {
		periodParam := c.Param("period")

		periodNum, err := strconv.Atoi(periodParam)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "invalid period number",
				"details": fmt.Sprintf("%q is not a valid integer", periodParam),
			})
			return
		}

		period, err := client.GetRankingsByPeriod(periodNum)
		if err != nil {
			log.Printf("❌ GET /rankings/period/%d error: %v", periodNum, err)
			c.JSON(http.StatusNotFound, gin.H{
				"error":   fmt.Sprintf("period %d not found", periodNum),
				"details": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, period)
	})

	// GET /rankings/team/:teamId — one team across all periods
	router.GET("/rankings/team/:teamId", func(c *gin.Context) {
		teamID := c.Param("teamId")

		if teamID == "" {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "teamId parameter is required",
			})
			return
		}

		history, err := client.GetTeamRankingHistory(teamID)
		if err != nil {
			log.Printf("❌ GET /rankings/team/%s error: %v", teamID, err)
			c.JSON(http.StatusNotFound, gin.H{
				"error":   fmt.Sprintf("team %s not found", teamID),
				"details": err.Error(),
			})
			return
		}
		c.JSON(http.StatusOK, history)
	})

	router.GET("/debug/rankings", func(c *gin.Context) {
		result := gin.H{}

		// ── Test 1: GetAllMatchups ─────────────────────────────────────────
		matchups, err := client.GetAllMatchups()
		if err != nil {
			result["getAllMatchupsError"] = err.Error()
			result["getAllMatchupsOk"] = false
		} else if matchups == nil {
			result["getAllMatchupsError"] = "returned nil"
			result["getAllMatchupsOk"] = false
		} else {
			result["getAllMatchupsOk"] = true
			result["matchupCount"] = len(matchups.Matchups)
			result["teamCount"] = len(matchups.Teams)

			// Show first 3 matchups
			preview := []gin.H{}
			for i, m := range matchups.Matchups {
				if i >= 3 {
					break
				}
				preview = append(preview, gin.H{
					"scoringPeriod": m.ScoringPeriod,
					"date":          m.Date,
					"homeTeamId":    m.HomeTeam.TeamID,
					"homeTotal":     m.HomeTeam.Total,
					"awayTeamId":    m.AwayTeam.TeamID,
					"awayTotal":     m.AwayTeam.Total,
				})
			}
			result["matchupPreview"] = preview

			// Show unique periods
			periods := map[int]bool{}
			for _, m := range matchups.Matchups {
				periods[m.ScoringPeriod] = true
			}
			periodList := []int{}
			for p := range periods {
				periodList = append(periodList, p)
			}
			sort.Ints(periodList)
			result["scoringPeriods"] = periodList
		}

		// ── Test 2: GetPowerRankings ───────────────────────────────────────
		rankings, err := client.GetPowerRankings()
		if err != nil {
			result["getPowerRankingsError"] = err.Error()
			result["getPowerRankingsOk"] = false
		} else if rankings == nil {
			result["getPowerRankingsError"] = "returned nil"
			result["getPowerRankingsOk"] = false
		} else {
			result["getPowerRankingsOk"] = true
			result["periodCount"] = len(rankings.Periods)
			if len(rankings.Periods) > 0 {
				result["firstPeriod"] = rankings.Periods[0].ScoringPeriod
				result["lastPeriod"] = rankings.Periods[len(rankings.Periods)-1].ScoringPeriod
				result["teamsInFirstPeriod"] = len(rankings.Periods[0].Rankings)
			}
		}

		c.JSON(http.StatusOK, result)
	})

	router.Run(":4000")
}
