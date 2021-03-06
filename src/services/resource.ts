/*
 * 资源相关请求模块
 */
import request from '@/utils/request'

export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data
  })
}

export const getResourceDetail = (id: number) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

export const createOrUpdateResource = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data
  })
}

export const deleteResouce = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
