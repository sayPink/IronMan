
const defaultState = {
    blogList: []
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'BLOG_LIST': {
      return {
        ...state,
        blogList: action.payload
      }
    }
    default:
      return state;
  }
}