import { getRoles, deleteRole, createRole, saveRole } from '@/services/auth/roleService'

export default {
  namespace: 'roleModel',
  state: {
    roleList:{
      data: [],
      page: {},
    }
  },
  effects: {
    *getRoleList({params},{call, put}) {
      // console.log(params)
      const res = yield call(getRoles, params);

      // console.log(res)
      yield put({
        type: 'get_role_list',
        payload: res
      })
    },
    *delete({params, callback},{call}) {
      const res = yield call(deleteRole, params);
      if (res !== false) {
        callback()
      }

    },
    *create({params, callback },{call}) {
      const res = yield call(createRole, params);
      if (res !== false) {
        callback()
      }
    },
    *save({id ,params, callback },{call}) {
      const res = yield call(saveRole, id, params);
      if (res !== false) {
        callback()
      }
    }
  },
  reducers: {
    get_role_list(state, action) {
        return  {
          ...state,
          roleList:{...state.roleList,...action.payload},
        }
    }
  },
};
