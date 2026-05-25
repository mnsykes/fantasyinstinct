import axios from "axios";
import config from "../config";
import { Team } from "../types/teams";
import { RosterTable } from "../types/rosterTable";
import { PowerRankingTeamInfo, PowerRankings } from "../types/powerRankings";
import { ScoringPeriod } from "../types/scoringPeriod";

const getTeamInfoById = async (teamId: string): Promise<Team> => {
    const url = `${config.baseApiUrl}/roster/${teamId}`;

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
    const url = `${config.baseApiUrl}/roster/${teamId}`;

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
    const url = `${config.baseApiUrl}/roster/${teamId}`
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
console.log(sortedPowerRankings.periods.sort((a, b) => b.scoringPeriod - a.scoringPeriod))
    return sortedPowerRankings
}

const getPowerRankingTeamInfo = async (teams) => {

    const newPowerRankingTeamInfo: PowerRankingTeamInfo = {
        teams: [{
            teamId: "",
            name: "",
            shortName: "",
            logoUrl: ""
        }]
    }

    Object.keys(teams).forEach((teamId) => {
        console.log(teamId)
        if (teams[teamId].teamId != '') {
            newPowerRankingTeamInfo.teams.push(
                {
                    teamId: teams[teamId].teamId,
                    name: teams[teamId].name,
                    shortName: teams[teamId].shortName,
                    logoUrl: eams[teamId].logoUrl
                }
            )
        }
    })
    console.log(newPowerRankingTeamInfo)

    return newPowerRankingTeamInfo;
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
    const url = `${config.baseApiUrl}/matchups`;
    const response = await axios.get(url);
    if (!response.data) throw new Error ("Could not find matchups");

    response.data.matchups.forEach((match: any) => {
        if (match.awayTeam.total !== 0 && match.homeTeam.total !== 0) console.log(match);
    })
    console.log(response.data.matchups);
    return response.data;
}

const getPeriods = async () => {}

export default getTeamInfoById;
export {
    getSalaryInfoById,
    getTeamRosterById,
    getPowerRankingTeamInfo,
    getScoringPeriod,
    processPowerRankings,
    getMatchups
};