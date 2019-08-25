const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const { blog_path } = require('../utils/config');
// 上传文件
const upload = async (req, res) => {
  const { flag } = req.query
  const form = new formidable.IncomingForm();
  let imgPath = path.join(__dirname, '../public/temporaryFolder');
  form.multiples = false; //传入文件计算校验和，请将其设置为'sha1'或'md5'
  // 如果目录不存在则创建
  if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath)
  form.uploadDir = imgPath
  form.maxFieldsSize = flag === 'picture' ? 5 * 1024 * 1024 : 20 * 1024 * 1024;
  let result = await new Promise((resolve, reject) => {
    form.parse(req, function (err, fields, files) {
      if (err) {
        reject(err);
      } else {
        let file = files.file || files.imgfile || files.image;
        if (flag === 'picture'){
          if (file.type !== 'image/png' && file.type !== 'image/jpeg') return res.send({ code: 0, msg:  '图片格式只支持jpg和png' })
        }else{
          if (file.type !== 'audio/mp3') return res.send({ code: 0, msg: '音频只支持mp3' })
        }
        if (file.size >= form.maxFieldsSize) return res.send({ code: 0, msg: `${flag === 'picture' ? '图片大小超过5M啦': '音频大小超过20M啦' }` })
        let newPath = file.path + '_' + file.name
        fs.renameSync(file.path, newPath);
        resolve({
          path: newPath,
          size: file.size
        })
      }
    });
  })
  const basename = path.basename(result.path)
  res.send({ code: 1, msg: '上传成功', data: basename })
}

const moveFile = (fileName, filePlace) => {
  let newPath = null
  if (filePlace === 'music'){
    newPath = path.join(__dirname, '../public/image/blog/music');
  }
  if (filePlace === 'music_bg') {
    newPath = path.join(__dirname, '../public/image/blog/music_bg');
  }
  if (filePlace === 'user_picture') {
    newPath = path.join(__dirname, '../public/image/blog/user_picture');
  }
  if (filePlace === 'blog') {
    newPath = path.join(__dirname, '../public/image/blog/blog');
  }
  let oldPath = path.join(__dirname, '../public/temporaryFolder');
  let newFileName = fileName.split('_');
  let newFilePath = newFileName[newFileName.length - 1]
  return new Promise((resolve, reject) => {
    fs.rename(`${ oldPath }/${ fileName }`, `${ newPath }/${ newFilePath }`, (err) => {
      if (err) {
        reject({code:0,msg:'移动文件出错'})
      } else {
        resolve()
      }
    })
  })
}

const markDownMoveFile = (req, res) => {
  let { fileName } = req.body
  let newPath = path.join(__dirname, '../public/image/blog/blog');
  let oldPath = path.join(__dirname, '../public/temporaryFolder');
  let newFileName = fileName.split('_');
  let newFilePath = newFileName[newFileName.length - 1]
  return new Promise((resolve, reject) => {
    fs.rename(`${ oldPath }/${ fileName }`, `${ newPath }/${ newFilePath }`, (err) => {
      if (err) {
        reject({code:0,msg:'移动文件出错'})
      } else {
        resolve(res.send({code: 1, msg: '移动文件成功', data: blog_path+newFilePath}))
      }
    })
  })
}

module.exports = {
  upload,
  moveFile,
  markDownMoveFile
}
