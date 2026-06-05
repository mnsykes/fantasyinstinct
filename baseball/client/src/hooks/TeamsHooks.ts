import axios, { AxiosError } from "axios";
import type { Team } from "../types/teams";
import type { RosterTable } from "../types/teams";
import { useQuery } from "@tanstack/react-query";
import getTeamInfoById, { getTeamRosterById } from "../api/FantraxApi";

const aryTeamInfo = [];

const apiUrl = import.meta.env.VITE_API_URL;
const fantraxApiUrl = import.meta.env.VITE_FANTRAX_API_URL;
const leagueId = import.meta.env.VITE_FANTRAX_LEAGUE_ID;

const useFetchTeams = ()=> {
   const url =`${fantraxApiUrl}/getLeagueInfo?leagueId=${leagueId}`
    return useQuery<Team[]>({
        queryKey: ["teams"],
        queryFn: () =>
            axios.get(url).then((response) => {
                Object.entries(response.data.teamInfo).map(([key, value]) => (
                    aryTeamInfo.push(value)
                ))
                return aryTeamInfo;
            }),
    })
};

const useFetchRosterTable = (id: string) => {
    const url = `${apiUrl}/roster/${id}`

    return useQuery<RosterTable>({
        queryKey: ["roster"],
        queryFn: () => getTeamRosterById(id)
    })
};

const useFetchTeam = (id: string) => {
    return useQuery<Team[]>({
        queryKey: ["team"],
        queryFn: () => getTeamInfoById(id)
    })
}

const useFetchPlayersByTeam = (id: string) => {
    return useQuery<Team[], AxiosError>({
        queryKey: ["teams", id],
        queryFn: () =>
            axios.get(`${fantraxApiUrl}/getLeagueInfo?leagueId=${leagueId}`)
                .then((response) => {
                    return response.data.teamInfo;
                })
    })
};

export default useFetchTeams;
export { useFetchTeam, useFetchPlayersByTeam, useFetchRosterTable };
