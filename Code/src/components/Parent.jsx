import React, { useState } from 'react'
import Child from './Child'

const Parent = (props) => {
    const [Name, setName] = useState("World")
    return(
        <div>
            <div>I'm Parent</div>
            <div><input id={"demo"} /></div>
            <div>
                <button onClick={() => {
                        setName(document.getElementById("demo").value)
                    }}>Chamge Child</button>
            </div>
            <Child Name={Name}></Child>
        </div>
    )
}
export default Parent