import React from "react"

type Args = {
    status: "idle" | "success" | "error" | "loading"
}

const ApiStatus = ({ status }: Args) => {
    switch (status) {
        case "error":
            return <div>Error communicating with the server</div>
        case "idle":
            return <div>Idle</div>
        case "loading":
            return (<><div>Loading...</div></>)
        default:
            throw Error(`Unknown status`);
    }
}

export default ApiStatus;