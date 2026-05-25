import { useFetchDonruss } from "../../hooks/StandingsHooks"

const Donruss = () => {
    const { data, isLoading } = useFetchDonruss();
    // console.log(data);
    if (isLoading) <div>Loading....</div>
    return (
        <>
            <h5 className="text-center">Donruss</h5>
            <table>
                <tbody>
                {data && Object.entries(data[0]).map((row, index) => {
                    return (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{row.teams.teamName}</td>
                            <td>{row.teams.gamesBack}</td>
                            <td>{row.teams.points}</td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </>
    )
}

export default Donruss;