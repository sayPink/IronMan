const mysql = require('mysql');
const jwt = require('jsonwebtoken')
// 密钥
const secret = '*********'

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  port: 3305,
  password: '*****',
  database: '*****'
})

const sever_url = `http://********/image/blog/user_picture/`;

const music_bg = `http://********/image/blog/music_bg/`;

const music_path = `http://********/image/blog/music/`;

const blog_path = `http://********/image/blog/blog/`;

// 签发 Token
const createToken = (payload) => {
  try {
    return new Promise((resolve, reject) => {
      let token = jwt.sign(payload, secret, {
        expiresIn: '1day'
      })
      resolve(token)
    })
  } catch (e) {
    console.error(e)
  }
}

// 验证token
const verifyToken = (token) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (error, decoded) => {
        if (error) {
          reject(error)
        } else {
          resolve(decoded)
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}

// 更新数据失败
const execute = (sql, values) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(sql, values, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  } catch (e) {
    console.error(e)
  }
}

module.exports = {
  execute,
  createToken,
  verifyToken,
  sever_url,
  music_bg,
  music_path,
  blog_path
}
