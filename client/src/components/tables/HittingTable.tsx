import { useFetchRosterTable } from "../../hooks/TeamsHooks";

const HittingTable = ({ teamId }) => {
    if (!teamId) throw Error("Player not found");

    const { data, isLoading } = useFetchRosterTable(teamId);

    if (isLoading) return <p>Loading...</p>;
    return (
        <>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th></th>
                    {data.hitting.header.cells.map((cell, index) => (
                        <th key={index}>
                            {cell.shortName}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>

                {data.hitting.rows.map((row, index) => (
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
        </>
    )
}

export default HittingTable;