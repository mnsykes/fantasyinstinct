type Icon = {
    tooltip: string;
    typeId: string
}

export type Player = {
    PlayerID: string;
    Name: string;
    ShortName: string;
    URLName: string
    MLBTeamName: string;
    MLBTeamId: string;
    Age: number;
    Rookie: boolean;
    MinorsEligible: boolean;
    Positions: string[];
    PositionsNoFlex: string[];
    PrimaryPosID: string;
    DefaultPosID: string;
    PosShortNames: string;
    MultiPositions: string;
    FantasyStatus: string;
    FantasyTeamId: string;
    FantasyTeamName: string;
    Rank: number;
    FantasyPoints: number;
    FantasyPointsPerG: number;
    PercentDrafted: number;
    ADP: number;
    PercentRostered: number;
    RosterChange: number;
    NextOpponent: string;
    HeadshotURL: string;
    Icons: Icon[];
    Actions: string;
}