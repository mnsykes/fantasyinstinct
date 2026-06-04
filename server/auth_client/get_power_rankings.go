package auth_client

import (
	"fmt"
	"log"
	"math"
	"sort"
)

// ── Period-Only Ranking (non-cumulative — current period only) ────────────────

type PeriodOnlyRanking struct {
	TeamID             string  `json:"teamId"`
	TeamName           string  `json:"teamName"`
	LogoUrl            string  `json:"logoUrl"`
	PeriodPoints       float64 `json:"periodPoints"`
	PeriodWins         int     `json:"periodWins"`
	PeriodWinsVsAll    int     `json:"periodWinsVsAll"`
	PointsPowerRank    float64 `json:"pointsPowerRank"`
	WinsPowerRank      float64 `json:"winsPowerRank"`
	WinsVsAllPowerRank float64 `json:"winsVsAllPowerRank"`
}

// ── Cumulative Ranking Entry ──────────────────────────────────────────────────

type PowerRankingEntry struct {
	ScoringPeriod      int     `json:"scoringPeriod"`
	Date               string  `json:"date"`
	TeamID             string  `json:"teamId"`
	TeamName           string  `json:"teamName"`
	LogoUrl            string  `json:"logoUrl"`
	PeriodPoints       float64 `json:"periodPoints"`
	PeriodWin          int     `json:"periodWin"`
	PeriodWinsVsAll    int     `json:"periodWinsVsAll"`
	TotalPoints        float64 `json:"totalPoints"`
	TotalWins          int     `json:"totalWins"`
	TotalWinsVsAll     int     `json:"totalWinsVsAll"`
	PointsPowerRank    float64 `json:"pointsPowerRank"`
	WinsPowerRank      float64 `json:"winsPowerRank"`
	WinsVsAllPowerRank float64 `json:"winsVsAllPowerRank"`
	TotalPowerRank     float64 `json:"totalPowerRank"`
	Change             float64 `json:"change"`
	WeeksAtOne         int     `json:"weeksAtOne"` // ← NEW
}

// ── Period Output ─────────────────────────────────────────────────────────────

type PeriodRankings struct {
	ScoringPeriod      int                 `json:"scoringPeriod"`
	Date               string              `json:"date"`
	Rankings           []PowerRankingEntry `json:"rankings"`
	PeriodOnlyRankings []PeriodOnlyRanking `json:"periodOnlyRankings"`
}

// ── Root Output ───────────────────────────────────────────────────────────────

type PowerRankingsOutput struct {
	Periods []PeriodRankings `json:"periods"`
}

// ── Internal Types ────────────────────────────────────────────────────────────

type cumulativeTotals struct {
	totalPoints    float64
	totalWins      int
	totalWinsVsAll int
}

type teamInfoRecord struct {
	name      string
	logoUrl   string
	shortName string
}

// ── roundPoints ───────────────────────────────────────────────────────────────
// Rounds to nearest whole number using standard .5-up rule:
//   decimal >= 0.5  →  round up    e.g. 119.667 → 120
//   decimal <  0.5  →  round down  e.g.  78.333 →  78

func roundPoints(pts float64) float64 {
	return math.Round(pts)
}

// ── buildTeamMap ──────────────────────────────────────────────────────────────

func buildTeamMap(teams []LeagueTeam) map[string]teamInfoRecord {
	result := make(map[string]teamInfoRecord, len(teams))
	for _, t := range teams {
		logo := t.LogoURL256
		if logo == "" {
			logo = t.LogoURL128
		}
		result[t.ID] = teamInfoRecord{
			name:      t.Name,
			logoUrl:   logo,
			shortName: t.ShortName,
		}
	}
	return result
}

// ── isConcludedPeriod ─────────────────────────────────────────────────────────
// A period is concluded only when ALL of its matchups are marked Completed.
// Any incomplete matchup means the period is in-progress or future.

func isConcludedPeriod(matchups []Matchup) bool {
	if len(matchups) == 0 {
		return false
	}
	for _, m := range matchups {
		if !m.Completed {
			return false
		}
	}
	return true
}

// ── findPeriodLeaders ─────────────────────────────────────────────────────────
// Returns the teamID(s) with the highest TotalPowerRank in the current period.
// If multiple teams are tied for the top rank they all receive credit.

