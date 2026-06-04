import { currencyFormatter } from "../../config"
import useFetchPlayers from "../../hooks/PlayerHooks";
import { useNavigate } from "react-router-dom";
import { Suspense } from "react"

const Player = () => {
    const nav = useNavigate();
    const { data } = useFetchPlayers();

    // console.log(data)
    return (
            <>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="row mb-2">
                        <h5 className="text-center">Players</h5>
                    </div>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Position</th>
                            <th>BT Team</th>
                            <th>Salary</th>
                            <th>Contract</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data && data.map((player) => {
                            return (
                                <tr key={player.PlayerID} onClick={() => nav(`/player/${player.fantraxId}`)}>
                                    <td>{player.PlayerID}</td>
                                    <td>{player.Name}</td>
                                    <td>{player.PosShortNames}</td>
                                    <td>{player.FantasyTeamName}</td>
                                    <td>{currencyFormatter.format(player.FantasyPoints)}</td>
                                    <td>{player.FantasyPointsPerG}</td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </Suspense>
            </>
        )
}

export default Player