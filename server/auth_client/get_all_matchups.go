package auth_client

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
)

// AllMatchupsResult contains all matchups for a season with team info for lookups
type AllMatchupsResult struct {
	Matchups       []Matchup              `json:"matchups"`
	Teams          map[string]FantasyTeam `json:"teams"` // keyed by teamId
	PeriodMatchups []PeriodMatchup        `json:"periodMatchup"`
}

type PeriodMatchup struct {
	ScoringPeriod int     `json:"scoringPeriod"`
	HomeTeamID    string  `json:"homeTeamId"`
	HomeTeamTotal float64 `json:"homeTeamTotal"`
	HomePeriodWin int     `json:"homePeriodWin"`
	HomeWinsVsAll int     `json:"homeWinsVsAll"`
	AwayTeamID    string  `json:"awayTeamId"`
	AwayTeamTotal float64 `json:"awayTeamTotal"`
	AwayPeriodWin int     `json:"awayPeriodWin"`
	AwayWinsVsAll int     `json:"awayWinsVsAll"`
}

type TeamScore struct {
	TeamID    string  `json:"teamId"`
	Total     float64 `json:"total"`
	BeatCount int     `json:"beatCount"`
}

// GetAllMatchups returns all matchups for the season using the SCHEDULE view
func (c *Client) GetAllMatchups() (*AllMatchupsResult, error) {
	var requestPayload = FantraxRequest{
		Msgs: []FantraxMessage{
			{
				Method: "getStandings",
				Data: map[string]string{
					"leagueId": c.LeagueID,
					"view":     "SCHEDULE",
				},
			},
		},
	}

	jsonStr, err := json.Marshal(requestPayload)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request payload: %w", err)
	}

	req, err := http.NewRequest(
		"POST",
		"https://www.fantrax.com/fxpa/req?leagueId="+c.LeagueID,
		bytes.NewBuffer(jsonStr),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned non-200 status code: %d", resp.StatusCode)
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	var response StandingsResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if len(response.Responses) == 0 {
		return nil, fmt.Errorf("no response data found")
	}

	responseData := response.Responses[0].Data

	// ── Log ALL table types and captions for debugging ─────────────────────
	log.Printf("GetAllMatchups: %d tables in response", len(responseData.TableList))
	for i, table := range responseData.TableList {
		log.Printf("  [%d] type=%-30q caption=%q rows=%d",
			i, table.TableType, table.Caption, len(table.Rows))
	}

	result := &AllMatchupsResult{
		Matchups: make([]Matchup, 0),
		Teams:    responseData.FantasyTeamInfo,
	}

	for _, table := range responseData.TableList {

		// ── Broad filter: capture any table type that is H2H based ─────────
		// This includes H2hPointsBased, H2hPointsBased2, H2hPointsBased3
		// and any other variant Fantrax may use for different periods.
		isH2HTable := table.TableType == "H2hPointsBased3" ||
			table.TableType == "H2hPointsBased2" ||
			table.TableType == "H2hPointsBased1" ||
			table.TableType == "H2hPointsBased"

		// Caption-based fallback: catch any table describing a scoring period
		isScoringPeriodCaption := strings.HasPrefix(table.Caption, "Scoring Period ")

		if !isH2HTable && !isScoringPeriodCaption {
			log.Printf("  skipping table type=%q caption=%q", table.TableType, table.Caption)
			continue
		}

		period := 0
		date := ""

		// Parse period number from caption: "Scoring Period 42"
		if strings.HasPrefix(table.Caption, "Scoring Period ") {
			parts := strings.Split(table.Caption, " ")
			if len(parts) >= 3 {
				period, _ = strconv.Atoi(parts[2])
			}
		}

		if period == 0 {
			log.Printf("  ⚠️  could not parse period from caption=%q — skipping", table.Caption)
			continue
		}

		// Parse date from subCaption
		// Single day:  "(Sat Apr 19, 2025)"
		// Multi-day:   "(Wed Mar 25, 2026 - Thu Mar 26, 2026)"
		if len(table.SubCaption) > 2 {
			date = strings.Trim(table.SubCaption, "()")
			if idx := strings.Index(date, " - "); idx > 0 {
				date = date[:idx]
			}
		}

		log.Printf("  ✅ processing table type=%q period=%d date=%q rows=%d",
			table.TableType, period, date, len(table.Rows))
		if table.TableType == "H2hPointsBased3" {
			for _, row := range table.Rows {
				var matchup Matchup
				matchupCompleted := false
				if len(row.Cells) >= 8 {
					// ── Completed matchup (8 cells) ───────────────────────────
					// [awayTeam, awayPts, awayAdj, awayTotal,
					//  homeTeam, homePts, homeAdj, homeTotal]

					awayPoints, _ := strconv.ParseFloat(row.Cells[1].Content, 64)
					awayAdj, _ := strconv.ParseFloat(row.Cells[2].Content, 64)
					awayTotal, _ := strconv.ParseFloat(row.Cells[3].Content, 64)
					homePoints, _ := strconv.ParseFloat(row.Cells[5].Content, 64)
					homeAdj, _ := strconv.ParseFloat(row.Cells[6].Content, 64)
					homeTotal, _ := strconv.ParseFloat(row.Cells[7].Content, 64)

					// Tie-breaking: homeTeam wins on equal score
					awayPeriodWin := 0
					homePeriodWin := 0
					if homeTotal >= awayTotal {
						homePeriodWin = 1
					} else {
						awayPeriodWin = 1
					}
					if period <= 21 {
						matchupCompleted = true
					}
					matchup = Matchup{
						ScoringPeriod: period,
						Date:          date,
						AwayTeam: MatchTeam{
							TeamID:     row.Cells[0].TeamID,
							Points:     awayPoints,
							Adjustment: awayAdj,
							Total:      awayTotal,
							PeriodWin:  awayPeriodWin,
						},
						HomeTeam: MatchTeam{
							TeamID:     row.Cells[4].TeamID,
							Points:     homePoints,
							Adjustment: homeAdj,
							Total:      homeTotal,
							PeriodWin:  homePeriodWin,
						},
						Completed: matchupCompleted,
					}

				} else if len(row.Cells) >= 4 {
					// ── Future / unplayed matchup (4 cells) ───────────────────
					// [awayTeam, awayScore, homeTeam, homeScore]
					awayTotal, _ := strconv.ParseFloat(row.Cells[1].Content, 64)
					homeTotal, _ := strconv.ParseFloat(row.Cells[3].Content, 64)

					// Tie-breaking: homeTeam wins on equal score
					awayPeriodWin := 0
					homePeriodWin := 0
					if homeTotal >= awayTotal {
						homePeriodWin = 1
					} else {
						awayPeriodWin = 1
					}
					if period <= 21 {
						matchupCompleted = true
					}
					matchup = Matchup{
						ScoringPeriod: period,
						Date:          date,
						AwayTeam: MatchTeam{
							TeamID:         row.Cells[0].TeamID,
							Total:          awayTotal,
							PeriodWin:      awayPeriodWin,
							PeriodWinVsAll: 10,
						},
						HomeTeam: MatchTeam{
							TeamID:         row.Cells[2].TeamID,
							Total:          homeTotal,
							PeriodWin:      homePeriodWin,
							PeriodWinVsAll: 10,
						},
						Completed: matchupCompleted,
					}
				} else {
					log.Printf("  ⚠️  row in period %d has only %d cells — skipping",
						period, len(row.Cells))
					continue
				}

				result.Matchups = append(result.Matchups, matchup)
			}
		}

	}

	log.Printf("GetAllMatchups: ✅ %d total matchups across all periods",
		len(result.Matchups))

	return result, nil
}
