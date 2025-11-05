import request from '/@/utils/request'

const GameEngine = "http://127.0.0.1:9800"

// 新增游戏
export function addTGame(data:object) {
  return request({
    url: GameEngine+'/api/v1/games',
    method: 'post',
    data: data
  })
}

// 删除游戏
export function delTGame(id:string) {
  return request({
    url: GameEngine+'/api/v1/games/'+id,
    method: 'delete',
  })
}

// 修改游戏
/*
{
  "id": "a73d7564-97e0-45d1-b4e6-81b3dbf84e04",
  "name": "1",
  "distribute_type": "APK",
  "developer": "1",
  "publisher": "1",
  "description": "1",
  "details": "1",
  "category": "动作枪战c",
  "tags": [
      "单机"
  ],
  "status": "初始状态",
  "create_time": "2006-01-02 15:04:05",
  "update_time": "2006-01-02 15:04:05",
  "icon_file": {
      "file_id": "b621996a-1def-4b05-bd05-0fc3b7d5ff0c",
  },
  "feature_images": [
      {
          "file_id": "82fa5d51-9ff2-4c74-a2c1-e32bfddf6bce",
      },
      {
          "file_id": "a1e29179-dec9-48b8-aacd-6dfa8cec183b",
      }
  ],
  "video_file": {
      "file_id": "231d3789-aaf9-49dc-b5f7-c434c58475ba",
  },
  "apk_file": {
      "file_id": "d26cb9d6-fc3f-4e35-a10d-1b57c949f423",
  },
  "h5_link": ""
}
}
*/
export function updateTGame(id:string,data:object) {
  return request({
    url: GameEngine+'/api/v1/games/'+id,
    method: 'put',
    data: data
  })
}

// 查询游戏详细
export function getTGame(id:string) {
  return request({
    url: GameEngine + '/api/v1/games/' + id,
    method: 'get',
  })
}

// 查询游戏列表
/*
{
    "code": 0,
    "message": "OK",
    "data": {
        "list": [
            {
                "id": "a73d7564-97e0-45d1-b4e6-81b3dbf84e04",
                "name": "1",
                "distribute_type": "APK",
                "developer": "1",
                "publisher": "1",
                "description": "1",
                "details": "1",
                "category": "动作枪战c",
                "tags": [
                    "单机"
                ],
                "status": "初始状态",
                "create_time": "2006-01-02 15:04:05",
                "update_time": "2006-01-02 15:04:05",
                "icon_file": {
                    "file_id": "b621996a-1def-4b05-bd05-0fc3b7d5ff0c",
                    "file_link": "http://47.109.79.103:7001/public-bucket/icon_20251110112517_59504cb4.jpg"
                },
                "feature_images": [
                    {
                        "file_id": "82fa5d51-9ff2-4c74-a2c1-e32bfddf6bce",
                        "file_link": "http://47.109.79.103:7001/public-bucket/hero1_20251110112520_8cb1a896.jpeg"
                    },
                    {
                        "file_id": "a1e29179-dec9-48b8-aacd-6dfa8cec183b",
                        "file_link": "http://47.109.79.103:7001/public-bucket/hero2_20251110112525_b161c1cf.jpeg"
                    }
                ],
                "video_file": {
                    "file_id": "231d3789-aaf9-49dc-b5f7-c434c58475ba",
                    "file_link": "http://47.109.79.103:7001/public-bucket/honor_20251110112528_6f6efe3a.mp4"
                },
                "apk_file": {
                    "file_id": "d26cb9d6-fc3f-4e35-a10d-1b57c949f423",
                    "file_link": "http://47.109.79.103:7001/public-bucket/honor_20251110112533_76f2bad8.apk"
                },
                "h5_link": ""
            }
        ],
        "total": 1,
        "current_page": 1
    }
}
*/
export function listTGame(query:object) {
  return request({
    url: GameEngine+'/api/v1/games',
    method: 'get',
    params: query
  })
}

/*
{
    "code": 0,
    "message": "OK",
    "data": {
        "list": [
            {
                "id": 16,
                "name": "王者荣耀",
                "distribute_type": "APK",
                "category": {
                    "id": 2,
                    "name": "动作枪战",
                    "create_time": "2025-08-27 17:37:57",
                    "update_time": "2025-08-27 17:37:57"
                },
                "tags": [
                    {
                        "id": 3,
                        "name": "氪金",
                        "create_time": "2025-08-27 17:37:57",
                        "update_time": "2025-08-27 17:37:57"
                    }
                ],
                "developer": "天美",
                "publisher": "天美",
                "description": "测试游戏基本信设置、媒体文件上传",
                "details": "MOBA游戏，激情对战",
                "status": "审核中",
                "publish_time": null,
                "reserve_count": 0,
                "average_rating": 0,
                "rating_score": 0,
                "rating_count": 0,
                "favorite_count": 0,
                "download_count": 0,
                "create_time": "2025-10-13 16:26:29",
                "update_time": "2025-10-15 10:37:27",
                "media_infos": [
                    {
                        "id": 6,
                        "file_id": "b7b54718-3490-496d-b74e-082586cccc50",
                        "media_type": 1,
                        "media_url": "http://47.109.79.103:7001/public-bucket/honor_20251013162906_62c08be2.jpg",
                        "status": 2
                    },
                    {
                        "id": 7,
                        "file_id": "acc0fcf1-c485-442a-9ffd-7d7b96fe6542",
                        "media_type": 2,
                        "media_url": "http://47.109.79.103:7001/public-bucket/hero1_20251013163343_9cda1e4f.jpeg",
                        "status": 2
                    },
                    {
                        "id": 8,
                        "file_id": "ce1063dc-0d21-42fc-8201-846919aa79fa",
                        "media_type": 2,
                        "media_url": "http://47.109.79.103:7001/public-bucket/hero2_20251013163931_8fa60f38.jpeg",
                        "status": 2
                    },
                    {
                        "id": 9,
                        "file_id": "e4b341b1-a573-4b5c-9ba1-9d3dcd519d23",
                        "media_type": 3,
                        "media_url": "http://47.109.79.103:7001/public-bucket/honor_20251013165037_ddf8f670.mp4",
                        "status": 2
                    },
                    {
                        "id": 10,
                        "file_id": "1e0153b4-dc8e-4aab-bcce-8072cd42feac",
                        "media_type": 4,
                        "media_url": "http://47.109.79.103:7001/private-bucket/10040714_com.tencent.tmgp.sgame_a3950068_11.1.1.15_QXbwFp_20251015102613_80dc7888.apk",
                        "status": 1
                    }
                ],
                "is_favorite": false,
                "is_reserve": false
            }
        ],
        "total": 1,
        "current_page": 1
    }
}
*/
/*
游戏状态列表
初始状态
审核中
审核通过
可预约
已上架
已下架
*/
export function submitForReview(id:string) {
  return request({
    url: GameEngine + `/api/v1/games/${id}/submit-for-review`,
    method: 'post',
  })
}

// 获取待审核游戏列表
export function getReviewList(query?: object) {
  return request({
    url: GameEngine + '/api/v1/games/in-review',
    method: 'get',
    params: query
  })
}

// 审核通过
export function approveGame(id: string, data: object) {
  return request({
    url: GameEngine + `/api/v1/games/${id}/approve`,
    method: 'post',
    data: data
  })
}

// 审核拒绝
export function rejectGame(id: string, data: object) {
  return request({
    url: GameEngine + `/api/v1/games/${id}/reject`,
    method: 'post',
    data: data
  })
}
