import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

const useFetchTeamRoster = () => {
    const { id } = useParams()
    const url = `http://localhost:4000/roster/${id}`

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