import { useEffect, useState } from "react";
import {getPowerRankingsByPeriod} from "../../api/FantraxApi.ts";

const PeriodPodium = ({ scoringPeriod }) => {
    const [ podium, setPodium ] = useState()

    useEffect(() => {
        const getPodium = async () => {
            if (scoringPeriod) {
                const periodPodium = await getPowerRankingsByPeriod(scoringPeriod)
                setPodium(periodPodium)
            }
        }
        getPodium()
    }, [scoringPeriod]);

    return (
        <>
            {podium &&
        <div className="row">
        <div key={podium.periodOnlyRankings[1].teamId} className="col-3">
    <img src={podium.periodOnlyRankings[1].logoUrl} alt={podium.periodOnlyRankings[1].teamName}/>
    </div>
    <div key={podium.periodOnlyRankings[0].teamId} className="col-3">
    <img src={podium.periodOnlyRankings[0].logoUrl} alt={podium.periodOnlyRankings[0].teamName}/>
    </div>
    <div key={podium.periodOnlyRankings[2].teamId} className="col-3">
    <img src={podium.periodOnlyRankings[2].logoUrl} alt={podium.periodOnlyRankings[2].teamName}/>
    </div>
    </div>
}

    </>
)
}

export default PeriodPodium;