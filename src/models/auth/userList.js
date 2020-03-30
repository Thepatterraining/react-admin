import {getUsers, deleteUser, createUser, saveUser} from '@/services/auth/users'

export default {
  namespace: 'userList',
  state: {
    userList:{
      data: [],
      page: {},
    }
  },
  effects: {
    *getUserList({params},{call, put}) {
      // console.log(params)
      const res = yield call(getUsers, params);

      // console.log(res)
      yield put({
        type: 'get_user_list',
        payload: res
      })
    },
    *delete({params, callback},{call}) {
      const res = yield call(deleteUser, params);
      if (res !== false) {
        callback()
      }

    },
    *create({params, callback },{call}) {
      const res = yield call(createUser, params);
      if (res !== false) {
        callback()
      }
    },
    *save({id ,params, callback },{call}) {
      const res = yield call(saveUser, id, params);
      if (res !== false) {
        callback()
      }
    }
  },
  reducers: {
    get_user_list(state, action) {
        return  {
          ...state,
          userList:{...state.userList,...action.payload},
        }
    }
  },
};
