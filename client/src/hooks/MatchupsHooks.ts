import { PowerRankings } from "../types/powerRankings";
import { Team } from "../types/teams"
import { useQuery} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { getTeams, getMatchupsByScoringPeriod } from "../api/getTeams";


// const useFetchPowerRankings = () => {
//     return useQuery<Team[], AxiosError>({
//         queryKey: ["league"],
//         queryFn: getLeagueInfo,
//     })
// }
//
// export default useFetchPowerRankings;
