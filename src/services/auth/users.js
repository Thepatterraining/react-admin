import request from '@/utils/request';

export async function getUsers(params) {
  return request('/api/users', {
    method:'get',
    params: params
  });
}

export async function deleteUser(id) {
  return request(`/api/user/${id}`, {
    method:'delete',
  });
}

export async function createUser(params) {
  return request('/api/user', {
    method:'post',
    data: params,
  });
}

export async function saveUser(id, params) {
  return request(`/api/user/${id}`, {
    method:'put',
    data: params,
  });
}
