const express = require('express');

const {
  getBlogList,
  addBlog,
  editBlog,
  cancelTop,
  deleteBlog,
  getBlogClassNameList, 
  getBlogTagList, 
  getBlogDetail,
  getBlogLike,
  getBlogHits, 
  getMusicList, 
  deleteMusic,
  musicDetail,
  addMusic,
  editMusic,
  editBlogTag,
  deleteBlogTag, 
  addBlogTag,
  editBlogClass,
  addBlogClass,
  deleteBlogClass
} = require('../logic/blog.js')


module.exports = () => {
    const router = express.Router();
    // 获取用户信息
    router.post('/getBlogList', (req, res) => getBlogList(req, res))

    router.post('/getMusicList', (req, res) => getMusicList(req, res))

    router.post('/getBlogDetail', (req, res) => getBlogDetail(req, res))

    router.post('/getBlogLike', (req, res) => getBlogLike(req, res))

    router.post('/getBlogHits', (req, res) => getBlogHits(req, res))

    router.post('/getBlogClassNameList', (req, res) => getBlogClassNameList(req, res))

    router.post('/getBlogTagList', (req, res) => getBlogTagList(req, res))

    // 
    router.post('/validate/editBlogTag', (req, res) => editBlogTag(req, res))

    router.post('/validate/deleteBlogTag', (req, res) => deleteBlogTag(req, res))

    router.post('/validate/addBlogTag', (req, res) => addBlogTag(req, res))
    // class
    router.post('/validate/editBlogClass', (req, res) => editBlogClass(req, res))

    router.post('/validate/addBlogClass', (req, res) => addBlogClass(req, res))

    router.post('/validate/deleteBlogClass', (req, res) => deleteBlogClass(req, res))
    // 删除音乐
    router.post('/validate/deleteMusic', (req, res) => deleteMusic(req, res))

    router.post('/validate/addMusic', (req, res) => addMusic(req, res))

    router.post('/validate/editMusic', (req, res) => editMusic(req, res))
    // 新增博客
    router.post('/validate/addBlog', (req, res) => addBlog(req, res))

    router.post('/validate/cancelTop', (req, res) => cancelTop(req, res))

    router.post('/validate/deleteBlog', (req, res) => deleteBlog(req, res))

    router.post('/validate/editBlog', (req, res) => editBlog(req, res))

    router.post('/validate/musicDetail', (req, res) => musicDetail(req, res))

    return router;
}