func findPeriodLeaders(entries []PowerRankingEntry) []string {
	if len(entries) == 0 {
		return nil
	}

	maxRank := entries[0].TotalPowerRank
	for _, e := range entries[1:] {
		if e.TotalPowerRank > maxRank {
			maxRank = e.TotalPowerRank
		}
	}

	leaders := make([]string, 0)
	for _, e := range entries {
		if e.TotalPowerRank == maxRank {
			leaders = append(leaders, e.TeamID)
		}
	}
	return leaders
}

// ── GetPowerRankings ──────────────────────────────────────────────────────────

func (c *Client) GetPowerRankings() (*PowerRankingsOutput, error) {

	log.Println("── GetPowerRankings: start ──────────────────────────────────")

	// ── 1. Fetch team metadata ─────────────────────────────────────────────
	log.Println("Step 1: fetching team info via GetLeagueHomeInfo()...")

	leagueInfo, err := c.GetLeagueHomeInfo()
	if err != nil {
		return nil, fmt.Errorf("GetLeagueHomeInfo failed: %w", err)
	}
	if leagueInfo == nil {
		return nil, fmt.Errorf("GetLeagueHomeInfo returned nil")
	}
	if len(leagueInfo.Teams) == 0 {
		return nil, fmt.Errorf("GetLeagueHomeInfo returned 0 teams")
	}

	teams := buildTeamMap(leagueInfo.Teams)
	log.Printf("Step 1: ✅ %d teams loaded", len(teams))
	for id, t := range teams {
		log.Printf("         %s → %s", id, t.name)
	}

	// ── 2. Fetch all matchups ──────────────────────────────────────────────
	log.Println("Step 2: fetching all matchups via GetAllMatchups()...")

	matchupResult, err := c.GetAllMatchups()
	if err != nil {
		return nil, fmt.Errorf("GetAllMatchups failed: %w", err)
	}
	if matchupResult == nil {
		return nil, fmt.Errorf("GetAllMatchups returned nil")
	}
	if len(matchupResult.Matchups) == 0 {
		return nil, fmt.Errorf("GetAllMatchups returned 0 matchups — check SCHEDULE view")
	}

	log.Printf("Step 2: ✅ %d total matchups fetched", len(matchupResult.Matchups))

	// ── 3. Group matchups by scoring period in chronological order ─────────
	log.Println("Step 3: grouping matchups by scoring period...")

	var periodOrder []int
	periodMatchups := make(map[int][]Matchup)
	periodDates := make(map[int]string)

	for _, m := range matchupResult.Matchups {
		if m.ScoringPeriod == 0 {
			log.Printf("         ⚠️  skipping matchup with ScoringPeriod=0 (%s vs %s)",
				m.HomeTeam.TeamID, m.AwayTeam.TeamID)
			continue
		}
		if _, seen := periodMatchups[m.ScoringPeriod]; !seen {
			periodOrder = append(periodOrder, m.ScoringPeriod)
			periodDates[m.ScoringPeriod] = m.Date
		}
		periodMatchups[m.ScoringPeriod] = append(
			periodMatchups[m.ScoringPeriod], m,
		)
	}

	sort.Ints(periodOrder)
	log.Printf("Step 3: ✅ %d total periods found: %v", len(periodOrder), periodOrder)

	// ── 4. Filter to concluded periods only ───────────────────────────────
	log.Println("Step 4: filtering to concluded periods only...")

	var concludedPeriods []int
	for _, period := range periodOrder {
		fmt.Println(period)
		if isConcludedPeriod(periodMatchups[period]) {
			concludedPeriods = append(concludedPeriods, period)
			log.Printf("         ✅ period %d — concluded", period)
		} else {
			log.Printf("         ⏭️  period %d — skipped (in-progress or future)", period)
		}
	}

	log.Printf("Step 4: ✅ %d concluded periods: %v", len(concludedPeriods), concludedPeriods)

	if len(concludedPeriods) == 0 {
		return nil, fmt.Errorf("no concluded scoring periods found")
	}

	// ── 5. Initialise cumulative trackers for every known team ────────────
	cumulative := make(map[string]*cumulativeTotals)
	for teamID := range teams {
		cumulative[teamID] = &cumulativeTotals{}
	}

	// weeksAtOne tracks how many concluded periods each team
	// has held the #1 totalPowerRank position (ties share credit).
	weeksAtOne := make(map[string]int)
	for teamID := range teams {
		weeksAtOne[teamID] = 0
	}

	prevTotalPowerRank := make(map[string]float64)

	var output PowerRankingsOutput

	// ── 6. Process each concluded period in chronological order ───────────
	for periodIdx, period := range concludedPeriods {
		matchups := periodMatchups[period]
		date := periodDates[period]

		log.Printf("Step 6: processing period %d (%s) — %d matchups",
			period, date, len(matchups))

		// ── 6a. periodPoints ──────────────────────────────────────────────
		// First occurrence per teamID only (no double-counting).
		// roundPoints() applied: >= .5 rounds up, < .5 rounds down.
		periodPoints := make(map[string]float64)
		for _, m := range matchups {
			if m.HomeTeam.TeamID == "" || m.AwayTeam.TeamID == "" {
				log.Printf("         ⚠️  period %d: empty teamID — skipping", period)
				continue
			}
			if _, exists := periodPoints[m.HomeTeam.TeamID]; !exists {
				raw := m.HomeTeam.Total
				rounded := roundPoints(raw)
				periodPoints[m.HomeTeam.TeamID] = rounded
				log.Printf("         home %s raw=%.3f → rounded=%.0f",
					m.HomeTeam.TeamID, raw, rounded)
			}
			if _, exists := periodPoints[m.AwayTeam.TeamID]; !exists {
				raw := m.AwayTeam.Total
				rounded := roundPoints(raw)
				periodPoints[m.AwayTeam.TeamID] = rounded
				log.Printf("         away %s raw=%.3f → rounded=%.0f",
					m.AwayTeam.TeamID, raw, rounded)
			}
		}

		if len(periodPoints) == 0 {
			log.Printf("         ⚠️  period %d: no valid teams — skipping", period)
			continue
		}

		log.Printf("         %d unique teams in period %d", len(periodPoints), period)

		// ── 6b. Track home teams for tie-breaking ─────────────────────────
		// When rounded scores are equal the homeTeam wins.
		homeInPeriod := make(map[string]bool)
		for _, m := range matchups {
			if m.HomeTeam.TeamID != "" {
				homeInPeriod[m.HomeTeam.TeamID] = true
			}
		}

		// ── 6c. periodWin ─────────────────────────────────────────────────
		// Uses rounded totals. homeTeam wins on equal score (>=).
		// Accumulates across all matchups in the period.
		periodWins := make(map[string]int)
		for teamID := range periodPoints {
			periodWins[teamID] = 0
		}
		for _, m := range matchups {
			if m.HomeTeam.TeamID == "" || m.AwayTeam.TeamID == "" {
				continue
			}
			homeRounded := roundPoints(m.HomeTeam.Total)
			awayRounded := roundPoints(m.AwayTeam.Total)

			log.Printf("         matchup %s(%.0f) vs %s(%.0f)",
				m.HomeTeam.TeamID, homeRounded,
				m.AwayTeam.TeamID, awayRounded)

			if homeRounded >= awayRounded {
				periodWins[m.HomeTeam.TeamID]++
				log.Printf("           → %s wins (home >= away)", m.HomeTeam.TeamID)
			} else {
				periodWins[m.AwayTeam.TeamID]++
				log.Printf("           → %s wins (away > home)", m.AwayTeam.TeamID)
			}
		}

		// ── 6d. periodWinsVsAll ───────────────────────────────────────────
		// Uses rounded periodPoints. On equal score homeTeam wins.
		periodWinsVsAll := make(map[string]int)
		for teamID, myPts := range periodPoints {
			count := 0
			for otherID, otherPts := range periodPoints {
				if otherID == teamID {
					continue
				}
				if myPts > otherPts {
					count++
				} else if myPts == otherPts && homeInPeriod[teamID] {
					count++
				}
			}
			periodWinsVsAll[teamID] = count
		}

		// ── 6e. Update cumulative running totals ──────────────────────────
		for teamID := range periodPoints {
			if cumulative[teamID] == nil {
				cumulative[teamID] = &cumulativeTotals{}
			}
			cumulative[teamID].totalPoints += periodPoints[teamID]
			cumulative[teamID].totalWins += periodWins[teamID]
			cumulative[teamID].totalWinsVsAll += periodWinsVsAll[teamID]
		}

		// ── 6f. Build sorted ID slice ─────────────────────────────────────
		sortedIDs := make([]string, 0, len(periodPoints))
		for teamID := range periodPoints {
			sortedIDs = append(sortedIDs, teamID)
		}
		sort.Strings(sortedIDs)

		// ── 6g. Build cumulative entry slice ──────────────────────────────
		entries := make([]PowerRankingEntry, 0, len(sortedIDs))
		for _, teamID := range sortedIDs {
			tm := teams[teamID]
			t := cumulative[teamID]
			entries = append(entries, PowerRankingEntry{
				ScoringPeriod:   period,
				Date:            date,
				TeamID:          teamID,
				TeamName:        tm.name,
				LogoUrl:         tm.logoUrl,
				PeriodPoints:    periodPoints[teamID],
				PeriodWin:       periodWins[teamID],
				PeriodWinsVsAll: periodWinsVsAll[teamID],
				TotalPoints:     t.totalPoints,
				TotalWins:       t.totalWins,
				TotalWinsVsAll:  t.totalWinsVsAll,
			})
		}

		// ── 6h. Compute cumulative power ranks ────────────────────────────
		n := len(entries)
		ptsVals := make([]float64, n)
		winsVals := make([]float64, n)
		vsAllVals := make([]float64, n)

		for i, e := range entries {
			ptsVals[i] = e.TotalPoints
			winsVals[i] = float64(e.TotalWins)
			vsAllVals[i] = float64(e.TotalWinsVsAll)
		}

		ptsRanks := assignRanks(ptsVals)
		winsRanks := assignRanks(winsVals)
		vsAllRanks := assignRanks(vsAllVals)

		for i := range entries {
			entries[i].PointsPowerRank = ptsRanks[i]
			entries[i].WinsPowerRank = winsRanks[i]
			entries[i].WinsVsAllPowerRank = vsAllRanks[i]
			entries[i].TotalPowerRank = ptsRanks[i] + winsRanks[i] + vsAllRanks[i]
		}

		// ── 6i. Change vs previous concluded period ───────────────────────
		for i := range entries {
			if periodIdx == 0 {
				entries[i].Change = 0
			} else if prev, ok := prevTotalPowerRank[entries[i].TeamID]; ok {
				entries[i].Change = entries[i].TotalPowerRank - prev
			}
		}

		for _, e := range entries {
			prevTotalPowerRank[e.TeamID] = e.TotalPowerRank
		}

		// ── 6j. Determine period leader(s) and update weeksAtOne ──────────
		// All teams tied for the highest TotalPowerRank each receive +1.
		leaders := findPeriodLeaders(entries)
		for _, leaderID := range leaders {
			weeksAtOne[leaderID]++
		}
		log.Printf("         period %d leader(s): %v", period, leaders)

		// ── 6k. Write weeksAtOne onto every entry ─────────────────────────
		for i := range entries {
			entries[i].WeeksAtOne = weeksAtOne[entries[i].TeamID]
		}

		// ── 6l. Build period-only (non-cumulative) rankings ───────────────
		periodOnlyRankings := buildPeriodOnlyRankings(
			sortedIDs,
			teams,
			periodPoints,
			periodWins,
			periodWinsVsAll,
		)

		// ── 6m. Sort cumulative entries by TotalPowerRank desc ────────────
		sort.Slice(entries, func(i, j int) bool {
			if entries[i].TotalPowerRank != entries[j].TotalPowerRank {
				return entries[i].TotalPowerRank > entries[j].TotalPowerRank
			}
			return entries[i].TeamID < entries[j].TeamID
		})

		log.Printf("         ✅ period %d — %d entries | leaders: %v | weeksAtOne snapshot: %v",
			period, len(entries), leaders, weeksAtOne)

		output.Periods = append(output.Periods, PeriodRankings{
			ScoringPeriod:      period,
			Date:               date,
			Rankings:           entries,
			PeriodOnlyRankings: periodOnlyRankings,
		})
	}

	if len(output.Periods) == 0 {
		return nil, fmt.Errorf("output has 0 periods after filtering")
	}

	log.Printf("── GetPowerRankings: complete — %d concluded periods ─────────",
		len(output.Periods))

	return &output, nil
}

