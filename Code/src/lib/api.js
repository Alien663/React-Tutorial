import { isDevelopmentMode } from 'is-development-mode';
import axios from 'axios'

const req_config = {
    apiurl : "/api",
    cors : false,
}

if(isDevelopmentMode()){
    req_config["apiurl"] = "https://localhost:5000/api"
    req_config["cors"] = true
}

export default function({
    cmd,
	method = "GET",
	payload = {},
	header = {},
	fileList = [],
}) {
    if(["GET", "POST", "PUT", "DELETE"].indexOf(method.toUpperCase()) === -1){
        throw `Error : The HTTP method "${method}" is not acceptable`
    }
    let url = `${req_config.apiurl}/${cmd}`
    let option = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...header
        },
    }

    if(req_config["cors"]) option.headers["Access-Control-Allow-Origin"] = "*"

    switch(method){
        case 'POST':
		case 'PUT':
		case 'DELETE':
			option.data = payload
			break;
		case 'GET':
			option.params = payload
			break;
    }

    if(fileList.length){
        let formData = new FormData()
        formData.append("file", fileList[0], fileList[0].name)
        for(let k in payload){
            formData.append(k, payload[k])
        }
        option.headers["Content-Type"] = "multipart/form-data"
    }

    return axios({
        method,
        url,
        withCredentials: !req_config["cors"],
        ...option
    })
        .then( res => {
            return {
				ok:res.status=='200',
				status:res.status,
				body:res.data,
            }
        })
        .catch( err => {
            let res = err.response
            if(res){
                return {
                    ok:res.status=='200',
                    status:res.status,
                    body:res.data
                }
            }
            else{
                return {
                    ok:false,
                    status:404,
                    body:err.message
                }
            }
        })
}