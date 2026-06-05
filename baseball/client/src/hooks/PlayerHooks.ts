import type { Player } from "../types/player";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const teamArray = [
    "7spm4ihomhairbop",
    "6c3qqgj9mhairboo",
    "fukfyy5jmhairbom",
    "5liza9y3mhairboj",
    "fowe0sxcmhairboi",
    "qsnercq5mlh2ngul",
    "f9a3hseymlec784v",
    "rk3t1r5jmhairboh",
    "lglf8tkemhairbon",
    "f2e7itnimhairbol",
    "397vx1zsmhairbok",
    "hblx3vpumhairboo"
]
const aryPlayerList = []
const apiUrl = import.meta.env.VITE_API_URL;
const useFetchPlayers = ()=> {
    return useQuery<Player[], AxiosError>({
        queryKey: ["Player"],
        queryFn: async () => {
            const response = await fetch(`${apiUrl}/playerPool`)
            if (!response.ok) throw new Error('Failed to fetch Player');

            return response.json()
        }
    })
};

const useFetchPlayer = (id: number) => {
    return useQuery<Player[], AxiosError>({
        queryKey: ["player", id],
        queryFn: () =>
            axios.get(`${apiUrl}/players/${id}`).then((response) => response.data),
    })
}


export default useFetchPlayers;
export { useFetchPlayer };