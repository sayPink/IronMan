import axios from 'axios'
import { baseURL } from './config'
// import store from '../store'
// import { actionProgress } from '../actions/music.js'

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      // onUploadProgress: progressEvent => {
      //   // 这里实现上传进度条
      //   let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
      //   console.log(complete)
      //   store.dispatch(actionProgress(complete))
      // },
    }
    return config
  }
  interceptors(instance, url) {
    instance.interceptors.request.use(config => {
      // 添加全局的loading...
      // if (!Object.keys(this.queue).length) // Spin.show()
      this.queue[url] = true;
      //在这里应该验证token 是否失效  也根据业务需求来定       // 请求头添加token 
      //   config.headers.common['token'] = token;
      return config
    }, error => {
      return Promise.reject(error)
    })
    instance.interceptors.response.use(res => {
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
