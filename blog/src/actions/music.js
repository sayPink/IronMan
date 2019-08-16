export const collapsed = (payload) => {
  return {
    type: 'COLLAPSED',
    payload
  }
}

export const handleMusicPlay = () => {
  return {
    type: 'MUSIC_PLAY',
  }
}

export const actionsMusicPlay = (payload) => {
  return {
    type: 'MUSIC_PLAYS',
    payload
  }
}

export const handleMusicActionsDefault = () => {
  return {
    type: 'MUSIC_DEFAULT',
  }
}

export const handleMusicMuted = () => {
  return {
    type: 'MUSIC_MUTED'
  }
}

export const handleMusicActionsVolume = (payload) => {
  return {
    type: 'MUSIC_VOLUME',
    payload
  }
}

export const navData = () => {
  return {
    type: 'NAV',
  }
}

export const musicIndexAdd = () => {
  return {
    type: 'MUSIC_INDEX_ADD',
  }
}

export const musicIndexMinus = () => {
  return {
    type: 'MUSIC_INDEX_MINUS',
  }
}


export const actionProgress = (payload) => {
  return {
    type: 'PROGRESS',
    payload
  }
}