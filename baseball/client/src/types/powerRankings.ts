export interface PowerRankings {
    currentPeriod: number;
    periods: [{
        scoringPeriod: number;
        date: number;
    }]
    rankings: [{
        change: number;
        logoUrl: string;
        periodPoints: number;
        periodWin: number;
        periodWinsVsAll: number;
        pointsPowerRank: number;
        scoringPeriod: number;
        teamId: string;
        teamName: string;
        totalPoints: number;
        totalPowerRank: number;
        totalWins: number;
        totalWinsVsAll: number;
        winsPowerRank: number;
        winsVsAllPowerRank: number;
    }]
}

export interface PowerRankingPodium {
    podium: [{
        scoringPeriod: number;
        logoUrl: string;
        periodPoints: number;
        periodWin: number;
        periodWinsVsAll: number;
        pointsPowerRank: number;
        teamId: string;
        teamName: string;
        winsPowerRank: number;
        winsVsAllPowerRank: number;
        totalPowerRank: number;
    }]
}