import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useConfig } from "../contexts/ConfigContext"


const getCurrentScoringPeriod = () => {
    const { apiUrl } = useConfig()
    return useQuery({
        queryKey: ["currentScoringPeriod"],
        queryFn: async () => {
            const response = await axios.get(`${apiUrl}/rankings/latest`)
            const currentScoringPeriod = response.data.scoringPeriod

            return currentScoringPeriod
        },
    })
}

export default getCurrentScoringPeriod;