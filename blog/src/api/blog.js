import axios from './index'

// 音乐列表
export const getMusicList = (data) => {
    return axios.request({
        url: '/api/blog/getMusicList',
        method: 'post',
        data
    })
}

// 用户列表
export const getBlogList = (data) => {
    return axios.request({
        url: '/api/blog/getBlogList',
        method: 'post',
        data
    })
}

// 
export const getBlogDetail = (data) => {
    return axios.request({
        url: '/api/blog/getBlogDetail',
        method: 'post',
        data
    })
}

//
export const getBlogClassName = (data) => {
    return axios.request({
        url: '/api/blog/getBlogClassNameList',
        method: 'post',
        data
    })
}

// 
export const getBlogTagList = (data) => {
    return axios.request({
        url: '/api/blog/getBlogTagList',
        method: 'post',
        data
    })
}
// 
export const getBlogLike = (data) => {
    return axios.request({
        url: '/api/blog/getBlogLike',
        method: 'post',
        data
    })
}
// 
export const getBlogHits = (data) => {
    return axios.request({
        url: '/api/blog/getBlogHits',
        method: 'post',
        data
    })
}