import axios from './index'

// 用户列表
export const getUserAll = (param) => {
  return axios.request({
    url: '/api/user/validate/getUserAll',
    method: 'post',
    data: param
  })
}

// 用户登录
export const login = (param) => {
  return axios.request({
    url: '/api/user/login',
    method: 'post',
    data: param
  })
}

// 获取用户信息
export const getUserInfo = (param) => {
  return axios.request({
    url: '/api/user/validate/getUserInfo',
    method: 'post',
    data: param
  })
}
// 用户登录修改密码
export const editPassword = (param) => {
  return axios.request({
    url: '/api/user/validate/editPassword',
    method: 'post',
    data: param
  })
}

// 修改用户信息
export const editUserInfo = (param) => {
  return axios.request({
    url: '/api/user/validate/editUserInfo',
    method: 'post',
    data: param
  })
}

// 删除用户
export const deleteUserInfoAll = (param) => {
  return axios.request({
    url: '/api/user/validate/deleteUserInfoAll',
    method: 'post',
    data: param
  })
}
