const PitchingTable = ({ pitchers }) => {

    return (
        <>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th></th>
                    {pitchers.header.cells.map((cell, index) => (
                        <th key={index}>
                            {cell.shortName}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>

                {pitchers.rows.map((row, index) => (
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

export default PitchingTable;