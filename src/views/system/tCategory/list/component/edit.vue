<template>  
  <div class="system-tCategory-edit">
    <!-- 添加或修改分类表对话框 -->
    <el-dialog v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <template #header>
        <div v-drag="['.system-tCategory-edit .el-dialog', '.system-tCategory-edit .el-dialog__header']">{{(!formData.id || formData.id==0?'添加':'修改')+'游戏分类'}}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">        
        <el-form-item label="分类名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名" />
        </el-form-item>        
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit" :disabled="loading">确 定</el-button>
          <el-button @click="onCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
/**
 * 游戏分类编辑对话框组件
 * 功能：新增或修改游戏分类
 * 
 * 父组件调用方式：
 * - 新增：editRef.value.openDialog()
 * - 编辑：editRef.value.openDialog(row)
 */

// ========== 导入依赖 ==========
import { reactive, toRefs, ref,unref,getCurrentInstance,computed } from 'vue';
import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';
// API接口
import {
  listTCategory,
  getTCategory,      // 获取单个分类详情（用于编辑时回显数据）
  delTCategory,
  addTCategory,      // 新增分类
  updateTCategory,   // 更新分类
} from "/@/api/system/tCategory";
// TypeScript类型定义
import {
  TCategoryTableColumns,
  CategoryInfo,
  CategoryListState,
  CategoryEditState
} from "/@/views/system/tCategory/list/component/model"

// 定义组件名称
defineOptions({ name: "ApiV1SystemTCategoryEdit"})

// ========== 定义事件和实例 ==========
// 定义向父组件发送的事件（子组件→父组件通信）
const emit = defineEmits(['tCategoryList'])  // 提交成功后通知父组件刷新列表
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);  // 表单引用（用于验证）
const menuRef = ref();
// ========== 定义组件状态数据 ==========
const state = reactive<CategoryEditState>({
  loading:false,  // 提交中状态（防止重复提交）
  isShowDialog: false,  // 对话框显示状态
  formData: {    
    id: undefined,    // ID（新增时为undefined，编辑时有值）
    name: undefined,    // 分类名称
    create_time: undefined,    
    update_time: undefined,    
  },
  // 表单校验规则
  rules: {    
    id : [
        { required: true, message: "主键不能为空", trigger: "blur" }
    ],    
    name : [
        { required: true, message: "分类名不能为空", trigger: "blur" }
    ],    
  }
});
// 解构state使其具有响应式
const { loading,isShowDialog,formData,rules } = toRefs(state);

// ========== 核心方法：接收父组件传来的数据 ==========
/**
 * 打开对话框（由父组件调用）
 * @param row 可选参数，如果传入则是编辑模式，否则是新增模式
 * 
 * 数据接收流程详解：
 * 1. 父组件调用：editRef.value.openDialog(row)
 * 2. 本方法接收到row参数
 * 3. 如果row存在（编辑模式）：
 *    - 调用getTCategory(row.id)从后端获取完整数据
 *    - 将数据填充到state.formData（表单会自动显示）
 * 4. 如果row不存在（新增模式）：
 *    - formData保持为空，表单为空白状态
 * 5. 显示对话框
 */
const openDialog = (row?: CategoryInfo) => {
  resetForm();  // 先重置表单（清空上次的数据）
  if(row) {
    // 编辑模式：根据ID从后端获取完整数据
    getTCategory(row.id!).then((res:any)=>{
      const data = res.data;  // 后端返回的完整数据
      state.formData = data;  // 填充到表单（Vue会自动双向绑定到输入框）
  })
}
  state.isShowDialog = true;  // 显示对话框
};

/**
 * 关闭对话框
 */
const closeDialog = () => {
  state.isShowDialog = false;
};

// ========== 暴露方法给父组件 ==========
/**
 * defineExpose：将子组件的方法暴露给父组件
 * 父组件通过 ref 可以调用这些方法
 */
defineExpose({
  openDialog,  // 暴露openDialog方法
});

/**
 * 取消按钮点击事件
 */
const onCancel = () => {
  closeDialog();  // 关闭对话框
};
/**
 * 提交按钮点击事件
 * 
 * 流程：
 * 1. 验证表单（检查必填项）
 * 2. 根据formData.id判断是新增还是修改
 * 3. 调用对应的API接口
 * 4. 成功后通知父组件刷新列表
 */
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  // 表单验证
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;  // 显示提交中状态
      if(!state.formData.id || state.formData.id===0){
        // === 新增模式 ===
      addTCategory(state.formData).then(()=>{
          ElMessage.success('添加成功');
          closeDialog(); // 关闭弹窗
          emit('tCategoryList')  // 【关键】通知父组件刷新列表
        }).finally(()=>{
          state.loading = false;  // 恢复按钮状态
        })
      }else{
        // === 修改模式 ===
      updateTCategory(state.formData.id!,state.formData).then(()=>{
          ElMessage.success('修改成功');
          closeDialog(); // 关闭弹窗
          emit('tCategoryList')  // 【关键】通知父组件刷新列表
        }).finally(()=>{
          state.loading = false;  // 恢复按钮状态
        })
      }
    }
  });
};

/**
 * 重置表单数据
 * 在打开对话框前调用，确保表单是干净的
 */
const resetForm = ()=>{
  state.formData = {    
    id: undefined,    
    name: undefined,    
    create_time: undefined,    
    update_time: undefined,    
  }  
};
</script>
<style scoped>  
  .kv-label{margin-bottom: 15px;font-size: 14px;}
  .mini-btn i.el-icon{margin: unset;}
  .kv-row{margin-bottom: 12px;}
</style>