export type PowerRankingTeamInfo = {
    teams: [{
        teamId: string;
        name: string;
        shortName: string;
        logoUrl: string;
        wins: number;
        pointsFor: number;
    }]
}

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