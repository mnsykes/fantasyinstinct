const TeamRankingTable = ({ periods } : { periods: any }) => {

    return (
        <>
            <div className="table-responsive container">
                <table className="table">
                    <thead className="table-dark">
                        <tr>
                            <th></th>
                            <th>Period<br />Points</th>
                            <th>Total<br />Points</th>
                            <th>Period<br />Wins</th>
                            <th>Total<br />Wins</th>
                            <th>Period<br />Wins Vs All</th>
                            <th>Total<br />Vs All</th>
                        </tr>
                    </thead>
                <tbody>
                    {periods && periods.map((rank: any) => (
                        rank.periodPoints > 0 &&
                        <tr key={rank.scoringPeriod}>
                            <td>
                                Week {rank.scoringPeriod}
                            </td>
                            <td>{parseInt(rank.periodPoints).toFixed(0)}</td>
                            <td>{parseInt(rank.totalPoints).toFixed(0)}</td>
                            <td>{rank.periodWin}</td>
                            <td>{rank.totalWins}</td>
                            <td>{rank.periodWinsVsAll}</td>
                            <td>{rank.totalWinsVsAll}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </>
    )
}

export default TeamRankingTable