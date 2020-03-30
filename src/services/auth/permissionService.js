import request from '@/utils/request';

export async function getPermissions(params) {
  return request('/api/permissions', {
    method:'get',
    params: params
  });
}

export async function deletePermission(id) {
  return request(`/api/permission/${id}`, {
    method:'delete',
  });
}

export async function createPermission(params) {
  return request('/api/permission', {
    method:'post',
    data: params,
  });
}

export async function savePermission(id, params) {
  return request(`/api/permission/${id}`, {
    method:'put',
    data: params,
  });
}

export async function getPermissionTree(params) {
  return request('/api/permission/tree', {
    method:'get',
    params:params
  })
}
