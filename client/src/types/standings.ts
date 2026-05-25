interface Team {
    teamId: string,
    name: string,
    shortName: string,
    logoUrl: string,
    rank: number,
    wins: number,
    losses: number,
    ties: number,
    winPct: number,
    divRecord: string,
    gamesBack: number,
    waiverOrder: number
    pointsFor: number,
    pointsAgainst: number
    streak: string
}

export interface Standings {
    teams: Team[];
}
