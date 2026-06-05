import { useContext } from 'react';
import { ScoringPeriodContext } from "../../contexts/ScoringPeriodContext.tsx";
import { useFetchPowerRankingPeriods } from "../../hooks/PowerRankingHooks.ts";

const PeriodSelect = () => {
    const { setScoringPeriod } = useContext(ScoringPeriodContext)
    const { data } = useFetchPowerRankingPeriods()

    const handleClick = (e) => {
        const currentScoringPeriod = e.currentTarget.dataset.period
        setScoringPeriod(currentScoringPeriod)
    }

    return (
        <>

            <div className="btn-toolbar mb-3" role="toolbar" aria-label="Toolbar with button groups">
                <div className="btn-group mr-2" role="group" aria-label="First group">
                    {data && data.map((period) => (
                        <button key={period.scoringPeriod}
                                type="button"
                                className="btn btn-secondary mb-1 mr-2"
                                data-period={period.scoringPeriod}
                                onClick={handleClick}
                        >
                            {period.scoringPeriod}
                        </button>
                    ))}
                </div>
            </div>
        </>
    )
}

export default PeriodSelect