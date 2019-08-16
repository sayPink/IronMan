const defaultState = {
  progress: 0,
  musicList: [],
  musicIndex: 0, //
  musicVolume: .5,
  collapsed: false, //侧栏收缩
  musicPlay: true, //是否播放
  musicMuted: true, //是否静音
  navData: [{
      id: 1,
      title: '首页',
      icon: 'antIconCd',
      url: '/home'
    },
    {
      id: 2,
      title: '博客',
      icon: 'antIconjishibentxt',
      url: '/blog'
    }
  ],
}

export default (state = defaultState, action = {}) => {
  switch (action.type) {
    case 'COLLAPSED': {
      return {
        ...state,
        collapsed: action.payload
      }
    }
    case 'MUSIC_LIST': {
      return {
        ...state,
        musicList: action.payload
      }
    }
    case 'MUSIC_PLAY': {
      return {
        ...state,
        musicPlay: !state.musicPlay
      }
    }
    case 'MUSIC_PLAYS': {
      return {
        ...state,
        musicPlay: action.payload
      }
    }
    case 'MUSIC_DEFAULT': {
      return {
        ...state,
        musicPlay: true,
        musicMuted: state.musicVolume === 0 ? false : true
      }
    }
    case 'MUSIC_MUTED': {
      return {
        ...state,
        musicMuted: !state.musicMuted,
      }
    }
    case 'MUSIC_VOLUME': {
      return {
        ...state,
        musicVolume: action.payload,
        musicMuted: action.payload === 0 ? false : true
      }
    }
    case 'NAV': {
      return {
        ...state,
        navData: action.payload,
      }
    }
    case 'MUSIC_INDEX_ADD': {
      let musicIndex = state.musicIndex + 1
      return {
        ...state,
        musicPlay: true,
        musicIndex: musicIndex === state.musicList.length ? 0 : musicIndex
      }
    }
    case 'MUSIC_INDEX_MINUS': {
      let musicIndex = state.musicIndex - 1
      return {
        ...state,
        musicPlay: true,
        musicIndex: musicIndex === -1 ? state.musicList.length - 1 : musicIndex
      }
    }
    case 'PROGRESS': {
      return {
        ...state,
        progress: action.payload,
      }
    }
    default:
      return state;
  }
}