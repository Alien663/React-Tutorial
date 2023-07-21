import React, { useState } from 'react'
const Counter = (props) => {
    const [counter, setCounter] = useState(0)
    return(
        <div>
            <div>Click Times : {counter}</div>
            <div>
                <button onClick={() => {
                    setCounter(counter+1)
                }}>Plus one</button>
            </div>
        </div>
    )
}
export default Counter