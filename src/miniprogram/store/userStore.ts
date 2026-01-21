import { LoginOutput } from "../apis"
import api from "../apis/api";
import { getCurrentPageUrlWithArgs } from "../common/util";
import config from "../config";


const defaultUser: LoginOutput = {
  id: 0,
  account: '',
  status: 0,
  openId: '',
  unionId: '',
  mobile: '',
  email: '',
  nickName: '',
  avatar: '',
  createdTime: new Date()
}

type Listener = () => void
const listeners: Listener[] = []

const state = {
  user: { ...defaultUser },
  accessToken: '',
}

const updateUserStore = (user: any) => {
  state.user = { ...state.user, ...user }
}
const login = async (login_redirect = true) => {
  if (!state.accessToken) {
    let loginRes: any = await wx.login();
    console.log('wx.login', loginRes)
    const res = await api.user.login({ code: loginRes.code })
    state.accessToken = res.data.accessToken
    await refreshData(login_redirect)
  }
  return state.user
}

const refreshData = async (login_redirect = true) => {
  let res = await api.user.getUserInfo()
  state.user = { ...res.data }

  listeners.forEach((l) => l())
  if (login_redirect && config.needAuthMobile && !state.user.mobile) {
    return await toLogin()
  }
}
const subscribe = (fn: Listener) => {
  listeners.push(fn)
  return () => {
    const index = listeners.indexOf(fn)
    if (index > -1) listeners.splice(index, 1)
  }
}

const logout = async () => {
  const res = await api.user.logout()
  state.accessToken = ''
  state.user = defaultUser as LoginOutput
  wx.reLaunch({
    url: config.pages.index
  })
}

const commonSrevice = {

}

const toLogin = () => {
  let page = getCurrentPageUrlWithArgs() || config.pages.index;
  if (!page.startsWith('/')) {
    page = `/${page}`;
  }
  wx.setStorageSync('login_redirect', page)
  wx.reLaunch({
    url: config.pages.login
  })
}


export default {
  state,
  toLogin,
  login: login,
  updateUserStore: updateUserStore,
  refreshData,
  subscribe,
  logout,
  commonSrevice,
}