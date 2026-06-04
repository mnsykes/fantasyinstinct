import type { Owner } from "../types/owner";
import config from "../config";
import { useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";


const useFetchOwners = ()=> {
    return useQuery<Owner[], AxiosError>({
        queryKey: ["owner"],
        queryFn: () =>
            axios.get(`${config.baseApiUrl}/owners`)
                .then((response) => response.data),
    })
};

export default useFetchOwners;