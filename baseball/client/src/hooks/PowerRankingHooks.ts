import config from "../config"
import { useQuery } from "@tanstack/react-query";
import { processWeeklyPowerRankings, getMatchups, getPowerRankings, getAllPowerRankings, getPowerRankingsByPeriod, getCurrentPowerRankings } from "../api/FantraxApi"
import axios from "axios";


const useFetchCurrentScoringPeriod = () => {
    return useQuery({
        queryKey: ["currentScoringPeriod"],
        queryFn: async () => {
            const response = await axios.get(`${config.baseApiUrl}/rankings/latest`)
            const currentScoringPeriod = response.data.scoringPeriod

            return currentScoringPeriod
        }
    })
}

const useFetchPowerRankingPeriods = () => {
    return useQuery({
        queryKey: ["powerRankingPeriods"],
        queryFn: getAllPowerRankings
    })
}

const useFetchPowerRankings = () => {
    return useQuery({
        queryKey: ["powerRankings"],
        queryFn: getPowerRankings
    })
}

const useFetchCurrentPowerRankings = () => {
    return useQuery({
        queryKey: ["currentPowerRankings"],
        queryFn: getCurrentPowerRankings
    })
}

const useFetchPowerRankingsByTeam = (teamId: string) => {
    return useQuery({
        queryKey: ["teamPowerRankings"],
        queryFn: async () => {
            const response = await axios.get(`${config.baseApiUrl}/rankings/team/${teamId}`)
            const team = response.data

            return team
        }
    })
}

const useFetchWeeklyPowerRankings = () => {
    return useQuery({
        queryKey: ["weeklyPowerRankings"],
        queryFn: async () => {
            const response = await axios.get(`${config.baseApiUrl}/rankings`)

            const data = await processWeeklyPowerRankings(response.data)
            return data
        }
    })
}

const useFetchPowerRankingsByPeriod = (scoringPeriod: null) => {
    return useQuery({
        queryKey: ["periodPowerRankings"],
        queryFn: async () => {

            const periodRankings = await getPowerRankingsByPeriod
console.log(scoringPeriod)
            return periodRankings
        }
    })
}

const useFetchMatchups = () => {
    return useQuery({
        queryKey: ["matchups"],
        queryFn: () => getMatchups
    })
}

export {
    useFetchCurrentScoringPeriod,
    useFetchPowerRankings,
    useFetchPowerRankingPeriods,
    useFetchCurrentPowerRankings,
    useFetchPowerRankingsByTeam,
    useFetchWeeklyPowerRankings,
    useFetchPowerRankingsByPeriod,
    useFetchMatchups
};