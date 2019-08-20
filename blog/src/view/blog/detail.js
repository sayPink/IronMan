import React, { Component } from 'react';
import { connect } from 'react-redux';
import {  Skeleton, Spin, Icon, notification } from 'antd';
import { collapsed, handleMusicPlay, actionsMusicPlay } from '../../actions/music';
import { handleMusicPlayOrStop, handleMusicDetailPlat } from '../../utils/music'
import { getBlogDetail, getBlogLike, getBlogHits } from '../../api/blog';
import { dataFormat } from '../../utils/index'
import Error from '../../components/error'
import './detail.less'
import Highlight from 'react-highlight'
import 'highlight.js/styles/atom-one-dark.css'

class Detail extends Component {

  state = {
    error: false,
    blogDetail: [],
    loading: true,
    topBtnShow: false, //
    submitLike: true, //点击量状态切换
    scrollTop: 0,
    errorData: {
      title: '博客列表',
      msg: '',
      path:'/blog',
      code: 404
    }
  }

  async componentDidMount () {
    if (this.props.match.params) {this.getBlogDetail_(this.props.match.params)}
    await this.props.actionsMusicPlay_(true)
    await handleMusicPlayOrStop(this.props)
    await this.handleHits()
  }

  async componentWillUnmount() {
    await this.props.actionsMusicPlay_(true)
    handleMusicDetailPlat()
  }

  // 获取博客详情
  async getBlogDetail_ (param){
    let result = await getBlogDetail(param)
    this.setState({
      blogDetail: result.data.data,
      loading: false,
    })
    if(result.data.data.length === 0) {
      let msg = result.data.msg
      let data = Object.assign({}, this.state.errorData,{msg})
      this.setState({
        errorData: data,
        error: true,
      })
    }
  }

  // 添加点击量
  async handleHits(){
    await getBlogHits(this.props.match.params)
  }

  // 添加关注
  async handleSubmitLike(){
    if (this.state.submitLike){
      this.setState({submitLike: false})
      let result = await getBlogLike(this.props.match.params)
      this.setState({submitLike: true})
      const args = {
        message: !result.data.code ? '失败啦' : '+1',
        description: !result.data.code ? result.data.msg : '点赞成功',
        duration: 2,
      }
      if(!result.data.code){
        notification.error(args)
        return
      }
      notification.success(args)
    }
  }

  handleScroll(e){
    let { scrollTop } = e.target
    if(scrollTop >= 1500){
      this.setState({ topBtnShow: true})
    }else{
      this.setState({ topBtnShow: false})
    }
  }

  handleClickTop(){
    if (this.state.topBtnShow) {
      document.querySelector('.blog-detail').scrollTop = 0
    }
  }

  handleBack(){
    this.props.history.goBack()
  }

  render() {
    const { blogDetail, loading, topBtnShow, submitLike, error, errorData } = this.state
    return (
      <div className='blog-detail' onScroll={this.handleScroll.bind(this)}>
        <Spin spinning={loading} size='large'>
          <Skeleton loading={loading}>
            <div className='btn-back' onClick={this.handleBack.bind(this)}><i className='antIcon-icon antIconleft'></i></div>
            <div className='block-content'>
              { error ? <Error data={errorData}></Error> : blogDetail.map((item, index) => {
                  return <React.Fragment key={item.id}>
                    <h3 className='title'>{item.title}</h3>
                    <div className='info'>编辑时间：{dataFormat(item.update_time)}</div>
                    <Highlight className='detail-content' innerHTML={true}>{item.html}</Highlight>
                    <div className='float-tools'>
                      {
                        topBtnShow && <div className='btn-item btn-top' onClick={ this.handleClickTop.bind(this) } title='返回顶部'><i className='antIcon-icon antIconback-top'></i></div>
                      }
                      <div className='btn-item btn-like' onClick={this.handleSubmitLike.bind(this)} title='点赞'>
                        {
                          submitLike ? <i className='antIcon-icon antIconlike'></i>:<Icon type="loading-3-quarters" spin />
                        }
                      </div>
                    </div>
                  </React.Fragment> 
                })
              }
            </div>
          </Skeleton>
        </Spin>
       </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    musicPlay: state.contactStore.musicPlay,
    musicVolume: state.contactStore.musicVolume,
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleCollapsed_() {
    dispatch(collapsed(false))
  },
  handleMusicPlay_() {
    dispatch(handleMusicPlay())
  },
  actionsMusicPlay_(param) {
    dispatch(actionsMusicPlay(param))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Detail);

