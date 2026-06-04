import { ScoringPeriodProvider } from "../../contexts/ScoringPeriodContext.tsx"
import PowerRankingsWrapper from "./PowerRankingsWrapper.tsx";

const PowerRankings = () => {
    return (
            <ScoringPeriodProvider>
                <PowerRankingsWrapper />
            </ScoringPeriodProvider>
    )
}

export default PowerRankings;