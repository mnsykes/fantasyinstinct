import { Player } from "../types/player";
import config from "../config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {ApiPlayer} from "../types/apiPlayer";

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

const useFetchPlayers = ()=> {
    const url = "http:localhost:4000/playerPool"
    return useQuery<ApiPlayer[], AxiosError>({
        queryKey: ["apiPlayer"],
        queryFn: async () => {
            const response = await fetch('http://localhost:4000/playerPool')
            if (!response.ok) throw new Error('Failed to fetch apiPlayer');

            return response.json()
        }
    })
};

const useFetchPlayer = (id: number) => {
    return useQuery<Player[], AxiosError>({
        queryKey: ["player", id],
        queryFn: () =>
            axios.get(`${config.baseApiUrl}/players/${id}`).then((response) => response.data),
    })
}


export default useFetchPlayers;
export { useFetchPlayer };