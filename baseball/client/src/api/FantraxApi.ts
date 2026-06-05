import axios from "axios";
import type { Team } from "../types/teams";
import type { RosterTable } from "../types/rosterTable";
import type { ScoringPeriod } from "../types/scoringPeriod";
import type { PowerRankingPodium } from "../types/powerRankings.ts";

const apiUrl = import.meta.env.VITE_API_URL;
const getTeamInfoById = async (teamId: string): Promise<Team> => {
    const url = `${apiUrl}/roster/${teamId}`;

    const response = await axios.get(url);
    if (!response.data) throw new Error ("Could not find matchups");

    const { responses: [
            {
                data: {
                    myTeamIds: [ id ],
                    teamHeadingInfo: {
                        owners: {
                            value: ownerName
                        }
                    },
                    miscData: {
                        salaryInfo: {
                            info: [
                                used,
                                remaining,
                                cap,
                                floor,
                                claim
                            ]
                        }
                    }
                }
            }
        ]
    } = response.data;

    const newTeam: Team = {
        id: id,
        name: ownerName,
        salaryInfo: {
            cap: cap,
            used: used,
            remaining: remaining,
            floor: floor,
        }
    }

    return newTeam;
}

const getTeamRosterById = async (teamId: string): Promise<RosterTable> => {
    const url = `${apiUrl}/roster/${teamId}`;

    const response = await axios.get(url);
    if (!response.data) throw new Error ("Could not find matchups");

    const { responses:
        [
            {
                data: {
                    tables: [
                        hitting,
                        pitching
                    ]
                }
            }
        ]
    } = response.data;

    const newRosterTable: RosterTable = {
        hitting: hitting,
        pitching: pitching,
    }

    return newRosterTable;
};

const getSalaryInfoById = async (teamId: string) => {
    const url = `${apiUrl}/roster/${teamId}`
    const response = await axios.get(url);
    if (!response.data) throw new Error ("Could not find matchups");
    const { responses: [
        {
            data: {
                miscData: { salaryInfo }
            }
        }
        ]
    } = response.data;

    return salaryInfo
}

const processPowerRankings = async (response: any) => {
    const sortedPowerRankings = response

    return sortedPowerRankings
}

const processWeeklyPowerRankings = async (response: any) => {

    const newPowerRankingPodium: PowerRankingPodium = {
        podium: [{
            scoringPeriod: 0,
            logoUrl: "",
            periodPoints: 0,
            periodWin: 0,
            periodWinsVsAll: 0,
            pointsPowerRank: 0,
            teamId: "",
            teamName: "",
            winsPowerRank: 0,
            winsVsAllPowerRank: 0,
            totalPowerRank: 0
        }]
    }

    response.periods.forEach((period) => {
            period.periodOnlyRankings.forEach((p) => {

                if (p.teamId != "") {
                    newPowerRankingPodium.podium.push({
                        scoringPeriod: period.scoringPeriod,
                        logoUrl: p.logoUrl,
                        periodPoints: p.periodPoints,
                        periodWin: p.periodWin,
                        periodWinsVsAll: p.periodWinsVsAll,
                        pointsPowerRank: p.pointPowerRank,
                        teamId: p.teamId,
                        teamName: p.teamName,
                        winsPowerRank: p.winsPowerRank,
                        winsVsAllPowerRank: p.winsVsAllPowerRank,
                        totalPowerRank: p.pointsPowerRank + p.winsPowerRank + p.winsVsAllPowerRank
                    })
                }
            })
    })
    newPowerRankingPodium.podium.sort((a, b) => b.periodPoints - a.periodPoints).splice(3);

    return newPowerRankingPodium
}

const getPowerRankingsByPeriod = async (period: number) => {

    if (period != null) {
        const response = await axios.get(`${apiUrl}/rankings/period/${period}`)

        return response.data
    }

}

const getPowerRankings = async () => {
    let response = await axios.get(`${apiUrl}/rankings/latest`)

    return response.data
}

const getCurrentPowerRankings = async () => {
        const response = await axios.get(`${apiUrl}/rankings/latest`)

        return response.data.rankings;
}

const getAllPowerRankings = async () => {
    const response = await axios.get(`${apiUrl}/rankings`)

    return response.data.periods
}

const getScoringPeriod = async (matchups) => {

    const newScoringPeriod: ScoringPeriod = {
        period: [{
            teamId: "",
            total: 0,
            winsVsAll: 0
        }]
    }

    matchups.forEach((matchup: any) => {
        if (matchup.scoringPeriod === 1 && matchup.homeTeamId != "" && matchup.homeTeamTotal != 0) {
            newScoringPeriod.period.push({teamId: matchup.homeTeamId, total: matchup.homeTeamTotal, winsVsAll: matchup.homeWinsVsAll});
            newScoringPeriod.period.push({teamId: matchup.awayTeamId, total: matchup.awayTeamTotal, winsVsAll: matchup.awayWinsVsAll});
        }
    })

    return newScoringPeriod;
}

const getMatchups = async () => {
    const url = `${apiUrl}/matchups`;
    const response = await axios.get(url);
    if (!response.data) throw new Error ("Could not find matchups");

    response.data.matchups.forEach((match: any) => {
        if (match.awayTeam.total !== 0 && match.homeTeam.total !== 0) console.log(match);
    })

    return response.data;
}

export default getTeamInfoById;
export {
    getSalaryInfoById,
    getTeamRosterById,
    getScoringPeriod,
    getPowerRankings,
    getCurrentPowerRankings,
    getPowerRankingsByPeriod,
    getAllPowerRankings,
    processPowerRankings,
    processWeeklyPowerRankings,
    getMatchups
};