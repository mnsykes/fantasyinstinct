import {createContext, useEffect, useState} from "react";

export const ScoringPeriodContext = createContext({
    scoringPeriod: null,
    setScoringPeriod: () => {}
})

export const ScoringPeriodProvider = ({ children }) => {
    const [ scoringPeriod, setScoringPeriod ] = useState(null)

    return (
        <ScoringPeriodContext.Provider value={{ scoringPeriod, setScoringPeriod }}>
            {children}
        </ScoringPeriodContext.Provider>
    )
}