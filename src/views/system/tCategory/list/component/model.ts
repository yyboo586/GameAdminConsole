/**
 * 游戏分类表格列数据接口
 * 用途：定义从后端API获取的分类数据的结构
 * 所有字段都是必填的（从后端返回的完整数据）
 */
export interface TCategoryTableColumns {    
    id:number;  // 主键ID（唯一标识）    
    name:string;  // 分类名称（如：战争策略、角色扮演）    
    create_time:string;  // 创建时间（格式：2025-08-15 18:04:05）    
    update_time:string;  // 更新时间（格式：2025-08-15 18:04:05）    
}

/**
 * 游戏分类信息数据接口
 * 用途：用于新增/编辑表单的数据结构
 * 所有字段都可以是undefined（表单初始状态或部分填写状态）
 */
export interface CategoryInfo {    
    id:number|undefined;        // 主键ID（新增时为undefined，编辑时有值）    
    name:string|undefined; // 分类名称（用户输入的分类名）    
    create_time:string|undefined; // 创建时间（系统自动生成）    
    update_time:string|undefined; // 更新时间（系统自动更新）    
}

/**
 * 游戏分类列表页面状态接口
 * 用途：管理整个列表页面的数据状态（表格数据、分页、搜索条件等）
 */
export interface CategoryListState {
    ids:any[];  // 选中的行ID数组（用于批量删除、批量编辑等操作）
    tableData: {
        data: Array<TCategoryTableColumns>;  // 表格显示的数据列表
        total: number;  // 数据总条数（用于分页）
        loading: boolean;  // 加载状态（显示加载动画）
        param: {  // 查询参数（用于搜索和分页）
            page_num: number;  // 当前页码（第几页）            
            page_size: number;  // 每页显示条数                   
            name: string|undefined;  // 搜索条件：分类名                   
        };
    };
}

/**
 * 游戏分类编辑对话框状态接口
 * 用途：管理新增/编辑对话框的状态
 */
export interface CategoryEditState{
    loading:boolean;  // 提交状态（防止重复提交）
    isShowDialog: boolean;  // 对话框显示状态（true=显示，false=隐藏）
    formData:CategoryInfo;  // 表单数据（用户输入的数据）
    rules: object;  // 表单验证规则（如：必填项、格式验证等）
}