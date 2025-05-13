<template>
  <!-- 游戏表详情抽屉 -->  
  <div class="system-tGame-detail">
    <el-drawer v-model="isShowDialog" size="80%" direction="ltr">
      <template #header>
        <h4>游戏表详情</h4>
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
                  游戏名称
                </div>
              </template>
              {{ formData.name }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏分发类型(链接/APK文件)
                </div>
              </template>
              {{ formData.distribute_type }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  开发商
                </div>
              </template>
              {{ formData.developer }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  发行商
                </div>
              </template>
              {{ formData.publisher }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏描述
                </div>
              </template>
              {{ formData.description }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏详情
                </div>
              </template>
              {{ formData.details }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  评分总分
                </div>
              </template>
              {{ formData.rating_score }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  评分次数
                </div>
              </template>
              {{ formData.rating_count }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  收藏次数
                </div>
              </template>
              {{ formData.favorite_count }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  下载次数
                </div>
              </template>
              {{ formData.download_count }}            
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
  import { reactive, toRefs, defineComponent,ref,unref,getCurrentInstance,computed } from 'vue';
  import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';  
  import {
    listTGame,
    getTGame,
    delTGame,
    addTGame,
    updateTGame,    
  } from "/@/api/system/tGame";  
  import {
    TGameTableColumns,
    TGameInfoData,
    TGameTableDataState,
    TGameEditState
  } from "/@/views/system/tGame/list/component/model"
  defineOptions({ name: "ApiV1SystemTGameDetail"})  
  const {proxy} = <any>getCurrentInstance()
  const formRef = ref<HTMLElement | null>(null);
  const menuRef = ref();  
  const state = reactive<TGameEditState>({
    loading:false,
    isShowDialog: false,
    formData: {      
      id: undefined,      
      name: undefined,      
      distribute_type: undefined,      
      developer: undefined,      
      publisher: undefined,      
      description: undefined,      
      details: undefined,      
      rating_score: undefined,      
      rating_count: undefined,      
      favorite_count: undefined,      
      download_count: undefined,      
      create_time: undefined,      
      update_time: undefined,      
    },
    // 表单校验
    rules: {      
      id : [
          { required: true, message: "主键不能为空", trigger: "blur" }
      ],      
      name : [
          { required: true, message: "游戏名称不能为空", trigger: "blur" }
      ],      
      distribute_type : [
          { required: true, message: "游戏分发类型(链接/APK文件)不能为空", trigger: "blur" }
      ],      
      developer : [
          { required: true, message: "开发商不能为空", trigger: "blur" }
      ],      
      publisher : [
          { required: true, message: "发行商不能为空", trigger: "blur" }
      ],      
    }
  });
  const { isShowDialog,formData } = toRefs(state);
  // 打开弹窗
  const openDialog = (row?: TGameInfoData) => {
    resetForm();
    if(row) {
      getTGame(row.id!).then((res:any)=>{
        const data = res.data;        
        state.formData = data;
      })
    }
    state.isShowDialog = true;
  };
  // 关闭弹窗
  const closeDialog = () => {
    state.isShowDialog = false;
  };
  defineExpose({
    openDialog,
  });
  // 取消
  const onCancel = () => {
    closeDialog();
  };
  const resetForm = ()=>{
    state.formData = {      
      id: undefined,      
      name: undefined,      
      distribute_type: undefined,      
      developer: undefined,      
      publisher: undefined,      
      description: undefined,      
      details: undefined,      
      rating_score: undefined,      
      rating_count: undefined,      
      favorite_count: undefined,      
      download_count: undefined,      
      create_time: undefined,      
      update_time: undefined,      
    }
  };  
</script>
<style scoped>  
  .system-tGame-detail :deep(.el-form-item--large .el-form-item__label){
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