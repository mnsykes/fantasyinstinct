import useFetchTeams from "../../hooks/TeamsHooks";
import type { Team } from "../../types/teams";
import { useNavigate } from "react-router-dom";

const Team = () => {
    const nav = useNavigate();
    const { data } = useFetchTeams();

    return (
        <>
            <div className="row mb-2">
                <h5 className="text-center">Teams</h5>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Division</th>
                        <th>Id</th>
                    </tr>
                </thead>
                <tbody>
                {data && data.map((team: Team) => (
                    <tr key={team.id} onClick={() => nav(`/teams/${team.id}`)}>
                        <td>{team.name}</td>
                        <td>{team.division}</td>
                        <td>{team.id}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    )
}

export default Team;