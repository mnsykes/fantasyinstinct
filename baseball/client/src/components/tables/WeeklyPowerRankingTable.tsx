import {useNavigate} from "react-router-dom";

const WeeklyResults = ({ results, period }) => {
    const nav = useNavigate();

    return (
        <>
            <h2>Week {period} Results</h2>
            <div className="table-responsive">
                <table className="table table-sm">
                    <thead className="table-dark">
                    <tr>
                        <th style={{ width: '10%' }}>Team</th>
                        <th style={{ width: '10%' }}>Pts</th>
                        <th style={{ width: '10%' }}>Wins</th>
                        <th>Wins<br />Vs All</th>
                    </tr>
                    </thead>
                    <tbody>
                        {results && results.map((result, index) => (
                            <tr key={result.teamId}>
                                <td onClick={() => nav(`/rankings/${result.teamId}`)}>
                                    <span><img src={result.logoUrl} alt={result.teamName} width={35}/></span>
                                </td>
                                <td>{parseInt(result.periodPoints).toFixed(1)}</td>
                                <td>{result.periodWins}</td>
                                <td>{result.periodWinsVsAll}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default WeeklyResults;