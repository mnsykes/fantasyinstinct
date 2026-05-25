import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {Team} from "../types/teams";
import getTeamInfoById, { getSalaryInfoById } from "../api/FantraxApi"

const useFetchFantraxApi = (id: string) => {
    return useQuery<Team[], AxiosError>({
        queryKey: ["fantraxApi"],
        queryFn: getTeamInfoById(),
    })
}

export default useFetchFantraxApi;