import {useContext, useState} from "react";
import AuthContext from "../../AuthContext.ts";

export default function Login() {
    const [name, setName] = useState('');
    const {user, login} = useContext(AuthContext);

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        login(name);
        alert("login")
    }
    return (
        <>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    <input type="text"
                           placeholder="Enter Your Name..."
                           onChange={(e) => setName(e.target.value)} />
                </label>
                <button type="submit">Login</button>
            </form>
            {user.isAuth && <p>{user.name} is logged in</p>}
        </>
    )
}