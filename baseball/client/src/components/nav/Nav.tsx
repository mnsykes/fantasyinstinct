import { Link } from "react-router-dom";

export default function Nav() {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="Nav.tsx#">Fantasy Instinct Baseball</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            <li className="nav-item">
                                <Link className="nav-link" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/owner">Owners</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/player">Players</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/teams">Teams</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/tradeMachine">Trade Machine</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/rankings">Power Rankings</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
