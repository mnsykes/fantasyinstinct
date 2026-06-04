import { useParams} from "react-router-dom";
import { useFetchPlayer } from "../../hooks/PlayerHooks";
import { currencyFormatter } from "../../config";

const PlayerDetail = () => {
    const { id } = useParams();
    if (!id) throw Error("Player not found");

    const playerId = parseInt(id)

    const { data, status, isSuccess } = useFetchPlayer(playerId);

    return (
        <>
            <div className="row mb-2">
                <h5 className="text-center">Player Detail</h5>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Team</th>
                    <th>Age</th>
                    <th>Salary</th>
                    <th>Contract</th>
                </tr>
                </thead>
                <tbody>
                {data &&
                    <tr key={data.playerId}>
                        <td>{data.playerId}</td>
                        <td>{data.fantasyTeam}</td>
                        <td>{data.position}</td>
                        <td>{data.team}</td>
                        <td>{data.age}</td>
                        <td>{currencyFormatter.format(data.salary)}</td>
                        <td>{data.contract}</td>
                    </tr>
                }
                </tbody>
            </table>
        </>
    )
}

export default PlayerDetail;