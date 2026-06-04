import { useFetchPowerRankingsByPeriod } from "../../hooks/PowerRankingHooks.ts";
import PeriodSelect from "./PeriodSelect.tsx";
import PowerRankingTable from "../tables/PowerRankingTable.tsx"
import WeeklyResults from "../tables/WeeklyPowerRankingTable.tsx"
import PlayoffWatch from "./PlayoffWatch.tsx";
import { useContext, useEffect, useState } from "react";
import {ScoringPeriodContext} from "../../contexts/ScoringPeriodContext.tsx";
import axios from "axios";
import config from "../../config.ts";
// import {getCurrentPowerRankings} from "../../api/FantraxApi.ts";
// import { useFetchCurrentScoringPeriod } from "../../hooks/PowerRankingHooks.ts";



const PowerRankingsWrapper = () => {
    const { scoringPeriod } = useContext(ScoringPeriodContext)
    const [ data, setData ] = useState()

    // const { data } = useFetchPowerRankingsByPeriod(scoringPeriod)

    useEffect(() => {
        console.log(scoringPeriod);
        let url = `${config.baseApiUrl}/rankings/`

        if (scoringPeriod == undefined || scoringPeriod == null) {
            url += `latest`;
        } else {
            url += `period/${scoringPeriod}`;
        }

        const periodData = fetch(url)
                                            .then(res => res.json())
                                            .then(data => setData(data))
        setData(periodData.data);
    }, [scoringPeriod]);
    return (
        <>
            <div className="container">
                <div className="row">
                    <PeriodSelect />
                </div>
                <div className="row">
                    <div className="col-lg-8">
                        {data && <PowerRankingTable rankings={data.rankings} period={data.scoringPeriod} />}
                    </div>
                    <div className="col-lg-4">
                        {data && <WeeklyResults results={data.periodOnlyRankings} period={data.scoringPeriod} />}
                    </div>
                </div>
                <div className="row">
                    {data && <PlayoffWatch matchups={data.rankings} />}
                </div>
            </div>
        </>
    )
}

export default PowerRankingsWrapper