import axios from 'axios'
import router from '../router/index'
import { baseURL } from '@/config'
import publicMethod from "@/lib/util";

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    return config
  }
  interceptors(instance, url) {
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // if (!Object.keys(this.queue).length) // Spin.show()
      this.queue[url] = true;
      //在这里应该验证token 是否失效 也根据业务需求来定 请求头添加token 
      let token = JSON.parse(publicMethod.getCookie('token'))
      if (token) {
        config.headers.common['token'] = token;
      }
      return config
    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => {
      if (res.data.code === -1) {
        publicMethod.removeCookie("token");
        router.push("/login");
      } 
      delete this.queue[url];
      const {data, status} = res; //只取 data .status
      return { data, status}
    }, error => {
      delete this.queue[url];
      return Promise.reject(error)
    })
  }
  request(options) {
    const instance = axios.create();
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options)
  }
}
export default HttpRequest
