import request from '@/utils/request';

export async function getRoles(params) {
  return request('/api/roles', {
    method:'get',
    params: params
  });
}

export async function deleteRole(id) {
  return request(`/api/role/${id}`, {
    method:'delete',
  });
}

export async function createRole(params) {
  return request('/api/role', {
    method:'post',
    data: params,
  });
}

export async function saveRole(id, params) {
  return request(`/api/role/${id}`, {
    method:'put',
    data: params,
  });
}
