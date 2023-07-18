import React, { useEffect, useState } from 'react'

const Sample =  (props) => {
    const [counter, setCounter] = useState(0)
    const [data, setData] = useState(0)
    const [time, setTime] = useState(Date())

    const get_sample = (req) => {
        return new Promise((resolve, reject) => {
            resolve({
                "body":[
                    {
                        "TID": 4,
                        "TName": "我不會飛",
                        "TDes": "abcd"
                    },
                    {
                        "TID": 5,
                        "TName": "abcd",
                        "TDes": "abcd"
                    },
                    {
                        "TID": 8,
                        "TName": "A1",
                        "TDes": "B1"
                    },
                    {
                        "TID": 9,
                        "TName": "A2",
                        "TDes": "B2"
                    },
                    {
                        "TID": 10,
                        "TName": "A3",
                        "TDes": "B3"
                    },
                    {
                        "TID": 11,
                        "TName": "A4",
                        "TDes": "B4"
                    }
                ]
            })
        })
    }

    async function sleep (ms){
        return new Promise(r => setTimeout(r, ms))
    }

    useEffect(() => {
        const interval = setInterval( ()=> {
            setTime(Date())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    async function clickButton ()  {
        await sleep(3000)
        get_sample(counter)
        .then(res => {
            setData(res.body)
        })
        setCounter(counter + 1)
    }

    let kk = <div>I'm Xenomorph</div>

    return(
        <div>
            <h1> This is a sample to use redux-saga in react </h1>
            <div id="Timer">{time}</div>
            <br />
            {kk}
            <div>{ counter }</div>
            <br></br>
            <button onClick={ () => clickButton() }>click me to call data</button>
            {
                data.length > 0 ?
                <div>{ data.map(item => {return(item["TID"])}) }</div> : <div>no data yet</div>
            }
        </div>
    )
}

export default Sample