const getSamples = (req) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({"body":[
                {
                    "TID": req.page * 6 + 1,
                    "TName": "Xenomorph",
                    "TDes": "I first show on plant:LV-426"
                },
                {
                    "TID": req.page * 6 + 2,
                    "TName": "Face hugger",
                    "TDes": "I will hold you up"
                },
                {
                    "TID": req.page * 6 + 3,
                    "TName": "Ormorph",
                    "TDes": "I'm just an egg"
                },
                {
                    "TID": req.page * 6 + 4,
                    "TName": "Drone",
                    "TDes": "I'm so poor"
                },
                {
                    "TID": req.page * 6 + 5,
                    "TName": "Queen",
                    "TDes": "I'm the king of the world"
                }]
            })
        }, 1000)
    })
}

export default getSamples