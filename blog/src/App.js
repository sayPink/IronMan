import React, { Component } from 'react';
import { connect } from 'react-redux';
import Aside from './components/aside';
import './App.less';
class App extends Component {
  render() {
    // console.log(this.props.children)
    const {  musicList, musicIndex } = this.props;
    return (
      <div className="App">
        <section className='container' style={{backgroundImage:`url('${musicList.length !== 0 ? musicList[musicIndex].bg_path : ''}')`}}>
          <Aside></Aside>
          <section className='main-wrap'>
            { this.props.children }
          </section>
        </section>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    musicList: state.contactStore.musicList,
    musicIndex: state.contactStore.musicIndex,
  }
}
const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(App);

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { collapsed } from '../../actions/music';

// import './detail.less'

// class Detail extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//         </header>
//       </div>
//     );
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//      blogList: state.blog.blogList,
//     collapsed: state.contactStore.collapsed,
//   }
// }

// const mapDispatchToProps = (dispatch) => ({
//   handleCollapsed_() {
//     dispatch(collapsed(false))
//   },
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Detail);

