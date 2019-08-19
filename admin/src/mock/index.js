import Mock from 'mockjs'

import { getUserInfo ,userInfoList ,setUserInfo } from './response/user'


// login
// mock传入三个参数 第一个 url 第二个 requerstType  第三模板 模板可以是一个对象
Mock.mock(/\/rent/, getUserInfo) //简写 Mock.mock(/\/rent/, {name:'lison'})

Mock.mock(/\/rents/, setUserInfo) //简写 Mock.mock(/\/rent/, {name:'lison'})

Mock.mock(/\/rent/, userInfoList) //简写 Mock.mock(/\/rent/, {name:'lison'})


// Mock.setup 设置请求延时
// Mock.setup({
//     timeout: 1000
// })

export default Mock