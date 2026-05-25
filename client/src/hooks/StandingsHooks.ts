import { Standings } from "../types/standings";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";


const leagueId = `er2bf6v3mhairboa`

const useFetchStandings = ()=> {
    return useQuery<Standings[], AxiosError>({
        queryKey: ["standings"],
        queryFn: () =>
            axios.get(`https://www.fantrax.com/fxea/general/getStandings?leagueId=${leagueId}`)
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
            axios.get(`http://localhost:4000/league`)
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
            axios.get(`http://localhost:4000/league`)
                .then((response) => {
                    const topps = response.data
                    return topps;
                }),
    })
};

const getDonruss = async ()=> {
    const response = await axios.get(`http://localhost:4000/league`)
    if (!response.data) throw new Error ("Could not find donruss");
    console.log(response.data.standings);
    const { standings: [ donruss ] } = response.data;
    console.log(donruss);
}

export default useFetchStandings;
export { useFetchDonruss, useFetchFleer, useFetchTopps };

