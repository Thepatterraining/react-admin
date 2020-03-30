import { getPermissions, deletePermission, createPermission, savePermission, getPermissionTree } from '@/services/auth/permissionService'

export default {
  namespace: 'permissionModel',
  state: {
    permissionList:{
      data: [],
      page: {},
    },
    permissionTrees:[]
  },
  effects: {
    *getPermissionList({params},{call, put}) {
      // console.log(params)
      const res = yield call(getPermissions, params);

      // console.log(res)
      yield put({
        type: 'get_list',
        payload: res
      })
    },
    *delete({params, callback},{call}) {
      const res = yield call(deletePermission, params);
      if (res !== false) {
        callback()
      }

    },
    *create({params, callback },{call}) {
      const res = yield call(createPermission, params);
      if (res !== false) {
        callback()
      }
    },
    *save({id ,params, callback },{call}) {
      const res = yield call(savePermission, id, params);
      if (res !== false) {
        callback()
      }
    },
    *getTree({params},{call, put}) {
      const res = yield call(getPermissionTree, params);
      yield put({
        type: 'get_tree_list',
        payload: res
      })
    }
  },
  reducers: {
    get_list(state, action) {
        return  {
          ...state,
          permissionList:{...state.permissionList,...action.payload},
        }
    },
    get_tree_list(state, action) {
      return  {
        ...state,
        permissionTrees:action.payload,
      }
  }
  },
};
