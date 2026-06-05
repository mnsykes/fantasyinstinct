import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const useFetchTeamRoster = () => {
    const { id } = useParams()
    const url = `${apiUrl}/roster/${id}`

    return useQuery ({
        queryKey: ["teamRoster"],
        queryFn: () => {
            axios.get(url).then((response) => {
                return response.data;
            })
        }
    })
}

export default useFetchTeamRoster;