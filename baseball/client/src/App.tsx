import './App.css'
import Home from './components/home/Home'
import Nav from './components/nav/Nav'
import OwnerList from './components/owner/Owner'
import Player from './components/player/Player'
import PlayerDetail from './components/player/PlayerDetail'
import PowerRankings from "./components/rankings/PowerRankings";
import TeamRanking from "./components/rankings/TeamRanking"
import Team from './components/teams/Team'
import TeamDetail from './components/teams/TeamDetail'
import TradeMachine from './components/tradeMachine/TradeMachine'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router-dom"

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 100,
            gcTime: 10 * 60 * 1000,
            retry: 3,
            refetchOnWindowFocus: true,
        }
    }
});

export default function App() {

  return (
    <>
        <QueryClientProvider client={queryClient}>
            <section>
                <Nav />
                <div className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/owner" element={<OwnerList />} />
                        <Route path="/player" element={<Player />} />
                        <Route path="/player/:id" element={<PlayerDetail />} />
                        <Route path="/rankings" element={<PowerRankings />} />
                        <Route path="/rankings/:id" element={<TeamRanking />} />
                        <Route path="/teams" element={<Team />} />
                        <Route path="/teams/:id" element={<TeamDetail />} />
                        <Route path="/tradeMachine" element={<TradeMachine />} />
                        {/* Fall back route */}
                        <Route path="*" element={<h1>404 Not Found</h1>} />
                    </Routes>
                </div>
            </section>
        </QueryClientProvider>
    </>
  )
}

