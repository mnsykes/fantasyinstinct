

export interface ScoringPeriod {
    period: [{
        teamId: string,
        total: number,
        winsVsAll: number
    }];
}