import heroImg from "../../assets/hero.png";
import reactLogo from "../../assets/react.svg";
import viteLogo from "../../assets/vite.svg";
import Button from "./Button.jsx";

export default function Hero() {
    return (
        <div>
            <div className="hero">
                <img src={heroImg} className="base" width="170" height="179" alt="" />
                <img src={reactLogo} className="framework" alt="React logo" />
                <img src={viteLogo} className="vite" alt="Vite logo" />
            </div>
            <div>
                <h1>Get started with ReactJS</h1>
                <p>
                    Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
                </p>
            </div>
            <br/>
            <Button />
        </div>

    )
}