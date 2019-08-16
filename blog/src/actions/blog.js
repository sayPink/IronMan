import { getBlogList, getMusicList } from '../api/blog';
import { handleMusicDefault } from '../utils/music'

export const setBlogList = (payload) => {
  return {
    type: 'BLOG_LIST',
    payload
  }
}

export const musicList = (payload) => {
  return {
    type: 'MUSIC_LIST',
    payload
  }
}

export const actionsMusicList = (props) => {
  //action可以是一个函数，有dispatch参数
  return async(dispatch) => {
    const result = await getMusicList()
    if (result.data.code) {
      dispatch(musicList(result.data.data));
      await handleMusicDefault(props)
      // await handleMusicLoad(props)
    }
  }
};

export const blogList = (param) => async dispatch => {
  const result = await getBlogList(param)
  if (result.data.code) {
    // dispatch({type: 'BLOG_LIST', payload: result.data.data});
    dispatch(setBlogList(result.data.data));
  }
}