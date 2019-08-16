// music默认值
export const handleMusicDefault = async (props) => {
  let audio = document.getElementById('audio');
  audio.volume = props.musicVolume;
  audio.onended = async () => {
    await props.musicIndexAdd_()
    await audio.load();
    await audio.play();
  }
  audio.load()
  audio.play()
}

// 设置音量
export const handleMusicVolume = async (props) => {
  let audio = document.getElementById('audio');
  audio.volume = props.musicVolume;
}

// 设置音量
export const handleMusicDetailPlat = async (props) => {
  let audio = document.getElementById('audio');
  audio.play()
}

// 暂停播放
export const handleMusicPlayOrStop = async (props) => {
  let audio = document.getElementById('audio');
  if (props.musicPlay) {
    audio.pause()
  } else {
    audio.play()
  }
  await props.handleMusicPlay_()
}

// 换歌
export const handleMuSicChangeSong = () => {
  let audio = document.getElementById('audio');
  audio.load()
  audio.play()
}