// ── Endpoint helper functions ─────────────────────────────────────────────────

type TeamPeriodEntry struct {
	ScoringPeriod      int     `json:"scoringPeriod"`
	Date               string  `json:"date"`
	TeamID             string  `json:"teamId"`
	TeamName           string  `json:"teamName"`
	LogoUrl            string  `json:"logoUrl"`
	PeriodPoints       float64 `json:"periodPoints"`
	PeriodWin          int     `json:"periodWin"`
	PeriodWinsVsAll    int     `json:"periodWinsVsAll"`
	TotalPoints        float64 `json:"totalPoints"`
	TotalWins          int     `json:"totalWins"`
	TotalWinsVsAll     int     `json:"totalWinsVsAll"`
	PointsPowerRank    float64 `json:"pointsPowerRank"`
	WinsPowerRank      float64 `json:"winsPowerRank"`
	WinsVsAllPowerRank float64 `json:"winsVsAllPowerRank"`
	TotalPowerRank     float64 `json:"totalPowerRank"`
	Change             float64 `json:"change"`
	WeeksAtOne         int     `json:"weeksAtOne"` // ← NEW
}

type TeamRankingHistory struct {
	TeamID   string            `json:"teamId"`
	TeamName string            `json:"teamName"`
	LogoUrl  string            `json:"logoUrl"`
	Periods  []TeamPeriodEntry `json:"periods"`
}

