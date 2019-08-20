import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tag, Skeleton, Spin, Empty } from 'antd';
import { NavLink } from 'react-router-dom'
import QueueAnim from 'rc-queue-anim';
import { getBlogList, getBlogClassName, getBlogTagList } from '../../api/blog';
import { collapsed } from '../../actions/music';
import { dataFormat } from '../../utils/index'
import './index.less'

class Blog extends Component {

  state = {
    blogList: [],
    blogClassList: [],
    blogTagList: [],
    loading: true,
    classLoading: true,
    tagLoading: true,
    classIndex: 0,
    queryLock: true,
    isShow: '',
    page: 1,
    search: ''
  }

  componentDidMount () {
    this.getBlogList_() //博客列表
    this.getBlogClassName_() //博客列表
    this.getBlogTagList_() //博客列表
    this.props.handleCollapsed_(true)
  }

  async getBlogClassName_() {
    let result = await getBlogClassName()
    this.setState({
      blogClassList: result.data.data,
      classLoading: false,
    })
  }

  handleScroll(e){
    const that = this
    let { scrollTop, clientHeight, scrollHeight } = e.target
    if (scrollTop + clientHeight >= scrollHeight && this.state.queryLock) {
      this.setState({ page: ++that.state.page })
      this.getBlogList_()
    }
  }

  async handleClass(id,index){
    if (index !== this.state.classIndex){
      await this.setState({loading: true, classIndex: index, queryLock: true, search: id, blogList: [], page: 1})
      this.getBlogList_()
    }
  }

  // 获取博客列表
  async getBlogList_ (){
    if (!this.state.queryLock){
      console.log('请求繁忙')
      return
    }
    this.setState({queryLock: false})
    let param = { page_num: this.state.page, search: this.state.search }
    let result = await getBlogList(param)
    let blogList = this.state.blogList
    result.data.data.map(item => blogList.push(item))
    this.setState({
      blogList,
      isShow: result.data.data.length,
      loading: false,
      queryLock: result.data.data.length !== 12 ? false : true
    })
  }

  // 获取博客tag
  async getBlogTagList_() {
    let result = await getBlogTagList()
    this.setState({
      blogTagList: result.data.data,
      tagLoading: false
    })
  }

  render() {
    const { blogList, blogClassList, blogTagList, loading, tagLoading, classLoading, queryLock, isShow } = this.state
    const BLOG_LIST = blogList.map((item,index) =>{
      return <QueueAnim className='item' key={item.id} 
        animConfig={[
          { opacity: [1, 0], translateY: [0, 50] },
          { opacity: [1, 0], translateY: [0, -50] }
        ]}>
        <div key='a'>
          {
            item.is_top ? <span className='is-top' title="这篇博客已被置顶"></span> : ''
          }
          <NavLink to={`/blog/detail/${item.id}`} title={item.title}>
            <img src={item.cover_path} alt='封面图片'/>
            <div className='item-info'>
              <h4>{item.title}</h4>
              <div className='value-line'>
                <span>
                  {item.like}
                  <span> 赞 </span>
                  {item.hits}
                  <span> 阅读 </span>
                </span>
                <span>{dataFormat(item.update_time)}</span>
              </div>
            </div>
          </NavLink>
        </div>
      </QueueAnim>  
    })

    const BLOG_CLASS_NAME = blogClassList.map((item, index) => {
      return <div onClick={(e)=> this.handleClass(item.id,index)} className={`blog-item blog-item-${index} ${index === this.state.classIndex ? 'active' : ''}`} key={item.id}>
        <label>{item.class_name}</label>
        <span>{item.total}</span>
      </div>
    })

    const TAGS_COLOR = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple']

    const BLOG_TAGS = blogTagList.map((item,index)=>{
      let num = parseInt(Math.random() * TAGS_COLOR.length);
      return <Tag color={TAGS_COLOR[num]} key={item.id}>{item.tag_name}</Tag>
    })

    let prompt
    if (!loading) {
      if (isShow <= 12 ) {
        prompt = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
      if (blogList.length === 0) {
        prompt = `暂无博客,@SuperMan发一篇`
      }
      if (queryLock) {
        prompt = <Spin />
      }
    }
  
    return (
      <div className="blog-main" onScroll={this.handleScroll.bind(this)}>
        <Spin spinning={loading} size='large'>
          <header className="main-container">
            <Skeleton loading={classLoading}>
              { BLOG_CLASS_NAME }
            </Skeleton>
          </header>
          <section style={{display: 'flex'}}>
            <div className='container-left'>
              <div className='blog-list'>
                <Skeleton loading={loading}>
                  { BLOG_LIST }
                </Skeleton>
              </div>
              {/*  */}
              <div className='example'>
                { prompt }
              </div>
              {/*  */}
            </div>
            <div className='container-right'>
              <Skeleton loading={tagLoading}>
                { BLOG_TAGS }
              </Skeleton>
            </div>
          </section>
        </Spin>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    blogList: state.blog.blogList,
    collapsed: state.contactStore.collapsed
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleCollapsed_(param) {
    dispatch(collapsed(param))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
