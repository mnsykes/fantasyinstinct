import config from "../config"
import { useQuery } from "@tanstack/react-query";
import {getPowerRankingTeamInfo, processPowerRankings, getMatchups } from "../api/FantraxApi"
import axios from "axios";

const useFetchPowerRankings = () => {
    return useQuery({
        queryKey: ["powerRankings"],
        queryFn: async () => {
            const response = await axios.get(`${config.baseApiUrl}/rankings`)

            const data = await processPowerRankings(response.data)
            return data
        }
    })
}

const useFetchMatchups = () => {
    return useQuery({
        queryKey: ["matchups"],
        queryFn: () => getMatchups()
    })
}

export { useFetchPowerRankings, useFetchMatchups };