import useFetchTeams from "../../hooks/TeamsHooks";
import {useNavigate} from "react-router-dom";

const Team = () => {
    const nav = useNavigate();
    const { data, status, isSuccess } = useFetchTeams();

    return (
        <>
            <div className="row mb-2">
                <h5 className="text-center">Teams</h5>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Division</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                {data && data.map((team) => (
                    <tr key={team.id} onClick={() => nav(`/teams/${team.id}`)}>
                        <td>{team.id}</td>
                        <td>{team.division}</td>
                        <td>{team.name}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default Team;