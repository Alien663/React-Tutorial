import React from "react";
import { useState, useEffect } from "react";

const Counter = (props) => {
    const [counts, setCounter] = useState(0)

    useEffect(() => {
        document.title = `You clicked ${counts} times`;
    });

    return(
        <div>
            <div>Click Times : {counts}</div>
            <button onClick={() => setCounter(counts+1)}>Plus One</button>
        </div>
    )
}

export default Counter