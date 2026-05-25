import { useFetchTeam } from "../../hooks/TeamsHooks";

const TeamInfoTable = ({ teamId }) => {
    if (!teamId) throw Error("Player not found");

    const { data, isLoading } = useFetchTeam(teamId);
    if (isLoading) return <div>Loading...</div>;
    return (
        <>
            {data &&   console.log(data)}
        </>
    )
}

export default TeamInfoTable;