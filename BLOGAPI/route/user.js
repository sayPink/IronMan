const express = require('express');
const { login, register, getUserAll, editPassword, editUserInfo, getUserInfo, deleteUserInfoAll } = require('../logic/user')

module.exports = () => {

  const router = express.Router();
  // 用户登录
  router.post('/login', (req, res) => login(req, res))
  // 用户注册
  router.post('/register', (req, res) => register(req, res))
  // 获取用户信息
  router.post('/validate/getUserInfo', (req, res) => getUserInfo(req, res))
  // 获取所有用户
  router.post('/validate/getUserAll', (req, res) => getUserAll(req, res))
  // 修改密码
  router.post('/validate/editPassword', (req, res) => editPassword(req, res))
  // 修改用户信息
  router.post('/validate/editUserInfo', (req, res) => editUserInfo(req, res))
  // 删除用户
  router.post('/validate/deleteUserInfoAll', (req, res) => deleteUserInfoAll(req, res))

  return router;
}
