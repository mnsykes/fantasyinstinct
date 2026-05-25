import {useContext} from "react";
import AuthContext from "../../AuthContext.ts";

export default function Profile() {
    const { user } = useContext(AuthContext);
    return (
        <>
            <h1>Profile Page</h1>
            <p>Hello { user.name }</p>
        </>
    )
}

