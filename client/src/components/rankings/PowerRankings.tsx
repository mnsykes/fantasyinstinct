import {useEffect, useState} from "react";
import { useFetchPowerRankings } from "../../hooks/PowerRankingHooks"
import Select from "react-select"
import player from "../player/Player";

const PowerRankings = () => {
    const [selectedId, setSelectedId] = useState()
    const { data, isLoading } = useFetchPowerRankings()

    const handleChange = (e) => {
        setSelectedId(e.target.value)
    }


    useEffect(() => {
        const fetchSelected = async () => {
            const selected = 17
            setSelectedId(selected)
        };
        fetchSelected()
    }, []);

    if (isLoading) <div>Loading...</div>
    return (
        <>
            <h1>Power Rankings</h1>

            <select value={selectedId} onChange={handleChange}>
                {data && data.periods.map((period) => (
                    <option key={period.scoringPeriod} value={period.scoringPeriod}>
                        {period.date}
                    </option>

                ))}
            </select>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th></th>
                        <th>Points</th>
                        <th>Wins</th>
                        <th>Vs All</th>
                        <th>Points Rank</th>
                        <th>Wins Rank</th>
                        <th>Vs All Rank</th>
                        <th>Power Rank</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>

                {data && data.periods.map((ranking) => (
                    ranking.scoringPeriod == selectedId &&

                    ranking && ranking.rankings.map(rank => {
                        return (
                    <tr key={rank.teamId}>
                <td>
                    <span><img src={rank.logoUrl} alt={rank.teamName} width={35}/></span> {rank.teamName}
                </td>
                <td className="text-center">{parseInt(rank.totalPoints).toFixed(1)}</td>
                <td className="text-center">{rank.totalWins}</td>
                <td className="text-center">{rank.totalWinsVsAll}</td>
                <td className="text-center">{rank.pointsPowerRank}</td>
                <td className="text-center">{rank.winsPowerRank}</td>
                <td className="text-center">{parseInt(rank.winsVsAllPowerRank).toFixed(1)}</td>
                <td className="text-center">{parseInt(rank.totalPowerRank).toFixed(1)}</td>
                <td className="text-center">{parseInt(rank.change).toFixed(1)}</td>
                </tr>
                    )
                })

                ))}
                </tbody>
            </table>
        </>
    )
}

export default PowerRankings;