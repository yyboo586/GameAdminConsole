<template>
  <!-- 分类表详情抽屉 -->  
  <div class="system-tCategory-detail">
    <el-drawer v-model="isShowDialog" size="80%" direction="ltr">
      <template #header>
        <h4>分类表详情</h4>
      </template>
      <el-descriptions
              class="margin-top"
              :column="3"
              border
              style="margin: 8px;"
      >        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  主键
                </div>
              </template>
              {{ formData.id }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  分类名
                </div>
              </template>
              {{ formData.name }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">
            <template #label>
              <div class="cell-item">
                创建时间
              </div>
            </template>
            {{ proxy.parseTime(formData.create_time, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </el-descriptions-item>        
          <el-descriptions-item :span="1">
            <template #label>
              <div class="cell-item">
                更新时间
              </div>
            </template>
            {{ proxy.parseTime(formData.update_time, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </el-descriptions-item>        
      </el-descriptions>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  /**
   * 游戏分类详情抽屉组件
   * 功能：以只读模式展示分类的详细信息
   * 
   * 父组件调用方式：
   * detailRef.value.openDialog(row)
   */

  // ========== 导入依赖 ==========
  import { reactive, toRefs, defineComponent,ref,unref,getCurrentInstance,computed } from 'vue';
  import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';  
  // API接口
  import {
    listTCategory,
    getTCategory,      // 获取单个分类详情
    delTCategory,
    addTCategory,
    updateTCategory,    
  } from "/@/api/system/tCategory";  
  // TypeScript类型定义
  import {
    TCategoryTableColumns,
    CategoryInfo,
    CategoryListState,
    CategoryEditState
  } from "/@/views/system/tCategory/list/component/model"
  
  // 定义组件名称
  defineOptions({ name: "ApiV1SystemTCategoryDetail"})  
  
  const {proxy} = <any>getCurrentInstance()
  const formRef = ref<HTMLElement | null>(null);
  const menuRef = ref();  
  
  // ========== 定义组件状态数据 ==========
  const state = reactive<CategoryEditState>({
    loading:false,
    isShowDialog: false,  // 抽屉显示状态
    formData: {      
      id: undefined,      
      name: undefined,      
      create_time: undefined,      
      update_time: undefined,      
    },
    // 表单校验（详情页不需要，但保留类型一致性）
    rules: {      
      id : [
          { required: true, message: "主键不能为空", trigger: "blur" }
      ],      
      name : [
          { required: true, message: "分类名不能为空", trigger: "blur" }
      ],      
    }
  });
  const { isShowDialog,formData } = toRefs(state);
  
  // ========== 核心方法：接收父组件传来的数据 ==========
  /**
   * 打开详情抽屉（由父组件调用）
   * @param row 要查看的行数据
   * 
   * 数据接收流程（与edit.vue类似）：
   * 1. 父组件调用：detailRef.value.openDialog(row)
   * 2. 接收row参数，调用getTCategory获取完整数据
   * 3. 填充到formData，在模板中只读展示
   */
  const openDialog = (row?: CategoryInfo) => {
    resetForm();  // 重置数据
    if(row) {
      // 从后端获取完整数据
      getTCategory(row.id!).then((res:any)=>{
        const data = res.data;        
        state.formData = data;  // 填充数据（模板会自动展示）
      })
    }
    state.isShowDialog = true;  // 显示抽屉
  };
  
  /**
   * 关闭抽屉
   */
  const closeDialog = () => {
    state.isShowDialog = false;
  };
  
  // ========== 暴露方法给父组件 ==========
  defineExpose({
    openDialog,  // 暴露openDialog方法
  });
  
  /**
   * 取消按钮点击事件
   */
  const onCancel = () => {
    closeDialog();
  };
  
  /**
   * 重置表单数据
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
  .system-tCategory-detail :deep(.el-form-item--large .el-form-item__label){
    font-weight: bolder;
  }
  .pic-block{
    margin-right: 8px;
  }
  .file-block{
    width: 100%;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    margin-bottom: 5px;
    padding: 3px 6px;
  }
  .ml-2{margin-right: 5px;}
</style>