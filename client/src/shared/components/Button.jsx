import React, {useState} from "react";

export default function Button() {
    const [count, setCount] = useState(0)
    return (
        <button className="counter" onClick={() => setCount((count) => count + 1)}>
            This is a button {count}
        </button>
    )
}