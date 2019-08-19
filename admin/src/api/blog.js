import axios from './index'

// 上传图片
export const upload = (data) => {
  return axios.request({
    url: '/api/upload?flag=picture',
    method: 'post',
    data
  })
}

// 上传图片
export const markDownMoveFile = (data) => {
  return axios.request({
    url: '/api/blog/validate/markDownMoveFile',
    method: 'post',
    data
  })
}

// 博客列表
export const getBlogList = (data) => {
  return axios.request({
    url: '/api/blog/getBlogList',
    method: 'post',
    data
  })
}

// 删除博客
export const deleteBlog = (data) => {
  return axios.request({
    url: '/api/blog/validate/deleteBlog',
    method: 'post',
    data
  })
}

// 编辑博客
export const editBlog = (data) => {
  return axios.request({
    url: '/api/blog/validate/editBlog',
    method: 'post',
    data
  })
}

// 博客详情
export const getBlogDetail = (data) => {
  return axios.request({
    url: '/api/blog/getBlogDetail',
    method: 'post',
    data
  })
}

// 添加博客
export const addBlog = (data) => {
  return axios.request({
    url: '/api/blog/validate/addBlog',
    method: 'post',
    data
  })
}

// 取消置顶
export const cancelTop = (data) => {
  return axios.request({
    url: '/api/blog/validate/cancelTop',
    method: 'post',
    data
  })
}

// 音乐列表
export const getMusicList = (data) => {
  return axios.request({
    url: '/api/blog/getMusicList',
    method: 'post',
    data
  })
}

// 删除音乐
export const deleteMusic = (data) => {
  return axios.request({
    url: '/api/blog/validate/deleteMusic',
    method: 'post',
    data
  })
}

// 添加音乐
export const addMusic = (data) => {
  return axios.request({
    url: '/api/blog/validate/addMusic',
    method: 'post',
    data
  })
}

// 编辑音乐
export const editMusic = (data) => {
  return axios.request({
    url: '/api/blog/validate/editMusic',
    method: 'post',
    data
  })
}

// 标签列表
export const getBlogTagList = (data) => {
  return axios.request({
    url: '/api/blog/getBlogTagList',
    method: 'post',
    data
  })
}

// 编辑标签
export const editBlogTag = (data) => {
  return axios.request({
    url: '/api/blog/validate/editBlogTag',
    method: 'post',
    data
  })
}

// 删除标签
export const deleteBlogTag = (data) => {
  return axios.request({
    url: '/api/blog/validate/deleteBlogTag',
    method: 'post',
    data
  })
}

// 删除标签
export const addBlogTag = (data) => {
  return axios.request({
    url: '/api/blog/validate/addBlogTag',
    method: 'post',
    data
  })
}

// 获取分类
export const getBlogClassNameList = (data) => {
  return axios.request({
    url: '/api/blog/getBlogClassNameList',
    method: 'post',
    data
  })
}

// 编辑分类
export const editBlogClass = (data) => {
  return axios.request({
    url: '/api/blog/validate/editBlogClass',
    method: 'post',
    data
  })
}

// 添加分类
export const addBlogClass = (data) => {
  return axios.request({
    url: '/api/blog/validate/addBlogClass',
    method: 'post',
    data
  })
}

// 添加分类
export const deleteBlogClass = (data) => {
  return axios.request({
    url: '/api/blog/validate/deleteBlogClass',
    method: 'post',
    data
  })
}