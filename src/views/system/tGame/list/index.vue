<template>
  <div class="system-tGame-container">
    <el-card shadow="hover">
        <div class="system-tGame-search mb15">
            <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
            <el-row>                           
                <el-col :span="8" class="colBlock">
                  <el-form-item label="游戏名称" prop="name">
                    <el-input
                        v-model="tableData.param.name"
                        placeholder="请输入游戏名称"
                        clearable                        
                        @keyup.enter.native="tGameList"
                    />                    
                  </el-form-item>
                </el-col>                                    
                <el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
                  <el-form-item>
                    <el-button type="primary"  @click="tGameList"><el-icon><ele-Search /></el-icon>搜索</el-button>
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
                  v-auth="'api/v1/system/tGame/add'"
                ><el-icon><ele-Plus /></el-icon>新增</el-button>
              </el-col>           
            </el-row>
        </div>
        <el-table v-loading="loading" :data="tableData.data" @selection-change="handleSelectionChange">         
          <el-table-column label="游戏名称" align="center" prop="name"
            min-width="150px"            
             />          
          <el-table-column label="游戏分发类型" align="center" prop="distribute_type"
            min-width="150px"            
            >
            <template #default="scope">
                <el-tag v-if="scope.row.distribute_type === 1" type="success">APK</el-tag>
                <el-tag v-else-if="scope.row.distribute_type === 2" type="primary">链接</el-tag>
                <el-tag v-else type="info">未知</el-tag>
            </template>
          </el-table-column>          
          <el-table-column label="开发商" align="center" prop="developer"
            min-width="150px"            
             />          
          <el-table-column label="发行商" align="center" prop="publisher"
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
                @click="handleMediaInfo(scope.row)"
                v-auth="'api/v1/system/tGame/edit'"
              ><el-icon><ele-EditPen /></el-icon>媒体文件</el-button>            
              <el-button
                type="primary"
                link
                @click="handleUpdate(scope.row)"
                v-auth="'api/v1/system/tGame/edit'"
              ><el-icon><ele-EditPen /></el-icon>修改</el-button>
              <el-button
                type="primary"
                link
                @click="handleDelete(scope.row)"
                v-auth="'api/v1/system/tGame/delete'"
              ><el-icon><ele-DeleteFilled /></el-icon>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="tableData.total>0"
            :total="tableData.total"
            v-model:page="tableData.param.pageNum"
            v-model:limit="tableData.param.pageSize"
            @pagination="tGameList"
        />
    </el-card>
    <ApiV1SystemTGameEdit
       ref="editRef"       
       @tGameList="tGameList"
    ></ApiV1SystemTGameEdit>
    <ApiV1SystemTGameDetail
      ref="detailRef"      
      @tGameList="tGameList"
    ></ApiV1SystemTGameDetail>    
    <ApiV1SystemTGameMediaInfo
      ref="mediaInfoRef"
      @tGameList="tGameList"
    ></ApiV1SystemTGameMediaInfo>
  </div>
</template>
<script setup lang="ts">
import {ItemOptions} from "/@/api/items";
import {toRefs, reactive, onMounted, ref, defineComponent, computed,getCurrentInstance,toRaw} from 'vue';
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus';
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
} from "/@/views/system/tGame/list/component/model"
import ApiV1SystemTGameEdit from "/@/views/system/tGame/list/component/edit.vue"
import ApiV1SystemTGameDetail from "/@/views/system/tGame/list/component/detail.vue"
import ApiV1SystemTGameMediaInfo from "/@/views/system/tGame/list/component/mediaInfo.vue"
defineOptions({ name: "apiV1SystemTGameList"})
const {proxy} = <any>getCurrentInstance()
const loading = ref(false)
const queryRef = ref()
const editRef = ref();
const detailRef = ref();
const mediaInfoRef = ref();
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
const state = reactive<TGameTableDataState>({
    ids:[],
    tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
            pageNum: 1,
            pageSize: 10,            
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
    tGameList()
};
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    tGameList()
};
// 获取列表数据
const tGameList = ()=>{
  loading.value = true
  listTGame(state.tableData.param).then((res:any)=>{
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
const handleSelectionChange = (selection:Array<TGameInfoData>) => {
    state.ids = selection.map(item => item.id)
    single.value = selection.length!=1
    multiple.value = !selection.length
}
const handleAdd =  ()=>{
    editRef.value.openDialog()
}
const handleUpdate = (row: TGameTableColumns|null) => {
    if(!row){
        row = state.tableData.data.find((item:TGameTableColumns)=>{
            return item.id ===state.ids[0]
        }) as TGameTableColumns
    }
    editRef.value.openDialog(toRaw(row));
};
const handleDelete = (row: TGameTableColumns|null) => {
    let msg = '你确定要删除所选数据？';
    let id:number[] = [] ;
    if(row){
    msg = `此操作将永久删除数据，是否继续?`
    id = [row.id]
    }else{
    id = state.ids
    }
    if(id.length===0){
        ElMessage.error('请选择要删除的数据。');
        return
    }
    ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
    })
        .then(() => {
            delTGame(id).then(()=>{
                ElMessage.success('删除成功');
                tGameList();
            })
        })
        .catch(() => {});
}
const handleView = (row:TGameTableColumns)=>{
    detailRef.value.openDialog(toRaw(row));
}
const handleMediaInfo = (row: TGameTableColumns) => {
    mediaInfoRef.value.openDialog(row);
};
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