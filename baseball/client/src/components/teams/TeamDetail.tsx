import { useParams } from "react-router-dom";
import { useFetchRosterTable } from "../../hooks/TeamsHooks.ts";
import { Suspense } from "react";
import TeamInfoTable from "../tables/TeamInfoTable"
import HittingTable from "../tables/HittingTable"
import PitchingTable from "../tables/PitchingTable"

const TeamDetail = () => {
    const { id } = useParams();
    if (!id) throw Error("Player not found");
    const { data } = useFetchRosterTable(id);

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <TeamInfoTable teamId={id} />
                <HittingTable hitters={data.hitting} />
                <PitchingTable pitchers={data.pitching} />
            </Suspense>
        </>
    )
}

export default TeamDetail;