import request from '/@/utils/request'

const GameEngine = "http://127.0.0.1:9800"

// 新增标签表
export function addTTag(data:object) {
  return request({
    url: GameEngine+'/api/v1/tags',
    method: 'post',
    data: data
  })
}

// 删除标签表
export function delTTag(id:number) {
  return request({
    url: GameEngine+'/api/v1/tags/'+id,
    method: 'delete',
  })
}

// 修改标签表
export function updateTTag(id:number,data:object) {
  return request({
    url: GameEngine+'/api/v1/tags/'+id,
    method: 'put',
    data: data
  })
}

// 查询标签表详细
export function getTTag(id:number) {
  return request({
    url: GameEngine+'/api/v1/tags/'+id,
    method: 'get',
    params: {
      id: id.toString()
    }
  })
}

// 查询标签表列表
/*
res body:
{
    "code": 0,
    "message": "OK",
    "data": {
        "list": [
            {
                "id": 5,
                "name": "免费",
                "create_time": "2025-08-19 11:54:39",
                "update_time": "2025-08-19 11:54:39"
            },
            {
                "id": 1,
                "name": "单机d",
                "create_time": "2025-08-15 18:04:09",
                "update_time": "2025-08-19 11:56:57"
            },
            {
                "id": 2,
                "name": "氪金",
                "create_time": "2025-08-15 18:04:09",
                "update_time": "2025-08-15 18:04:09"
            }
        ]
    }
}
*/
export function listTTag(query:object) {
  return request({
    url: GameEngine+'/api/v1/tags',
    method: 'get',
    params: query
  })
}