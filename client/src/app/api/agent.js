import axios from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

const sleep = () => new Promise(resolve => setTimeout(resolve,500)); //fonksiyon oluşturduk delay vermek için ürünler veya ürün yüklenirken

axios.defaults.baseURL = "http://localhost:5000/";

const responseBody = (response) => response.data;

axios.interceptors.response.use(
  async (response) => {
    await sleep(); //fonksiyon başına async yazdık dikkat et 
    return response; //hata yoksa yapacağı virgülden sonrası ise hata varsa ne yapacağı
  },
  (error) => {
    const { data, status } = error.response;
    switch (status) {
      case 400:  //hem validation error hem badrequest 400 döner biz validationda yani formda modelState hatası çıktı mesela onu formun üstünde falan yazdırmamız gerek o yüzden böyle yaptık
        if(data.errors){
          const modelStateErrors=[];
          for(const key in data.errors){ //key dediğimiz şey problem1 problem2 onların karşılığı ise this is the first error falan bunları aldık sadece keyleri değil
            if(data.errors[key]){
              modelStateErrors.push(data.errors[key]); 
            }
          }
          throw modelStateErrors.flat(); //burdan throw ile attığımızı catch ile AboutPage'te ilgili yerde yakalıyoruz. flat methodu array içindeki sadece string kısmını almaya yarar
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        router.navigate("/server-error",{state:{error:data}})
        break;
      case 404:
        router.navigate("/not-found")
    }
    return Promise.reject(error.response); //bunu eklemezsek dotnet ile oluşturduğumuz hataları yakalayamıyoruz ondan ekledik örneğin 2222 idli ürüne gitsek yakalar bu olmadan
    //ancak bu hataları yakalayabilmesi için bir özelliği yok daha o yüzden isteğin yapıldığı yerde catch kullanmak gerek.
  }
);

const requests = {
  get: (url) => axios.get(url).then(responseBody),
  post: (url, body) => axios.post(url, body).then(responseBody),
  put: (url, body) => axios.put(url, body).then(responseBody),
  delete: (url) => axios.delete(url).then(responseBody),
};

const testErrors = {
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  get404Error: () => requests.get("buggy/not-found"),
  get500Error: () => requests.get("buggy/server-error"),
  getValidationError: () => requests.get("buggy/validation-error"),
};

const Catalog = {
  list: () => requests.get("products"),
  details: (id) => requests.get(`products/${id}`),
};
//en başta urlyi default olarak ayarladığımız için yazmadık sadece gerekli kısmı yazdık.

const agent = {
  Catalog,
  testErrors,
};
export default agent;