// GET /rankings

func (c *Client) GetAllPeriodRankings() (*PowerRankingsOutput, error) {
	log.Println("GetAllPeriodRankings: called")
	rankings, err := c.GetPowerRankings()
	if err != nil {
		return nil, fmt.Errorf("GetAllPeriodRankings: %w", err)
	}
	if len(rankings.Periods) == 0 {
		return nil, fmt.Errorf("GetAllPeriodRankings: no concluded periods found")
	}
	log.Printf("GetAllPeriodRankings: returning %d periods", len(rankings.Periods))
	return rankings, nil
}

// GET /rankings/latest

func (c *Client) GetLatestPeriodRankings() (*PeriodRankings, error) {
	log.Println("GetLatestPeriodRankings: called")
	rankings, err := c.GetPowerRankings()
	if err != nil {
		return nil, fmt.Errorf("GetLatestPeriodRankings: %w", err)
	}
	if len(rankings.Periods) == 0 {
		return nil, fmt.Errorf("GetLatestPeriodRankings: no concluded periods found")
	}
	latest := rankings.Periods[len(rankings.Periods)-1]
	log.Printf("GetLatestPeriodRankings: returning period %d (%s)",
		latest.ScoringPeriod, latest.Date)
	return &latest, nil
}

// GET /rankings/period/:period

