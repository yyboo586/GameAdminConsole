// 导入统一的请求工具（用于发送HTTP请求）
import request from '/@/utils/request'

// 游戏引擎后端服务地址（本地开发环境）
const GameEngine = "http://127.0.0.1:9800"

/**
 * 新增游戏分类
 * @param data 分类数据对象，包含 name（分类名称）等字段
 * @returns Promise 返回添加成功后的响应数据
 * 
 * 使用示例：
 * addTCategory({ name: "射击游戏" })
 */
export function addTCategory(data:object) {
  return request({
    url: GameEngine+'/api/v1/categories',  // POST请求地址
    method: 'post',  // HTTP方法：POST（新增数据）
    data: data  // 请求体数据
  })
}

/**
 * 删除游戏分类
 * @param id 要删除的分类ID
 * @returns Promise 返回删除结果
 * 
 * 使用示例：
 * delTCategory(5)  // 删除ID为5的分类
 */
export function delTCategory(id:number) {
  return request({
    url: GameEngine+'/api/v1/categories/'+id,  // DELETE请求地址（ID拼接在URL中）
    method: 'delete',  // HTTP方法：DELETE（删除数据）
  })
}

/**
 * 修改游戏分类
 * @param id 要修改的分类ID
 * @param data 更新的数据对象，包含要修改的字段
 * @returns Promise 返回修改成功后的响应数据
 * 
 * 使用示例：
 * updateTCategory(5, { name: "动作射击" })  // 修改ID为5的分类名称
 */
export function updateTCategory(id:number,data:object) {
  return request({
    url: GameEngine+'/api/v1/categories/'+id,  // PUT请求地址（ID拼接在URL中）
    method: 'put',  // HTTP方法：PUT（更新数据）
    data: data  // 请求体数据
  })
}

/**
 * 查询游戏分类列表（带分页和搜索）
 * @param query 查询参数对象，包含：
 *   - page_num: 页码
 *   - page_size: 每页条数
 *   - name: 分类名（模糊搜索）
 * @returns Promise 返回分类列表数据
 * 
 * 使用示例：
 * listTCategory({ page_num: 1, page_size: 10, name: "策略" })
 * 
 * 返回数据格式示例：
 * {
 *   "code": 0,
 *   "message": "OK",
 *   "data": {
 *     "list": [
 *       {
 *         "id": 1,
 *         "name": "战争策略",
 *         "create_time": "2025-08-15 18:04:05",
 *         "update_time": "2025-08-15 18:04:05"
 *       },
 *       {
 *         "id": 2,
 *         "name": "角色扮演",
 *         "create_time": "2025-08-15 18:04:05",
 *         "update_time": "2025-08-15 18:04:05"
 *       }
 *     ],
 *     "total": 4  // 总条数
 *   }
 * }
 */
export function listTCategory(query:object) {
  return request({
    url: GameEngine+'/api/v1/categories',  // GET请求地址
    method: 'get',  // HTTP方法：GET（查询数据）
    params: query  // 查询参数（会拼接到URL后面，如：?page_num=1&page_size=10）
  })
}

/**
 * 查询单个游戏分类的详细信息
 * @param id 分类ID
 * @returns Promise 返回单个分类的完整数据
 * 
 * 使用示例：
 * getTCategory(1)  // 获取ID为1的分类详情
 */
export function getTCategory(id:number) {
  return request({
    url: GameEngine+'/api/v1/categories/'+id,  // GET请求地址（ID拼接在URL中）
    method: 'get',  // HTTP方法：GET（查询数据）
    params: {
      id: id.toString()  // 查询参数（虽然ID已在URL中，这里是额外传递）
    }
  })
}