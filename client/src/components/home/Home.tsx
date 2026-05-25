import { useContext } from 'react';
import Standings from "../standings/Standings"
import AuthContext from "../../AuthContext";
export default function Home() {

    return (
        <>
            <h1>Home Page</h1>
            <Standings />
        </>
    )
}