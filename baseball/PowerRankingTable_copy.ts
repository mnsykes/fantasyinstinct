import {useFetchPowerRankings} from "../../hooks/PowerRankingHooks.ts";
import {useNavigate} from "react-router-dom";

const PowerRankingTable = () => {
    const { data } = useFetchPowerRankings();
    const nav = useNavigate();
    console.log(data)
    return (
        <>
            <table className="table table-sm table-responsive">
        <thead className="table-dark">
            <tr>
                <th></th>
            <th>Total<br />Points</th>
            <th>Total<br />Wins</th>
            <th>Total<br />Vs All</th>
    <th>Rank<br />Points</th>
    <th>Rank<br />Wins</th>
    <th>Rank<br />Vs All</th>
    <th>Power</th>
    <th>+/-</th>
    </tr>
    </thead>
    <tbody>
    {data && data.map((rank: any) => (
        <tr key={rank.teamId}>
        <td onClick={() => nav(`/rankings/${rank.teamId}`)}>
    <span><img src={rank.logoUrl} alt={rank.teamName} width={35}/></span>
    </td>
    <td className="text-center">{parseInt(rank.totalPoints).toFixed(0)}</td>
    <td className="text-center">{rank.totalWins}</td>
        <td className="text-center">{rank.totalWinsVsAll}</td>
        <td className="text-center">{rank.pointsPowerRank}</td>
        <td className="text-center">{rank.winsPowerRank}</td>
        <td className="text-center">{parseInt(rank.winsVsAllPowerRank).toFixed(1)}</td>
    <td className="text-center">{parseInt(rank.totalPowerRank).toFixed(1)}</td>
    <td className="text-center">{parseInt(rank.change).toFixed(1)}</td>
    </tr>
))}
    </tbody>
    </table>

    <h2>Playoff Watch</h2>
    <ul className="list-group">
    <li className="list-group-item">1 {data && data[0].teamName} vs 8 {data && data[7].teamName}</li>
    <li className="list-group-item">2 {data && data[1].teamName} vs 7 {data && data[6].teamName}</li>
    <li className="list-group-item">3 {data && data[2].teamName} vs 6 {data && data[5].teamName}</li>
    <li className="list-group-item">4 {data && data[3].teamName} vs 5 {data && data[4].teamName}</li>
    </ul>
    </>
)
}

export default PowerRankingTable;