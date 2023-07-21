import React, { useEffect, useState } from 'react'

const Timer = (props) => {
    const [myTime, setTime] = useState(Date())

    useEffect(() => {
        const interval = setInterval( ()=> {
            setTime(Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    return(
        <h2 id="Timer">{myTime}</h2>
    )
}
export default Timer