const PeriodPodium = ({ podium }) => {
    return (
        <>
            {podium &&
                <div className="row">
                    <div key={podium[1].teamId} className="col-3">
                        <img src={podium[1].logoUrl} alt={podium[1].teamName}/>
                    </div>
                    <div key={podium[0].teamId} className="col-3">
                        <img src={podium[0].logoUrl} alt={podium[0].teamName}/>
                    </div>
                    <div key={podium[2].teamId} className="col-3">
                        <img src={podium[2].logoUrl} alt={podium[2].teamName}/>
                    </div>
                </div>
            }

        </>
    )
}

export default PeriodPodium;