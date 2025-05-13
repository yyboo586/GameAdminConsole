import request from '/@/utils/request'

const GameEngine = "http://127.0.0.1:9800"

// 新增游戏
export function addTGame(data:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/games',
    method: 'post',
    data: data
  })
}

// 删除游戏
export function delTGame(ids:number[]) {
  return request({
    url: GameEngine+'/api/v1/game-engine/games',
    method: 'delete',
    data:{
      ids:ids
    }
  })
}

// 修改游戏
export function updateTGame(id:number,data:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/games/'+id,
    method: 'put',
    data: data
  })
}

// 查询游戏详细
export function getTGame(id:number) {
  return request({
    url: GameEngine + '/api/v1/game-engine/games/' + id,
    method: 'get',
    params: {
      id: id.toString()
    }
  })
}

// 查询游戏列表
/*
res body:
{
    "code": 0,
    "message": "OK",
    "data": {
        "list": [
            {
                "id": 8,
                "name": "测试游戏2",
                "distribute_type": 1,
                "category": {
                    "id": 3,
                    "name": "休闲益智",
                    "create_time": "2025-08-15 18:04:05",
                    "update_time": "2025-08-15 18:04:05"
                },
                "tags": [
                    {
                        "id": 5,
                        "name": "免费",
                        "create_time": "2025-08-19 11:54:39",
                        "update_time": "2025-08-19 11:54:39"
                    }
                ],
                "developer": "测试开发商2",
                "publisher": "测试发行商2",
                "description": "测试描述",
                "details": "测试详情",
                "media_infos": null,
                "average_rating": 0,
                "create_time": "2025-08-20 13:39:52",
                "update_time": "2025-08-20 13:39:52"
            },
            {
                "id": 7,
                "name": "测试游戏1",
                "distribute_type": 1,
                "category": {
                    "id": 3,
                    "name": "休闲益智",
                    "create_time": "2025-08-15 18:04:05",
                    "update_time": "2025-08-15 18:04:05"
                },
                "tags": [
                    {
                        "id": 1,
                        "name": "单机d",
                        "create_time": "2025-08-15 18:04:09",
                        "update_time": "2025-08-19 11:56:57"
                    },
                    {
                        "id": 5,
                        "name": "免费",
                        "create_time": "2025-08-19 11:54:39",
                        "update_time": "2025-08-19 11:54:39"
                    }
                ],
                "developer": "测试开发商1",
                "publisher": "测试发行商1",
                "description": "测试描述",
                "details": "测试详情",
                "media_infos": [
                    {
                        "id": 12,
                        "file_id": "93272ed5-c394-442c-94ba-fcf96e4d2e49",
                        "media_type": 1,
                        "media_url": "http://124.220.236.38:7001/icons/binghongcha_20250820134009_a1bf5539.jpg",
                        "status": 2
                    },
                    {
                        "id": 13,
                        "file_id": "2e1e1c3f-c2ce-4b1a-9556-f62e0590cd62",
                        "media_type": 3,
                        "media_url": "http://124.220.236.38:7001/icons/276047_small_20250820134030_02bc4619.mp4",
                        "status": 2
                    },
                    {
                        "id": 14,
                        "file_id": "fae32913-57b9-42c4-8121-29b556a00f57",
                        "media_type": 4,
                        "media_url": "http://124.220.236.38:7001/file-engine/4399cszc_20250820134152_c7c2a4f5.exe",
                        "status": 2
                    }
                ],
                "average_rating": 0,
                "create_time": "2025-08-20 13:39:34",
                "update_time": "2025-08-20 13:39:34"
            }
        ],
        "total": 0,
        "current_page": 1
    }
}
*/
export function listTGame(query:object) {
  return request({
    url: GameEngine+'/api/v1/game-engine/games',
    method: 'get',
    params: query
  })
}
/*
req body:
{
    "type": 1,
    "file_name": "test.jpg",
    "file_size": 1024,
    "content_type": "image/jpeg"
} 
res body:
{
    "code": 0,
    "message": "OK",
    "data": {
        "id": "4abd5001-c6f8-4c25-9848-c33e360f7822",
        "original_name": "binghongcha.jpg",
        "visit_url": "http://124.220.236.38:7001/icons/binghongcha_20250819155817_48e53e2b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin/20250819/us-east-1/s3/aws4_request&X-Amz-Date=20250819T075817Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=ba00e4c726c0b3f442996f24965d81c08fe2d4ad0907949163b1e7c0a07aa3d7",
        "upload_url": "http://124.220.236.38:7001/icons/binghongcha_20250819155817_48e53e2b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=admin/20250819/us-east-1/s3/aws4_request&X-Amz-Date=20250819T075817Z&X-Amz-Expires=1800&X-Amz-SignedHeaders=host&X-Amz-Signature=ba00e4c726c0b3f442996f24965d81c08fe2d4ad0907949163b1e7c0a07aa3d7"
    }
}
*/
export function uploadTGameMediaInfo(id:number,data:object) {
  return request({
    url: GameEngine + '/api/v1/game-engine/games/' + id + '/media-info/upload',
    method: 'post',
    data: data
  })
}

/*
req body:
{
    "success": true,
}
*/ 
// 上报文件上传结果
export function reportTGameMediaUploadResult(fileID:string,data:object) {
  return request({
    url: GameEngine + '/api/v1/game-engine/games/media-info/'+fileID+'/upload-result',
    method: 'post',
    data: data
  })
}

export function saveTGameMediaInfo(gameID:number,data:object) {
  return request({
    url: GameEngine + '/api/v1/game-engine/games/' + gameID + '/media-info/save',
    method: 'post',
    data: data
  })
}

