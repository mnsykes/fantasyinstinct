import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFetchTeams, { useFetchPlayersByTeam } from "../../hooks/TeamsHooks";

const TradeMachine = () => {
    const [ teamOne, setTeamOne ] = useState({
        activeRoster: {},
        injuredReserve: {},
        leagueTeams: {},
        minorsRoster: {},
        reserveRoster: {},
        teamInfo: {}
    });
    const [ teamTwo, setTeamTwo ] = useState({
        activeRoster: {},
        injuredReserve: {},
        leagueTeams: {},
        minorsRoster: {},
        reserveRoster: {},
        teamInfo: {}
    });
    const [ loading, setLoading ] = useState(false);
    const nav = useNavigate();
    const { data } = useFetchTeams();
    const teams = data

    const handleSelectChange = async (e) => {
        const id = e.target.value;
        const opt = e.currentTarget.dataset.option;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4000/roster/${id}`)
            const {
                ActiveRoster,
                InjuredReserve,
                LeagueTeams,
                MinorsRoster,
                ReserveRoster,
                TeamInfo
            } = await response.json();

            if (opt == "option1") {
                updateTeamOne(ActiveRoster, InjuredReserve, LeagueTeams, MinorsRoster, ReserveRoster, TeamInfo)
            }

            if (opt == "option2") {
                updateTeamTwo(ActiveRoster, InjuredReserve, LeagueTeams, MinorsRoster, ReserveRoster, TeamInfo)
            }
        } catch (error) {
            console.error("Error fetching teams from teams", error);
        } finally {
            setLoading(false);
        }
    }

    const updateTeamOne = (newActiveRoster, newInjuredReserve, newLeagueTeams, newMinorsRoster, newReserveRoster, newTeamInfo) => {
        setTeamOne(prevState => ({
            ...prevState,
            activeRoster: newActiveRoster,
            injuredReserve: newInjuredReserve,
            leagueTeams: newLeagueTeams,
            minorsRoster: newMinorsRoster,
            reserveRoster: newReserveRoster,
            teamInfo: newTeamInfo
        }));
    }

    const updateTeamTwo = (newActiveRoster, newInjuredReserve, newLeagueTeams, newMinorsRoster, newReserveRoster, newTeamInfo) => {
        setTeamTwo(prevState => ({
            ...prevState,
            activeRoster: newActiveRoster,
            injuredReserve: newInjuredReserve,
            leagueTeams: newLeagueTeams,
            minorsRoster: newMinorsRoster,
            reserveRoster: newReserveRoster,
            teamInfo: newTeamInfo
        }));
    }

    return (
        <>
            <h1>Trade Machine</h1>
            <div className="row">
                <div className="col-6">
                    <select data-option="option1" onChange={handleSelectChange}>
                        <option value="">Select Team 1</option>
                        {data && teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>

                    <div>
                        {loading && <p>Loading...</p>}
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                            {Object.entries(teamOne.activeRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamOne.reserveRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamOne.injuredReserve).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamOne.minorsRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="col-6">
                    <select data-option="option2" onChange={handleSelectChange}>
                        <option value="">Select Team 2</option>
                        {data && teams.map((team) => (
                            <option key={team.id} value={team.id}>{team.name}</option>
                        ))}
                    </select>

                    <div className="row">
                        {loading && <p>Loading...</p>}
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(teamTwo.activeRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamTwo.reserveRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamTwo.injuredReserve).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            {Object.entries(teamTwo.minorsRoster).map(([key, value]) => {
                                return (
                                    <tr key={value.PlayerID}>
                                        <td><img src={value.HeadshotURL} width={25}/></td>
                                        <td>{value.Name}</td>
                                        <td>{value.TeamShortName}</td>
                                        <td>{value.PosShortNames}</td>
                                        <td>{value.PlayerID}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TradeMachine