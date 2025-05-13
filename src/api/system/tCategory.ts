import request from '/@/utils/request'

const GameEngine = "http://127.0.0.1:9800"

// 新增分类表
export function addTCategory(data:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/categories',
    method: 'post',
    data: data
  })
}

// 删除分类表
export function delTCategory(id:number) {
  return request({
    url: GameEngine+'/api/v1/game-engine/categories/'+id,
    method: 'delete',
  })
}

// 修改分类表
export function updateTCategory(id:number,data:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/categories/'+id,
    method: 'put',
    data: data
  })
}

// 查询分类表列表
/*
res body:
{
    "code": 0,
    "message": "OK",
    "data": {
        "list": [
            {
                "id": 1,
                "name": "战争策略",
                "create_time": "2025-08-15 18:04:05",
                "update_time": "2025-08-15 18:04:05"
            },
            {
                "id": 2,
                "name": "角色扮演",
                "create_time": "2025-08-15 18:04:05",
                "update_time": "2025-08-15 18:04:05"
            },
            {
                "id": 3,
                "name": "休闲益智",
                "create_time": "2025-08-15 18:04:05",
                "update_time": "2025-08-15 18:04:05"
            },
            {
                "id": 4,
                "name": "动作冒险",
                "create_time": "2025-08-15 18:04:05",
                "update_time": "2025-08-15 18:04:05"
            }
        ]
    }
}
 */
export function listTCategory(query:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/categories',
    method: 'get',
    params: query
  })
}

// 查询分类表详细
export function getTCategory(id:number) {
  return request({
    url: GameEngine+'/api/v1/game-engine/categories/'+id,
    method: 'get',
    params: {
      id: id.toString()
    }
  })
}