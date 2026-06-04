type MatchupList = {
    away: {
        name: string
        id: string;
        shortName: string;
    }
    home: {
        name: string;
        id: string;
        shortName: string;
    }
}

type Matchup = {
    period: number;
    matchupList: MatchupList[];
}

export type LeagueInfo = {
    matchups: Matchup;

}