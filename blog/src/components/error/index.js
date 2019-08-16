import React, { Component } from 'react';
import { connect } from 'react-redux';
import { collapsed } from '../../actions/music';
import { NavLink } from 'react-router-dom'
import './index.less'


class Error extends Component {
  constructor(props) {
    super(props);
    console.log(props)
  }

  getRandomColor() {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16)
  }

  render() {

    const { data } = this.props
    
    return (
      <div className="error-view">
        <div className="fore">
          {
            data.code.toString().split('').map((i, index) => <span key={index} style={{color: this.getRandomColor(this)}}>{i}</span>)
          }
        </div>
        <p>{data.msg}</p>
        <p> 返回 <NavLink to={data.path}>{data.title}</NavLink></p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
     blogList: state.blog.blogList,
    collapsed: state.contactStore.collapsed,
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleCollapsed_() {
    dispatch(collapsed(false))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Error);
