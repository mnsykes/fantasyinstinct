const PlayoffWatch = ({ matchups }) => {

    return (
        <>
            <div className="container">
                <div className="row">
                <h2>Playoff Watch</h2>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <p>1 <img src={matchups && matchups[0].logoUrl} alt={matchups && matchups[0].teamName} height={16} width={16} /> {matchups && matchups[0].teamName}</p>
                            <p>8 <img src={matchups && matchups[7].logoUrl} alt={matchups && matchups[0].teamName} height={16} width={16} /> {matchups && matchups[7].teamName}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <p>2 <img src={matchups && matchups[1].logoUrl} alt={matchups && matchups[1].teamName} height={16} width={16} /> {matchups && matchups[1].teamName}</p>
                            <p>7 <img src={matchups && matchups[6].logoUrl} alt={matchups && matchups[6].teamName} height={16} width={16} /> {matchups && matchups[6].teamName}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <p>3 <img src={matchups && matchups[2].logoUrl} alt={matchups && matchups[2].teamName} height={16} width={16} /> {matchups && matchups[2].teamName}</p>
                            <p>6 <img src={matchups && matchups[5].logoUrl} alt={matchups && matchups[5].teamName} height={16} width={16} /> {matchups && matchups[5].teamName}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-body">
                            <p>4 <img src={matchups && matchups[3].logoUrl} alt={matchups && matchups[3].teamName} height={16} width={16} /> {matchups && matchups[3].teamName}</p>
                            <p>5 <img src={matchups && matchups[4].logoUrl} alt={matchups && matchups[4].teamName} height={16} width={16} /> {matchups && matchups[4].teamName}</p>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default PlayoffWatch;
