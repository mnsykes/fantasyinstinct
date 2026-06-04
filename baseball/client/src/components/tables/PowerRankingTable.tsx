import {useNavigate} from "react-router-dom";

const PowerRankingTable = ({ rankings, period }) => {
    const nav = useNavigate();

    return (
        <>
            <h2>Week {period} Power Rankings</h2>
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Team</th>
                            <th>At #1</th>
                            <th>Rank</th>
                            <th>Total<br />Points</th>
                            <th>Total<br />Wins</th>
                            <th>Total<br />Vs All</th>
                            <th>Rank<br />Points</th>
                            <th>Rank<br />Wins</th>
                            <th>Rank<br />Vs All</th>
                            <th>Power</th>
                            <th className="text-end">+/-</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rankings && rankings.map((rank: any, index: number) => (
                            <tr key={rank.teamId} className="align-items-center justify-content-center">
                                <td className="w-auto" onClick={() => nav(`/rankings/${rank.teamId}`)}>
                                    <span><img src={rank.logoUrl} alt={rank.teamName} width={35} height={35} /></span>
                                </td>
                                <td className="w-auto">{rank.weeksAtOne}</td>
                                <td className="w-auto">{index + 1}</td>
                                <td className="w-auto">{parseInt(rank.totalPoints).toFixed(0)}</td>
                                <td className="w-auto">{rank.totalWins}</td>
                                <td className="w-auto">{rank.totalWinsVsAll}</td>
                                <td className="w-auto">{parseFloat(rank.pointsPowerRank).toFixed(1)}</td>
                                <td className="w-auto">{parseFloat(rank.winsPowerRank).toFixed(1)}</td>
                                <td className="w-auto">{parseFloat(rank.winsVsAllPowerRank).toFixed(1)}</td>
                                <td className="w-auto">{parseFloat(rank.totalPowerRank).toFixed(1)}</td>
                                <td className="w-auto text-end">{parseFloat(rank.change).toFixed(1)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default PowerRankingTable;