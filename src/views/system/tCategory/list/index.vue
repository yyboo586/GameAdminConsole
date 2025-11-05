<template>
  <div class="system-tCategory-container">
    <el-card shadow="hover">
        <div class="system-tCategory-search mb15">
            <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
            <el-row>                          
                <el-col :span="8" class="colBlock">
                  <el-form-item label="分类名" prop="name">
                    <el-input
                        v-model="tableData.param.name"
                        placeholder="请输入分类名"
                        clearable                        
                        @keyup.enter.native="tCategoryList"
                    />                    
                  </el-form-item>
                </el-col>                
                <el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
                  <el-form-item>
                    <el-button type="primary"  @click="tCategoryList"><el-icon><ele-Search /></el-icon>搜索</el-button>
                    <el-button  @click="resetQuery(queryRef)"><el-icon><ele-Refresh /></el-icon>重置</el-button>
                  </el-form-item>
                </el-col>                         
              </el-row>
            </el-form>
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  @click="handleAdd"
                  v-auth="'api/v1/system/tCategory/add'"
                ><el-icon><ele-Plus /></el-icon>新增</el-button>
              </el-col>       
            </el-row>
        </div>
        <el-table v-loading="loading" :data="tableData.data" >      
          <el-table-column label="ID" align="center" prop="id"
            min-width="150px"            
             />          
          <el-table-column label="分类名" align="center" prop="name"
            min-width="150px"            
             />          
          <el-table-column label="创建时间" align="center" prop="create_time"
            min-width="150px"            
            >
          </el-table-column>          
          <el-table-column label="更新时间" align="center" prop="update_time"
            min-width="150px"            
            >
          </el-table-column>        
          <el-table-column label="操作" align="center" class-name="small-padding" min-width="160px" fixed="right">
            <template #default="scope">            
              <el-button
                type="primary"
                link
                @click="handleUpdate(scope.row)"
                v-auth="'api/v1/system/tCategory/edit'"
              ><el-icon><ele-EditPen /></el-icon>修改</el-button>
              <el-button
                type="primary"
                link
                @click="handleDelete(scope.row)"
                v-auth="'api/v1/system/tCategory/delete'"
              ><el-icon><ele-DeleteFilled /></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="tableData.total>0"
            :total="tableData.total"
            v-model:page="tableData.param.page_num"
            v-model:limit="tableData.param.page_size"
            @pagination="tCategoryList"
        />
    </el-card>
    <ApiV1SystemTCategoryEdit
       ref="editRef"       
       @tCategoryList="tCategoryList"
    ></ApiV1SystemTCategoryEdit>
    <ApiV1SystemTCategoryDetail
      ref="detailRef"      
      @tCategoryList="tCategoryList"
    ></ApiV1SystemTCategoryDetail>    
  </div>
</template>
<script setup lang="ts">
// ========== 导入依赖 ==========
// Vue核心函数
import {toRefs, reactive, onMounted, ref, toRaw} from 'vue';
// ElementPlus UI组件
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus';
// API接口函数（与后端交互）
import {
    listTCategory,      // 获取分类列表
    delTCategory,       // 删除分类
} from "/@/api/system/tCategory";
// TypeScript类型定义
import {
    TCategoryTableColumns,      // 表格列数据类型
    CategoryInfo,          // 分类信息数据类型
    CategoryListState,    // 页面状态数据类型
} from "/@/views/system/tCategory/list/component/model"
// 子组件：编辑对话框
import ApiV1SystemTCategoryEdit from "/@/views/system/tCategory/list/component/edit.vue"
// 子组件：详情抽屉
import ApiV1SystemTCategoryDetail from "/@/views/system/tCategory/list/component/detail.vue"

// 定义组件名称（用于调试和keep-alive缓存）
defineOptions({ name: "apiV1SystemTCategoryList"})

