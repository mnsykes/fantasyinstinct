import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import config from "../config.ts";

const getCurrentScoringPeriod = () => {
    return useQuery({
        queryKey: ["currentScoringPeriod"],
        queryFn: async () => {
            const response = await axios.get(`${config.baseApiUrl}/rankings/latest`)
            const currentScoringPeriod = response.data.scoringPeriod

            return currentScoringPeriod
        },
    })
}

export default getCurrentScoringPeriod;