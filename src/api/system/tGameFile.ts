// 导入统一的请求工具（用于发送HTTP请求）
import request from '/@/utils/request'

// 游戏引擎后端服务地址（本地开发环境）
const GameEngine = "http://127.0.0.1:9800"

// 文件上传逻辑
// 1. 获取文件上传URL
// 2. PATCH 上传文件
// 3. 报告文件上传结果

/**
 * 新增文件
 * @param data 文件数据对象，包含 name（文件名称）等字段
 * @returns Promise 返回添加成功后的响应数据
 * 
 * 使用示例：
 * addFile({ name: "游戏文件1" })
 */

/*
req body:
{
  "file_size": 0,
  "file_name": "string",
  "content_type": "string"
}

res body:
{
  "file_id": "string",
  "original_name": "string",
  "upload_url": "string"
}
*/
export function addGameFile(data:object) {
    return request({
      url: GameEngine+'/api/v1/files',  // POST请求地址
      method: 'post',  // HTTP方法：POST（新增数据）
      data: data  // 请求体数据
    })
}

/*
req body:
{
"success": true
}
res body:
{}
*/
export function reportFileUploadResult(file_id:string,success:boolean) {
    return request({
      url: GameEngine+'/api/v1/files/'+file_id+'/report-upload-result',
      method: 'patch',
      data: {
        "success": success
      }  // 请求体数据
    })
}

