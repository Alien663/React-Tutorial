import axios from 'axios'

//const apiurl = 'http://localhost:59089/api';
const config = {
    apiurl: '/api',
    cors: false,
}

if(process.env.NODE_ENV === 'development'){
    config.apiurl = "http://localhost:59089/api",
    config.cors = true
}


export default function ({
	cmd,
	method = 'GET',
	type = 'json',
	data = {},
	header = {},
	fileList = [],
}) {
	method = method.toUpperCase()
	type = type.toLowerCase()
	let url = `${config.apiurl}/${cmd}`
	let option = {
		method,
		headers: {
			'Content-Type': 'application/json',
			...header,
		}
	}
	if (fileList.length) {
		let formData = new FormData()
		formData.append('file', fileList[0], fileList[0].name);
		for (let k in data)
			formData.append(k, data[k])
		option.headers['Content-Type'] = 'multipart/form-data'
	}
	switch (method) {
		case 'POST':
		case 'PUT':
		case 'DELETE':
			option.data = data
			break;
		case 'GET':
			option.params = data
			break;
	}
	return axios({
			method,
			url,
			...option,
			withCredentials: !! config.cors,
		}).then((res) => {
			return	{
				ok:res.status=='200',
				status:res.status,
				body:res.data
			}
			})
		.catch(err => {
			let res =err.response
			if(res){
				return {
				ok:res.status=='200',
				status:res.status,
				body:res.data
				}
			}
			else {
				return {
				ok:false,
				status:404,
				body:err.message
				}
			}
		})
}
