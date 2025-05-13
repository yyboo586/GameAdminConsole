<template>  
  <div class="system-tGame-edit">
    <!-- 添加或修改游戏表对话框 -->
    <el-dialog v-model="isShowDialog" width="800px" :close-on-click-modal="false" :destroy-on-close="true">
      <template #header>
        <div v-drag="['.system-tGame-edit .el-dialog', '.system-tGame-edit .el-dialog__header']">{{(!formData.id || formData.id==0?'添加':'修改')+'游戏表'}}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">        
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入游戏名称" />
        </el-form-item>
        <!-- 选择游戏分类，数据从tCategory接口获取，只能选择一个。前端显示分类名称，调用后端接口时传递对应分类id -->
        <el-form-item label="游戏分类" prop="category_id">
          <el-select filterable clearable v-model="formData.category_id" placeholder="请选择游戏分类">
            <el-option 
              v-for="item in categoryList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>
        
        <!-- 选择游戏Tag，数据从tTag接口获取，可以多选。前端显示Tag名称，调用后端接口时传递对应Tagid列表 -->
        <el-form-item label="游戏标签" prop="tag_ids">
          <el-select 
            filterable 
            clearable 
            multiple 
            v-model="formData.tag_ids" 
            placeholder="请选择游戏标签"
          >
            <el-option 
              v-for="item in tagList" 
              :key="item.id" 
              :label="item.name" 
              :value="item.id" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="游戏分发类型" prop="distribute_type">
          <el-select filterable clearable v-model="formData.distribute_type" placeholder="请选择游戏分发类型" >
            <el-option label="APK" :value="1" />
            <el-option label="链接" :value="2" />
          </el-select>
        </el-form-item>        
        <el-form-item label="开发商" prop="developer">
          <el-input v-model="formData.developer" placeholder="请输入开发商" />
        </el-form-item>        
        <el-form-item label="发行商" prop="publisher">
          <el-input v-model="formData.publisher" placeholder="请输入发行商" />
        </el-form-item>        
        <el-form-item label="游戏描述" prop="description">
          <el-input v-model="formData.description" placeholder="请输入游戏描述" />
        </el-form-item>        
        <el-form-item label="游戏详情" prop="details">
          <el-input v-model="formData.details" placeholder="请输入游戏详情" />
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
import { listTCategory } from '/@/api/system/tCategory';
import { listTTag } from '/@/api/system/tTag';
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
defineOptions({ name: "ApiV1SystemTGameEdit"})
const emit = defineEmits(['tGameList'])
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);
const categoryList = ref<any[]>([]);
const tagList = ref<any[]>([]);
const menuRef = ref();
const state = reactive<TGameEditState>({
  loading:false,
  isShowDialog: false,
  formData: {    
    id: undefined,    
    name: undefined,    
    category_id: undefined,
    tag_ids: [],
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
    name : [
        { required: true, message: "游戏名称不能为空", trigger: "blur" }
    ],    
    category_id : [
        { 
          required: true, 
          message: "游戏分类不能为空", 
          trigger: "change",
          validator: (rule: any, value: any, callback: any) => {
            if (!value) {
              callback(new Error('游戏分类不能为空'));
            } else {
              callback();
            }
          }
        }
    ],    
    tag_ids : [
        { 
          required: true, 
          message: "游戏标签不能为空", 
          trigger: "change",
          validator: (rule: any, value: any, callback: any) => {
            if (!value || value.length === 0) {
              callback(new Error('游戏标签不能为空'));
            } else {
              callback();
            }
          }
        }
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
const { loading,isShowDialog,formData,rules } = toRefs(state);
// 打开弹窗
const openDialog = (row?: TGameInfoData) => {
  resetForm();   
  state.isShowDialog = true;
  
  // 先获取分类和标签数据
  Promise.all([
    listTCategory({}),
    listTTag({})
  ]).then(([categoryRes, tagRes]) => {
    categoryList.value = categoryRes.data.list || [];
    tagList.value = tagRes.data.list || [];
    
    // 如果有行数据，需要转换数据格式
    if (row) {
      const convertedData = { ...row };
      
      // 转换分类：根据分类名称找到对应的分类ID
      if (row.category && categoryList.value.length > 0) {
        const categoryItem = categoryList.value.find(item => item.name === row.category);
        if (categoryItem) {
          convertedData.category_id = categoryItem.id;
        }
      }
      
      // 转换标签：根据标签名称数组找到对应的标签ID数组
      if (row.tags && Array.isArray(row.tags) && tagList.value.length > 0) {
        const tagIds: number[] = [];
        row.tags.forEach((tagName: string) => {
          const tagItem = tagList.value.find(item => item.name === tagName);
          if (tagItem) {
            tagIds.push(tagItem.id);
          }
        });
        convertedData.tag_ids = tagIds;
      }
      
      state.formData = convertedData;
    }
  });
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
      addTGame(state.formData).then(()=>{
          ElMessage.success('添加成功');
          closeDialog(); // 关闭弹窗
          emit('tGameList')
        }).finally(()=>{
          state.loading = false;
        })
      }else{
        //修改
      updateTGame(state.formData.id,state.formData).then(()=>{
          ElMessage.success('修改成功');
          closeDialog(); // 关闭弹窗
          emit('tGameList')
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
    category_id: undefined,
    tag_ids: [],
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
  .kv-label{margin-bottom: 15px;font-size: 14px;}
  .mini-btn i.el-icon{margin: unset;}
  .kv-row{margin-bottom: 12px;}
</style>