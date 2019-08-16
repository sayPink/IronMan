import React, { Component } from 'react';
import { Icon } from 'antd';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { collapsed, handleMusicPlay, handleMusicActionsDefault, musicIndexAdd, musicIndexMinus, handleMusicMuted } from '../../actions/music';
import { handleMusicPlayOrStop, handleMuSicChangeSong } from '../../utils/music'
import { actionsMusicList } from '../../actions/blog'
import './aside.less';

class Aside extends Component {

  state = {
    tooShort: false
  }

  async componentDidMount() {
    console.log('%c您已进入SuperMan歌舞厅', 'color:#fff;background:green;padding:4px 8px;border-radius: 4px;')
    const that = this;
    window.addEventListener(
      'resize', function(e) {
        if (e.target.innerHeight <= 650) {
          that.state.tooShort = true
        } else {
          that.state.tooShort = false
        }
      },
      false
    )
    this.timerId = setInterval(()=>{this.tick()},1000)
    await this.props.handleMusicList(this.props)
    this.props.handleMusicActionsDefault_()
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  handleJump = (index) =>{
    if (index === 0){
      this.props.setCollapsed(false)
    }else{
      this.props.setCollapsed(true)
    }
  }

  // 暂停播放
  handleMusicPlayOrStop() {
    handleMusicPlayOrStop(this.props)
  }

  // 下一首
  handleMusicNext() {
    this.props.musicIndexAdd_()
    handleMuSicChangeSong()
  }

  // 上一首
  handleMusicMinus() {
    this.props.musicIndexMinus_()
    handleMuSicChangeSong()
  }

  // 
  handleMusicVolume () {
    this.props.handleMusicMuted_()
    let audio = document.getElementById('audio');
    audio.muted = this.props.musicMuted
  }


  tick() { this.setState({data: new Date()}) }

  render() {

    const { collapsed, musicPlay, navData, musicMuted, musicIndex, musicList } = this.props;

    const nav = navData.map((item,index) => {

      return <NavLink  key={item.id} className='nav-item' onClick={this.handleJump.bind(this,index)}  activeClassName='nav-item-active' to={item.url} title={item.title}>
            <i className={`nav-icon antIcon-icon ${item.icon} ${item.id === 1 && musicPlay ? 'icon-spin' : ''}`}/>
            {
              !collapsed && <span>{item.title}</span>
            }
        </NavLink>
    })
   
    return (
      <aside className={`aside ${collapsed ? 'min-aside' : ''}`}>
        <div className='aside-wrap'>
          <img src='http://47.105.192.161:81/public/avatar.png' alt='用户头像'/>
          {
            !collapsed && <p>SuperMan</p>
          }
        </div>

        {/* 导航栏 S */}
        <nav className='nav-wrap'>
          { nav }
        </nav>
        {/* 导航栏 E */}
        
        {/* 底部 S */}
        {!collapsed ?(
          <div className='aside-footer'>
            <div className='aside-wrap'>
              <div className="cat-paw">
                <div className="outer-ring">
                  <div className="item-1"></div>
                  <div className="item-2"></div>
                  <div className="item-3"></div>
                  <div className="item-4"></div>
                  <div className="item-5"></div>
                  <div className="item-6"></div>
                  <div className="item-7"></div>
                  <div className="item-8"></div>
                  <div className="item-9"></div>
                  <div className="item-10"></div>
                  <div className="item-11"></div>
                  <div className="item-12"></div>
                </div>
                <i className='cat antIcon-icon antIconcat-paw'></i>
              </div>
              <div className='time'>{new Date().toLocaleTimeString()}</div>
            </div>
            <a href='https://github.com/GitHub9601'><Icon type='github'/>&nbsp;461377096@qq.com </a>
          </div>
          ):(
            !this.state.tooShort && 
            <div className='aside-music'>
              <i className='antIcon-icon antIconOn'  title='上一曲' onClick={this.handleMusicMinus.bind(this)}/>
              <i className={`antIcon-icon ${musicPlay ? 'antIconStop' : 'antIconBofang'}`} title={`${musicPlay ? '暂停' : '播放'}`} onClick={this.handleMusicPlayOrStop.bind(this)}/>
              <i className='antIcon-icon antIconUnder' title='下一曲' onClick={this.handleMusicNext.bind(this)}/>
              <i className={`antIcon-icon antIconsound ${!musicMuted ? 'disabled' : ''}`} title={`${musicMuted ? '音量' : '静音'}`}  onClick={this.handleMusicVolume.bind(this)}/>
            </div>
          )
        }
        {/* 底部 E */}
        <audio id='audio' controls hidden>
          <source src={musicList.length !== 0 ? musicList[musicIndex].song_path : ''} />
          您的浏览器不支持 audio 标签。
        </audio>
      </aside>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    musicList: state.contactStore.musicList,
    musicIndex: state.contactStore.musicIndex,
    collapsed: state.contactStore.collapsed,
    musicPlay: state.contactStore.musicPlay,
    navData: state.contactStore.navData,
    musicMuted: state.contactStore.musicMuted,
    musicVolume: state.contactStore.musicVolume,
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleMusicList(param) {
    dispatch(actionsMusicList(param))
  },
  setCollapsed(param) {
    dispatch(collapsed(param))
  },
  handleMusicPlay_() {
    dispatch(handleMusicPlay(false))
  },
  handleMusicActionsDefault_() {
    dispatch(handleMusicActionsDefault())
  },
  musicIndexAdd_() {
    dispatch(musicIndexAdd())
  },
  musicIndexMinus_() {
    dispatch(musicIndexMinus())
  },
  handleMusicMuted_() {
    dispatch(handleMusicMuted())
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Aside);