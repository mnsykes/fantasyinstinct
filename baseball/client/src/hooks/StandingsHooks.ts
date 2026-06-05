import type { Standings } from "../types/standings";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const leagueId = import.meta.env.VITE_FANTRAX_LEAGUE_ID
const fantraxApiUrl = import.meta.env.VITE_FANTRAX_API_URL
const useFetchStandings = ()=> {

    return useQuery<Standings[], AxiosError>({
        queryKey: ["standings"],
        queryFn: () =>
            axios.get(`${fantraxApiUrl}?leagueId=${leagueId}`)
                .then((response) => response.data),
    })
};

const useFetchDonruss = ()=> {
    return useQuery<Standings[], AxiosError>({
        queryKey: ["standings"],
        queryFn: () => getDonruss()
    })
};

const useFetchFleer = ()=> {
    return useQuery<Standings[], AxiosError>({
        queryKey: ["standings"],
        queryFn: () =>
            axios.get(`${apiUrl}/league`)
                .then((response) => {
                    const fleer = response.data
                    return fleer;
                }),
    })
};

const useFetchTopps = ()=> {
    return useQuery<Standings[], AxiosError>({
        queryKey: ["standings"],
        queryFn: () =>
            axios.get(`${apiUrl}/league`)
                .then((response) => {
                    const topps = response.data
                    return topps;
                }),
    })
};

const getDonruss = async ()=> {
    const response = await axios.get(`${apiUrl}/league`)
    if (!response.data) throw new Error ("Could not find donruss");
    console.log(response.data.standings);
    const { standings: [ donruss ] } = response.data;
    console.log(donruss);
}

export default useFetchStandings;
export { useFetchDonruss, useFetchFleer, useFetchTopps };

