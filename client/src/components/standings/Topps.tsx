import { useFetchTopps } from "../../hooks/StandingsHooks"

const Fleer = () => {
    const { data, isSuccess } = useFetchTopps();
    // console.log(data);

    return (
        <>
            <h5 className="text-center">Topps</h5>
            <table>
                <tbody>
                {/*{data && Object.entries(data[0]).map((row, index) => {*/}
                {/*    return (*/}
                {/*        <tr key={index}>*/}
                {/*            <td>{index}</td>*/}
                {/*            <td>{row.teams.teamName}</td>*/}
                {/*            <td>{row.teams.gamesBack}</td>*/}
                {/*            <td>{row.teams.points}</td>*/}
                {/*        </tr>*/}
                {/*    )*/}
                {/*})}*/}
                </tbody>
            </table>
        </>
    )
}

export default Fleer;