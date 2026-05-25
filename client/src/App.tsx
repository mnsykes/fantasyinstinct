import ApiPlayer from './components/apiPlayer/ApiPlayer'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Nav from './components/nav/Nav'
import OwnerList from './components/owner/Owner'
import Player from './components/player/Player'
import PlayerDetail from './components/player/PlayerDetail'
import PowerRankings from "./components/rankings/PowerRankings";
import Profile from './components/profile/Profile'
import Team from './components/teams/Team'
import TeamDetail from './components/teams/TeamDetail'
import TradeMachine from './components/tradeMachine/TradeMachine'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom"

const queryClient = new QueryClient();

export default function App() {

  return (
    <>
        <QueryClientProvider client={queryClient}>
            <section id="center">
                <Nav />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/owner" element={<OwnerList />} />
                    <Route path="/apiPlayer" element={<ApiPlayer />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/player" element={<Player />} />
                    <Route path="/player/:id" element={<PlayerDetail />} />
                    <Route path="/rankings" element={<PowerRankings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/teams" element={<Team />} />
                    <Route path="/teams/:id" element={<TeamDetail />} />
                    <Route path="/tradeMachine" element={<TradeMachine />} />
                    {/* Fall back route */}
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </section>
        </QueryClientProvider>
    </>
  )
}

