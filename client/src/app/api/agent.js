import axios from "axios"

axios.defaults.baseURL='http://localhost:5000/'

const  responseBody=(response)=> response.data; 

const requests={
    get: (url) => axios.get(url).then(responseBody),
    post: (url,body) => axios.post(url,body).then(responseBody),
    put: (url,body) => axios.put(url,body).then(responseBody),
    delete: (url) => axios.delete(url).then(responseBody),
}

const testErrors={
    get400Error : () => requests.get('buggy/bad-request'),
    get401Error : () => requests.get('buggy/unauthorized'),
    get404Error : () => requests.get('buggy/not-found'),
    get500Error : () => requests.get('buggy/server-error'),
    getValidationError : () => requests.get('buggy/validation-error')
}

const Catalog={
    list: ()=>requests.get('products'),
    details: (id)=>requests.get(`products/${id}`),
}
//en başta urlyi default olarak ayarladığımız için yazmadık sadece gerekli kısmı yazdık.

const agent={
    Catalog,
    testErrors
}
export default agent;