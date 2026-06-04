import { useParams } from "react-router-dom";
import TeamRankingTable from "../tables/TeamRankingTable.tsx";
import {useFetchPowerRankingsByTeam} from "../../hooks/PowerRankingHooks.ts";

const TeamRanking = () => {
    const { id } = useParams();
    if (!id) throw Error("Team not found");
    const {data, isLoading} = useFetchPowerRankingsByTeam(id)

    return (
        <>
            <div className="container">
                {data && <h1><span><img src={data.logoUrl} alt={data.teamName}/></span> {data.teamName}</h1>}
                {data && <TeamRankingTable periods={data.periods} />}
            </div>
        </>
    )
}

export default TeamRanking;