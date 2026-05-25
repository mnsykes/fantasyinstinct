import Donruss from "./Donruss";
import Fleer from "./Fleer";
import Topps from "./Topps";

const Standings = () => {
    return (
        <>
            <div className="row mb-2">
                <h5 className="text-center">Standings</h5>
            </div>
            <Donruss />
            <Fleer />
            <Topps />
        </>
    )
}

export default Standings;