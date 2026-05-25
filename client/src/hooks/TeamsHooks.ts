import config from "../config";
import axios, { AxiosError } from "axios";
import { Team } from "../types/teams";
import { RosterTable } from "../types/teams";
import { useQuery } from "@tanstack/react-query";
import { ApiPlayer } from "../types/apiPlayer";
import getTeamInfoById, { getTeamRosterById } from "../api/FantraxApi";

const aryTeamInfo = [];

const useFetchTeams = ()=> {
   const url =`${config.FANTRAX_API_URL}/getLeagueInfo?leagueId=${config.FANTRAX_LEAGUE_ID}`
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
    const url = `http://localhost:4000/roster/${id}`

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
            axios.get(`${config.FANTRAX_API_URL}/getLeagueInfo?leagueId=${config.FANTRAX_LEAGUE_ID}`)
                .then((response) => {
                    return response.data.teamInfo;
                })
    })
};

export default useFetchTeams;
export { useFetchTeam, useFetchPlayersByTeam, useFetchRosterTable };
