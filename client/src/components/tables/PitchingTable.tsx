import { useFetchRosterTable } from "../../hooks/TeamsHooks";

const PitchingTable = ({ teamId }) => {
    if (!teamId) throw Error("Player not found");

    const { data, isLoading } = useFetchRosterTable(teamId);
    return (
        <>
            {isLoading ? <div className="text-center">Loading...</div> :
                <table className="table table-hover">
                    <thead>
                    <tr>
                        <th></th>
                        {data.pitching.header.cells.map((cell, index) => (
                            <th key={index}>
                                {cell.shortName}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>

                    {data.pitching.rows.map((row, index) => (
                        <tr key={index}>
                            <td>
                                {row.scorer.headshotUrl && <span><img src={row.scorer.headshotUrl} alt={row.scorer.name} width={35}/></span>}
                                {row.scorer.name}
                            </td>
                            {row.cells.map((cell, index) => (
                                <td key={index}>{cell.content}</td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            }
        </>
    )
}

export default PitchingTable;