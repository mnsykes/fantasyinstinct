import type { Owner } from "../types/owner";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const useFetchOwners = ()=> {

    return useQuery<Owner[], AxiosError>({
        queryKey: ["owner"],
        queryFn: () =>
            axios.get(`${apiUrl}/owners`)
                .then((response) => response.data),
    })
};

export default useFetchOwners;