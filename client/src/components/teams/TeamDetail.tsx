import { useParams } from "react-router-dom";
import HittingTable from "../tables/HittingTable"
import PitchingTable from "../tables/PitchingTable"
import TeamInfoTable from "../tables/TeamInfoTable"

const TeamDetail = () => {
    const { id } = useParams();
    if (!id) throw Error("Player not found");

    return (
        <>
            <TeamInfoTable teamId={id} />
            <HittingTable teamId={id} />
            <PitchingTable teamId={id} />
        </>
    )
}

export default TeamDetail;