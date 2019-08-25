const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());
const { validateToken } = require('./logic/user')
const { upload, markDownMoveFile } = require('./logic/upload')

// 验证token
 app.all('/api/user/validate/*', (req, res, next) => validateToken(req, res, next))
 app.all('/api/blog/validate/*', (req, res, next) => validateToken(req, res, next))

// 上传
app.post('/api/upload', (req, res, next) => upload(req, res, next))
app.post('/api/blog/validate/markDownMoveFile', (req, res, next) => markDownMoveFile(req, res, next))
// 用户模块
app.use('/api/user', require('./route/user.js')());
app.use('/api/user/validate', require('./route/user.js')());

// 
app.use('/api/blog', require('./route/blog.js')());
app.use('/api/blog/validate', require('./route/blog.js')());

app.listen(3006, () => {
  console.log('server is runnig on port 3006')
})