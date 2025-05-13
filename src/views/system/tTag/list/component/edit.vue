<template>  
  <div class="system-tTag-edit">
    <!-- 添加或修改标签表对话框 -->
    <el-dialog v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <template #header>
        <div v-drag="['.system-tTag-edit .el-dialog', '.system-tTag-edit .el-dialog__header']">{{(!formData.id || formData.id==0?'添加':'修改')+'标签表'}}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">        
        <el-form-item label="标签名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入标签名" />
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
import { reactive, toRefs, ref,unref,getCurrentInstance,computed } from 'vue';
import {ElMessageBox, ElMessage, FormInstance,UploadProps} from 'element-plus';
import {
  listTTag,
  getTTag,
  delTTag,
  addTTag,
  updateTTag,  
} from "/@/api/system/tTag";
import {
  TTagTableColumns,
  TTagInfoData,
  TTagTableDataState,
  TTagEditState
} from "/@/views/system/tTag/list/component/model"
defineOptions({ name: "ApiV1SystemTTagEdit"})
const emit = defineEmits(['tTagList'])
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);
const menuRef = ref();
const state = reactive<TTagEditState>({
  loading:false,
  isShowDialog: false,
  formData: {    
    id: undefined,    
    name: undefined,    
    create_time: undefined,    
    update_time: undefined,    
  },
  // 表单校验
  rules: {    
    id : [
        { required: true, message: "主键不能为空", trigger: "blur" }
    ],    
    name : [
        { required: true, message: "标签名不能为空", trigger: "blur" }
    ],    
  }
});
const { loading,isShowDialog,formData,rules } = toRefs(state);
// 打开弹窗
const openDialog = (row?: TTagInfoData) => {
  resetForm();
  if(row) {
    getTTag(row.id!).then((res:any)=>{
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
// 提交
const onSubmit = () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      if(!state.formData.id || state.formData.id===0){
        //添加
      addTTag(state.formData).then(()=>{
          ElMessage.success('添加成功');
          closeDialog(); // 关闭弹窗
          emit('tTagList')
        }).finally(()=>{
          state.loading = false;
        })
      }else{
        //修改
      updateTTag(state.formData.id!,state.formData).then(()=>{
          ElMessage.success('修改成功');
          closeDialog(); // 关闭弹窗
          emit('tTagList')
        }).finally(()=>{
          state.loading = false;
        })
      }
    }
  });
};
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