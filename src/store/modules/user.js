import { login, logout, getInfo } from '../../api/login'
import { getToken, setToken, removeToken } from '../../utils/auth'
/*import { getMenu, getSecondMenus } from '../../api/menu.js'*/

const user = {
		 state: {
		    token: getToken(),
		    name: '',
		    avatar: '',
		    roles: []
		  },

		mutations: {
			SET_TOKEN: (state, token) => {
		      state.token = token
		    },
		    SET_NAME: (state, name) => {
		      state.name = name
		    },
		    SET_AVATAR: (state, avatar) => {
		      state.avatar = avatar
		    },
		    SET_ROLES: (state, roles) => {
		      state.roles = roles
		    }
		},

		actions: {
			//login
			Login({ commit }, userInfo) {
		      /*const username = userInfo.username.trim();
		      const password = userInfo.password.trim();
		      const loginCode = userInfo.loginCode.trim();*/
		      return new Promise((resolve, reject) => {
		        login(userInfo).then(response => {
		          //存储TOKEN
		          setToken(response.result)
		          commit('SET_TOKEN', response.result)
		          resolve()
		        }).catch(error => {
		          reject(error)
		        })
		      })
		    },
				
			// 获取用户信息
		    GetInfo({ commit, state }) {
		      return new Promise((resolve, reject) => {
		        getInfo().then(response => {
		          const data = response
		          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
		            commit('SET_ROLES', data.roles)
		          } else {
		            reject('getInfo: roles must be a non-null array !')
		          }
		          commit('SET_NAME', data.name)
		          commit('SET_AVATAR', data.avatar)
		          resolve(response)
		        }).catch(error => {
		          reject(error)
		        })
		      })
		    },

			// 登出          
			LogOut({ commit, state }) {
		      return new Promise((resolve, reject) => {
		        logout().then(() => {
		        	debugger
		          commit('SET_TOKEN', '')
		          commit('SET_ROLES', [])
		          removeToken()
		          resolve()
		        }).catch(error => {
		          reject(error)
		        })
		      })
		    },

			// 前端 登出 
          	FedLogOut({ commit }) {
		      return new Promise(resolve => {
		        commit('SET_TOKEN', '')
		        removeToken()
		        resolve()
		      })
		    },

		    // 动态修改权限
		    ChangeRoles({ commit }, role) {
		      return new Promise(resolve => {
		        commit('SET_TOKEN', role)
		        setToken(role)
		        getInfo(role).then(response => {
		          const data = response
		          commit('SET_ROLES', data.roles)
		          commit('SET_NAME', data.name)
		          commit('SET_AVATAR', data.avatar)
		          resolve()
		        })
		      })
		    }


		}
}

export default user