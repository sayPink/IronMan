import { routeHasExist } from '@/lib/util'

const state = {
  tabList: [],
  labelPath: '',
}
const mutations = {

  UPDATE_ROUTER(state, route) {
    if (!routeHasExist(state.tabList, route)) state.tabList.push(route)
  },

  DELETE_ROUTER(state, delParam) {
    if (state.tabList.length === 1) return false;
    let index = state.tabList.findIndex(value => value.name === delParam.name)
    if (delParam.activeName === delParam.name) {
      if (index != 0 && index == state.tabList.length - 1) state.labelPath = state.tabList[index - 1].name;
      else state.labelPath = state.tabList[index + 1].name;
    } else {
      if (index == 0 && state.tabList.length == 1) state.labelPath = state.tabList[index + 1].name;
      else state.labelPath = delParam.activeName;
    }
    state.tabList.splice(index, 1);
  },

}
const actions = {
  //
}

export default {
  state,
  mutations,
  actions
}
