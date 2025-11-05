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
          <el-table-column label="图标" align="center" width="90">
            <template #default="scope">
              <el-image
                v-if="scope.row.icon_file && scope.row.icon_file.file_link"
                :src="resolveFileUrl(scope.row.icon_file.file_link)"
                fit="cover"
                style="width: 64px; height: 64px; border-radius: 8px;"
              />
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="游戏名称" align="center" prop="name"
            min-width="150px"            
             />          
          <el-table-column label="游戏分发类型" align="center" prop="distribute_type"
            min-width="120px"            
            >
            <template #default="scope">
              {{ formatDistributeType(scope.row.distribute_type) }}            
            </template>
          </el-table-column>
          <el-table-column label="开发商" align="center" min-width="140px">
            <template #default="scope">
              {{ scope.row.developer || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="发行商" align="center" min-width="140px">
            <template #default="scope">
              {{ scope.row.publisher || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="游戏分类" align="center" min-width="140px">
            <template #default="scope">
              {{ formatCategoryName(scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column label="游戏标签" align="center" prop="tags"
            min-width="200px"            
            >
            <template #default="scope">
              <el-tag 
                v-for="tag in formatTagNames(scope.row.tags)" 
                :key="tag" 
                class="ml-2"
                type="info"
              >
                {{ tag }}
              </el-tag>
              <span v-if="!formatTagNames(scope.row.tags).length">-</span>
            </template>
          </el-table-column>
          <el-table-column label="游戏状态" align="center" prop="status"
            min-width="120px"            
            >
            <template #default="scope">
              {{ scope.row.status || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="链接/下载" align="center" min-width="160px">
            <template #default="scope">
              <el-link
                v-if="Number(scope.row.distribute_type) === 2 || scope.row.distribute_type === '2' || scope.row.distribute_type === '链接' || scope.row.distribute_type === 'H5'"
                :href="scope.row.h5_link"
                target="_blank"
                type="primary"
              >
                打开链接
              </el-link>
              <el-link
                v-else-if="(Number(scope.row.distribute_type) === 1 || scope.row.distribute_type === '1' || scope.row.distribute_type === 'APK') && scope.row.apk_file && scope.row.apk_file.file_link"
                :href="resolveFileUrl(scope.row.apk_file.file_link)"
                target="_blank"
                type="primary"
              >
                下载APK
              </el-link>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="游戏评分" align="center" prop="average_rating"
            min-width="100px"            
            >
            <template #default="scope">
              {{ scope.row.average_rating ? scope.row.average_rating.toFixed(1) : '0.0' }}
            </template>
          </el-table-column>          
          <el-table-column label="预约人数" align="center" prop="reserve_count"
            min-width="100px"            
            >
            <template #default="scope">
              {{ scope.row.reserve_count || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="收藏次数" align="center" prop="favorite_count"
            min-width="100px"            
            >
            <template #default="scope">
              {{ scope.row.favorite_count || 0 }}
            </template>
          </el-table-column>
          <el-table-column label="下载次数" align="center" prop="download_count"
            min-width="100px"            
            >
            <template #default="scope">
              {{ scope.row.download_count || 0 }}
            </template>
          </el-table-column>        
          <el-table-column label="操作" align="center" class-name="small-padding" min-width="250px" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="handleView(scope.row)"
                v-auth="'api/v1/system/tGame/edit'"
              ><el-icon><ele-View /></el-icon>详情</el-button>            
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
  </div>
</template>
<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance, toRaw } from 'vue';
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
defineOptions({ name: "apiV1SystemTGameList"})
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
    const list = (res.data?.list ?? []).map((item: any) => {
      const record = item as TGameTableColumns;
      const normalizedCategory = record.category
        ? (typeof record.category === 'string' ? { name: record.category } : record.category)
        : undefined;
      const normalizedTags = Array.isArray(record.tags)
        ? record.tags.map((tag: any, idx: number) => {
            if (typeof tag === 'string') {
              return { id: `${record.id || idx}-tag-${idx}`, name: tag };
            }
            return tag;
          })
        : [];
      return {
        ...record,
        category: normalizedCategory,
        tags: normalizedTags,
        icon_file: record.icon_file ?? null,
        feature_images: record.feature_images ?? [],
        video_file: record.video_file ?? null,
        apk_file: record.apk_file ?? null,
      } as TGameTableColumns;
    });    
    state.tableData.data = list;
    state.tableData.total = res.data.total;
    loading.value = false
  })
};
const resolveFileUrl = (url?: string) => {
    if (!url) return '';
    if (proxy && typeof proxy.getUpFileUrl === 'function') {
        return proxy.getUpFileUrl(url);
    }
    return url;
}

const formatDistributeType = (type: number | string | undefined) => {
    if (type === 1 || type === '1' || type === 'APK') return 'APK';
    if (type === 2 || type === '2' || type === '链接' || type === 'H5') return '链接';
    return type || '-';
}

const formatCategoryName = (category: any) => {
    if (!category) return '-';
    if (typeof category === 'string') return category || '-';
    return category.name || '-';
}

const formatTagNames = (tags: any): string[] => {
    if (!Array.isArray(tags)) return [];
    return tags.map((tag: any, index: number) => {
        if (typeof tag === 'string') return tag;
        if (tag && typeof tag.name === 'string') return tag.name;
        return `标签${index + 1}`;
    }).filter(Boolean);
}

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
    let id:string = '' ;
    if(row){
      msg = `此操作将永久删除数据，是否继续?`
      id = row.id
    } else if (state.ids.length === 1) {
      id = state.ids[0] as string;
    }
    if(id===''){
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