// ========== 获取Vue实例和定义响应式变量 ==========
// ref 引用机制
// const editRef = ref(); 获取子组件引用
// editRef.value.openDialog(row); 调用子组件的方法
const loading = ref(false)  // 表格加载状态
const queryRef = ref()  // 搜索表单引用（用于重置表单）
const editRef = ref();  // 编辑对话框组件引用（重要！用于调用子组件的方法）
const detailRef = ref();  // 详情抽屉组件引用
// 是否显示所有搜索选项（展开/收起搜索区域）
const showAll =  ref(false)
// 非单个禁用（当选中不是1行时，禁用"修改"按钮）
const single = ref(true)
// 非多个禁用（当没有选中行时，禁用"删除"按钮）
const multiple =ref(true)
// ========== 定义页面状态数据 ==========
const state = reactive<CategoryListState>({
    ids:[],  // 选中的行ID数组（多选框选中的数据）
    tableData: {
        data: [],  // 表格数据（从后端获取的分类列表）
        total: 0,  // 总数据条数（用于分页组件）
        loading: false,  // 加载状态
        param: {  // 查询参数（发送给后端的搜索条件）
            page_num: 1,  // 当前页码
            page_size: 10,  // 每页显示10条            
            name: undefined,  // 搜索条件：分类名            
        },
    },
});
// 解构state（使tableData具有响应式）
const { tableData } = toRefs(state);

// ========== 生命周期钩子 ==========
// 页面加载时自动执行
onMounted(() => {
    initTableData();  // 初始化表格数据
});

// ========== 核心功能函数 ==========
/**
 * 初始化表格数据
 * 页面首次加载时调用
 */
const initTableData = () => {    
    tCategoryList()  // 调用获取列表接口
};

/**
 * 重置搜索条件
 * 点击"重置"按钮时触发
 */
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()  // 清空表单所有字段
    tCategoryList()  // 重新查询列表（使用默认条件）
};

/**
 * 获取分类列表数据（核心方法）
 * 调用后端API获取数据并更新表格
 */
const tCategoryList = ()=>{
  loading.value = true  // 显示加载动画
  // 调用API接口，传入查询参数
  listTCategory(state.tableData.param).then((res:any)=>{
    let list = res.data.list??[];  // 获取数据列表（如果没有则为空数组）
    state.tableData.data = list;  // 更新表格数据
    state.tableData.total = res.data.total;  // 更新总条数
    loading.value = false  // 隐藏加载动画
  })
};

/**
 * 新增分类按钮点击事件
 * 
 * 数据传递流程：
 * 1. 调用子组件editRef的openDialog方法
 * 2. 不传参数表示是新增操作
 */
const handleAdd =  ()=>{
    editRef.value.openDialog()  // 打开编辑对话框（新增模式）
}

/**
 * 修改分类按钮点击事件（核心数据传递方法！）
 * @param row 当前行数据（如果从行操作点击则有值，从顶部按钮点击则为null）
 * 
 * 数据传递流程详解：
 * 1. 如果row为null（从顶部"修改"按钮点击）
 *    - 从表格数据中查找第一个选中的行（state.ids[0]）
 * 2. 调用 editRef.value.openDialog(row)
 *    - editRef是子组件edit.vue的引用
 *    - openDialog是子组件暴露的方法（通过defineExpose）
 *    - toRaw(row)将响应式对象转为普通对象传递
 * 3. 子组件接收到row后：
 *    - 调用getTCategory(row.id)从后端重新获取完整数据
 *    - 填充到表单中供用户编辑
 */
const handleUpdate = (row: TCategoryTableColumns|null) => {
    if(!row){
        // 从表格数据中查找选中的行
        row = state.tableData.data.find((item:TCategoryTableColumns)=>{
            return item.id ===state.ids[0]  // 匹配选中的第一个ID
        }) as TCategoryTableColumns
    }
    // 【关键步骤】调用子组件的openDialog方法，传递行数据
    editRef.value.openDialog(toRaw(row));
};

/**
 * 删除分类按钮点击事件
 * @param row 当前行数据（如果从行操作点击则有值，从顶部按钮点击则为null）
 */
const handleDelete = (row: TCategoryTableColumns|null) => {
    let msg = '你确定要删除所选数据？';
    let id:number = 0 ;
    if(row){
      msg = `此操作将永久删除数据，是否继续?`
      id = row.id  // 获取要删除的ID
    }
    // 弹出确认对话框
    ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            // 用户点击确认后，调用删除API
            delTCategory(id).then(()=>{
                ElMessage.success('删除成功');
                tCategoryList();  // 刷新列表
            })
        })
        .catch(() => {});  // 用户点击取消，不做任何操作
}

</script>
<style lang="scss" scoped>
    .colBlock {
        display: block;
    }
    .colNone {
        display: none;
    }
    .ml-2{margin: 3px;}
</style>