import React, { useState } from 'react'

const FakeCallAPI =  (props) => {
    const [counter, setCounter] = useState(0)
    const [data, setData] = useState(0)
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

    async function handleButtonClick ()  {
        await sleep(500)
        get_sample(counter)
        .then(res => {
            setData(res.body)
        })
    }

    return(
        <div>
            <button onClick={handleButtonClick}>Call API</button>
            {
                data.length > 0 ?
                <table>
                    <thead>
                        <tr>
                            <th>TID</th>
                            <th>TName</th>
                            <th>TDes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data.map(item => {
                                return(
                                    <tr>
                                    <td>{item["TID"]}</td>
                                    <td>{item["TName"]}</td>
                                    <td>{item["TDes"]}</td>
                                </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
                : <div>no data yet</div>
            }
        </div>
    )
}

export default FakeCallAPI