func (c *Client) GetRankingsByPeriod(periodNum int) (*PeriodRankings, error) {
	log.Printf("GetRankingsByPeriod: called for period %d", periodNum)
	if periodNum <= 0 {
		return nil, fmt.Errorf("GetRankingsByPeriod: invalid period %d", periodNum)
	}
	rankings, err := c.GetPowerRankings()
	if err != nil {
		return nil, fmt.Errorf("GetRankingsByPeriod: %w", err)
	}
	for _, p := range rankings.Periods {
		if p.ScoringPeriod == periodNum {
			log.Printf("GetRankingsByPeriod: ✅ found period %d with %d teams",
				p.ScoringPeriod, len(p.Rankings))
			return &p, nil
		}
	}
	available := make([]int, 0, len(rankings.Periods))
	for _, p := range rankings.Periods {
		available = append(available, p.ScoringPeriod)
	}
	return nil, fmt.Errorf(
		"GetRankingsByPeriod: period %d not found or not yet concluded — available: %v",
		periodNum, available,
	)
}

// GET /rankings/team/:teamId

func (c *Client) GetTeamRankingHistory(teamID string) (*TeamRankingHistory, error) {
	log.Printf("GetTeamRankingHistory: called for team %s", teamID)
	if teamID == "" {
		return nil, fmt.Errorf("GetTeamRankingHistory: teamID cannot be empty")
	}
	rankings, err := c.GetPowerRankings()
	if err != nil {
		return nil, fmt.Errorf("GetTeamRankingHistory: %w", err)
	}
	history := &TeamRankingHistory{
		TeamID:  teamID,
		Periods: make([]TeamPeriodEntry, 0, len(rankings.Periods)),
	}
	for _, p := range rankings.Periods {
		for _, entry := range p.Rankings {
			if entry.TeamID == teamID {
				if history.TeamName == "" {
					history.TeamName = entry.TeamName
					history.LogoUrl = entry.LogoUrl
				}
				history.Periods = append(history.Periods, TeamPeriodEntry{
					ScoringPeriod:      p.ScoringPeriod,
					Date:               p.Date,
					TeamID:             entry.TeamID,
					TeamName:           entry.TeamName,
					LogoUrl:            entry.LogoUrl,
					PeriodPoints:       entry.PeriodPoints,
					PeriodWin:          entry.PeriodWin,
					PeriodWinsVsAll:    entry.PeriodWinsVsAll,
					TotalPoints:        entry.TotalPoints,
					TotalWins:          entry.TotalWins,
					TotalWinsVsAll:     entry.TotalWinsVsAll,
					PointsPowerRank:    entry.PointsPowerRank,
					WinsPowerRank:      entry.WinsPowerRank,
					WinsVsAllPowerRank: entry.WinsVsAllPowerRank,
					TotalPowerRank:     entry.TotalPowerRank,
					Change:             entry.Change,
					WeeksAtOne:         entry.WeeksAtOne, // ← NEW
				})
				break
			}
		}
	}
	if len(history.Periods) == 0 {
		return nil, fmt.Errorf(
			"GetTeamRankingHistory: team %s not found in any concluded period", teamID,
		)
	}
	log.Printf("GetTeamRankingHistory: ✅ %s found in %d periods",
		teamID, len(history.Periods))
	return history, nil
}

