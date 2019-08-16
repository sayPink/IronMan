import React, { Component } from 'react';
import { Slider } from 'antd';
import { connect } from 'react-redux';
import { collapsed, handleMusicPlay, musicIndexAdd, musicIndexMinus, handleMusicMuted,handleMusicActionsVolume } from '../../actions/music';
import { handleMusicPlayOrStop, handleMuSicChangeSong, handleMusicVolume } from '../../utils/music'
import './index.less'

class App extends Component {

  componentDidMount() {
    this.props.handleCollapsed_(false)
   }

  // 暂停播放
  handleMusicPlayOrStop() {
    handleMusicPlayOrStop(this.props)
  }

  // 下一首
  handleMusicNext(){
    this.props.musicIndexAdd_()
    handleMuSicChangeSong()
  }

  // 上一首
  handleMusicMinus() {
    this.props.musicIndexMinus_()
    handleMuSicChangeSong()
  }

  // 音量or静音
  handleMusicVolume () {
    this.props.handleMusicMuted_()
    let audio = document.getElementById('audio');
    audio.muted = this.props.musicMuted
  }

  async handleMusicOnChangeVolume(value) {
    let val = Number((value / 100).toFixed(2))
    await this.props.handleMusicActionsVolume_(val)
    handleMusicVolume(this.props)
  } 

  render() {
    const { musicPlay, musicList, musicIndex, musicMuted, musicVolume } = this.props;
    return (
      <div className="main">
          <div className='music-container'>
            <div className="music-info">{musicList.length !== 0 ? musicList[musicIndex].song_name : ''} - {musicList.length !== 0 ? musicList[musicIndex].singer : ''}</div>
            <div className="bg-info">图片来源：{musicList.length !== 0 ? musicList[musicIndex].source : ''}</div>
          </div>
          <div className='ctrl-tools'>
              <i className='antIcon-icon antIconOn'  title='上一曲' onClick={this.handleMusicMinus.bind(this)}/>
              <i className={`antIcon-icon ${musicPlay ?'antIconStop':'antIconBofang'}`} title={`${musicPlay ?'暂停':'播放'}`} onClick={this.handleMusicPlayOrStop.bind(this)}/>
              <i className='antIcon-icon antIconUnder' title='下一曲' onClick={this.handleMusicNext.bind(this)}/>
              <i className={`antIcon-icon antIconsound ${!musicMuted?'disabled':''}`} title={`${musicMuted ?'音量':'静音'}`} onClick={this.handleMusicVolume.bind(this)}/>
              <div className='volume-container'>
                <span>{musicVolume * 100}%</span>
                <Slider dots max={100} tipFormatter={null} onChange={this.handleMusicOnChangeVolume.bind(this)} vertical defaultValue={musicVolume * 100} />
              </div>
          </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    musicList: state.contactStore.musicList,
    musicIndex: state.contactStore.musicIndex,
    collapsed: state.contactStore.collapsed,
    musicPlay: state.contactStore.musicPlay,
    musicMuted: state.contactStore.musicMuted,
    musicVolume: state.contactStore.musicVolume,
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleCollapsed_(param) {
    dispatch(collapsed(param))
  },
  handleMusicPlay_(param) {
    dispatch(handleMusicPlay(param))
  },
  musicIndexAdd_() {
    dispatch(musicIndexAdd())
  },
  musicIndexMinus_() {
    dispatch(musicIndexMinus())
  },
  handleMusicMuted_() {
    dispatch(handleMusicMuted())
  },
  handleMusicActionsVolume_(param) {
    dispatch(handleMusicActionsVolume(param))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
