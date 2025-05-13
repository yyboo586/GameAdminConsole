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
              <el-col :span="1.5">
                <el-button
                  type="success"
                  :disabled="single"
                  @click="handleUpdate(null)"
                  v-auth="'api/v1/system/tCategory/edit'"
                ><el-icon><ele-Edit /></el-icon>修改</el-button>
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  :disabled="multiple"
                  @click="handleDelete(null)"
                  v-auth="'api/v1/system/tCategory/delete'"
                ><el-icon><ele-Delete /></el-icon>删除</el-button>
              </el-col>            
            </el-row>
        </div>
        <el-table v-loading="loading" :data="tableData.data" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />          
          <el-table-column label="主键" align="center" prop="id"
            min-width="150px"            
             />          
          <el-table-column label="分类名" align="center" prop="name"
            min-width="150px"            
             />          
          <el-table-column label="创建时间" align="center" prop="create_time"
            min-width="150px"            
            >
            <template #default="scope">
                <span>{{ proxy.parseTime(scope.row.create_time, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>          
          <el-table-column label="更新时间" align="center" prop="update_time"
            min-width="150px"            
            >
            <template #default="scope">
                <span>{{ proxy.parseTime(scope.row.update_time, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
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
import {ItemOptions} from "/@/api/items";
import {toRefs, reactive, onMounted, ref, defineComponent, computed,getCurrentInstance,toRaw} from 'vue';
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus';
import {
    listTCategory,
    getTCategory,
    delTCategory,
    addTCategory,
    updateTCategory,    
} from "/@/api/system/tCategory";
import {
    TCategoryTableColumns,
    TCategoryInfoData,
    TCategoryTableDataState,    
} from "/@/views/system/tCategory/list/component/model"
import ApiV1SystemTCategoryEdit from "/@/views/system/tCategory/list/component/edit.vue"
import ApiV1SystemTCategoryDetail from "/@/views/system/tCategory/list/component/detail.vue"
defineOptions({ name: "apiV1SystemTCategoryList"})
const {proxy} = <any>getCurrentInstance()
const loading = ref(false)
const queryRef = ref()
const editRef = ref();
const detailRef = ref();
// 是否显示所有搜索选项
const showAll =  ref(false)
// 非单个禁用
const single = ref(true)
// 非多个禁用
const multiple =ref(true)
// 字典选项数据
const {    
} = proxy.useDict(    
)
const state = reactive<TCategoryTableDataState>({
    ids:[],
    tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
            page_num: 1,
            page_size: 10,            
            id: undefined,            
            name: undefined,            
            create_time: undefined,            
            update_time: undefined,            
            dateRange: []
        },
    },
});
const { tableData } = toRefs(state);
// 页面加载时
onMounted(() => {
    initTableData();
});
// 初始化表格数据
const initTableData = () => {    
    tCategoryList()
};
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    tCategoryList()
};
// 获取列表数据
const tCategoryList = ()=>{
  loading.value = true
  listTCategory(state.tableData.param).then((res:any)=>{
    let list = res.data.list??[];    
    state.tableData.data = list;
    state.tableData.total = res.data.total;
    loading.value = false
  })
};
const toggleSearch = () => {
    showAll.value = !showAll.value;
}
// 多选框选中数据
const handleSelectionChange = (selection:Array<TCategoryInfoData>) => {
    state.ids = selection.map(item => item.id)
    single.value = selection.length!=1
    multiple.value = !selection.length
}
const handleAdd =  ()=>{
    editRef.value.openDialog()
}
const handleUpdate = (row: TCategoryTableColumns|null) => {
    if(!row){
        row = state.tableData.data.find((item:TCategoryTableColumns)=>{
            return item.id ===state.ids[0]
        }) as TCategoryTableColumns
    }
    editRef.value.openDialog(toRaw(row));
};
const handleDelete = (row: TCategoryTableColumns|null) => {
    let msg = '你确定要删除所选数据？';
    let id:number = 0 ;
    if(row){
      msg = `此操作将永久删除数据，是否继续?`
      id = row.id
    }
    ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            delTCategory(id).then(()=>{
                ElMessage.success('删除成功');
                tCategoryList();
            })
        })
        .catch(() => {});
}
const handleView = (row:TCategoryTableColumns)=>{
    detailRef.value.openDialog(toRaw(row));
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