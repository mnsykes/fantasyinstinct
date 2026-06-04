import PeriodSelect from "./PeriodSelect.tsx";
import PeriodPodium from "./PeriodPodium.tsx";
import PowerRankingTable from "../tables/PowerRankingTable.tsx"
import {useContext} from "react";
import {ScoringPeriodContext} from "../../contexts/ScoringPeriodContext.tsx";

const PowerRankingsWrapper = () => {
    const { scoringPeriod } = useContext(ScoringPeriodContext);
    return (
        <>
            <h1>Power Rankings</h1>
    <div className="row">
    <div className="col-2">
        <PeriodSelect />
        </div>
        <div className="col-10">
    <PeriodPodium scoringPeriod={scoringPeriod} />
    <PowerRankingTable />
    </div>
    </div>
    </>
)
}

export default PowerRankingsWrapper