import axios from "axios";

const MATCHUP_API_URL = `http://localhost:4000/matchups`

const getTeams = async () => {
    const response = await axios.get(MATCHUP_API_URL);
    if (!response.data) throw new Error ("Could not find matchups");
    return response.data.teams;
}

const getMatchupsByScoringPeriod = async () => {
    const response = await axios.get(MATCHUP_API_URL);
    if (!response.data) throw new Error ("Could not find matchups")

    return response.data

}

export { getTeams, getMatchupsByScoringPeriod };