// ── buildPeriodOnlyRankings ───────────────────────────────────────────────────

func buildPeriodOnlyRankings(
	sortedIDs []string,
	teams map[string]teamInfoRecord,
	periodPoints map[string]float64,
	periodWins map[string]int,
	periodWinsVsAll map[string]int,
) []PeriodOnlyRanking {

	n := len(sortedIDs)
	if n == 0 {
		return nil
	}

	ptsVals := make([]float64, n)
	winsVals := make([]float64, n)
	vsAllVals := make([]float64, n)

	for i, id := range sortedIDs {
		ptsVals[i] = periodPoints[id]
		winsVals[i] = float64(periodWins[id])
		vsAllVals[i] = float64(periodWinsVsAll[id])
	}

	ptsRanks := assignRanks(ptsVals)
	winsRanks := assignRanks(winsVals)
	vsAllRanks := assignRanks(vsAllVals)

	result := make([]PeriodOnlyRanking, 0, n)
	for i, teamID := range sortedIDs {
		tm := teams[teamID]
		result = append(result, PeriodOnlyRanking{
			TeamID:             teamID,
			TeamName:           tm.name,
			LogoUrl:            tm.logoUrl,
			PeriodPoints:       periodPoints[teamID],
			PeriodWins:         periodWins[teamID],
			PeriodWinsVsAll:    periodWinsVsAll[teamID],
			PointsPowerRank:    ptsRanks[i],
			WinsPowerRank:      winsRanks[i],
			WinsVsAllPowerRank: vsAllRanks[i],
		})
	}

	sort.Slice(result, func(i, j int) bool {
		if result[i].PointsPowerRank != result[j].PointsPowerRank {
			return result[i].PointsPowerRank > result[j].PointsPowerRank
		}
		return result[i].TeamID < result[j].TeamID
	})

	return result
}

// ── assignRanks ───────────────────────────────────────────────────────────────
// Returns fractional ranks where 1 = lowest value and n = highest value.
//   Even-count tie → fractional rank  (2 tied for top of 12 → 11.5 each)
//   Odd-count tie  → whole rank       (3 tied for top of 12 → 11.0 each)

func assignRanks(values []float64) []float64 {
	n := len(values)
	if n == 0 {
		return nil
	}

	type pair struct {
		idx int
		val float64
	}
	pairs := make([]pair, n)
	for i, v := range values {
		pairs[i] = pair{i, v}
	}

	sort.Slice(pairs, func(i, j int) bool {
		return pairs[i].val < pairs[j].val
	})

	ranks := make([]float64, n)
	i := 0
	for i < n {
		j := i
		for j < n && pairs[j].val == pairs[i].val {
			j++
		}
		avg := float64(i+1+j) / 2.0
		for k := i; k < j; k++ {
			ranks[pairs[k].idx] = avg
		}
		i = j
	}
	return ranks
}
