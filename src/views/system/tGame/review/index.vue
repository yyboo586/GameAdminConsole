<template>
  <div class="system-tGame-review-container">
    <el-card shadow="hover">
        <div class="system-tGame-review-search mb15">
            <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
            <el-row>                           
                <el-col :span="8" class="colBlock">
                  <el-form-item label="游戏名称" prop="name">
                    <el-input
                        v-model="tableData.param.name"
                        placeholder="请输入游戏名称"
                        clearable                        
                        @keyup.enter.native="getReviewList"
                    />                    
                  </el-form-item>
                </el-col>                                    
                <el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
                  <el-form-item>
                    <el-button type="primary"  @click="getReviewList"><el-icon><ele-Search /></el-icon>搜索</el-button>
                    <el-button  @click="resetQuery(queryRef)"><el-icon><ele-Refresh /></el-icon>重置</el-button>
                  </el-form-item>
                </el-col>                                                                                   
              </el-row>
            </el-form>
        </div>
        <el-table v-loading="loading" :data="tableData.data">         
          <el-table-column label="游戏名称" align="center" prop="name"
            min-width="150px"            
             />          
          <el-table-column label="游戏分发类型" align="center" prop="distribute_type"
            min-width="120px"            
            >
          </el-table-column>
          <el-table-column label="游戏分类" align="center" prop="category"
            min-width="120px"            
            >
            <template #default="scope">
              {{ scope.row.category?.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="游戏标签" align="center" prop="tags"
            min-width="200px"            
            >
            <template #default="scope">
              <el-tag 
                v-for="tag in scope.row.tags" 
                :key="tag.id" 
                class="ml-2"
                type="info"
              >
                {{ tag.name }}
              </el-tag>
              <span v-if="!scope.row.tags || scope.row.tags.length === 0">-</span>
            </template>
          </el-table-column>
          <el-table-column label="开发商" align="center" prop="developer"
            min-width="120px"            
             />
          <el-table-column label="发行商" align="center" prop="publisher"
            min-width="120px"            
             />
          <el-table-column label="游戏状态" align="center" prop="status"
            min-width="100px"            
            >
          </el-table-column>
          <el-table-column label="提交时间" align="center" prop="create_time"
            min-width="150px"            
            >
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding" min-width="150px" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="handleView(scope.row)"
              ><el-icon><ele-View /></el-icon>查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
            v-show="tableData.total>0"
            :total="tableData.total"
            v-model:page="tableData.param.pageNum"
            v-model:limit="tableData.param.pageSize"
            @pagination="getReviewList"
        />
    </el-card>
    
    <!-- 详情对话框（包含审核操作） -->
    <TGameReviewDetail
      ref="detailRef"
      @refreshList="getReviewList"
    ></TGameReviewDetail>
  </div>
</template>
<script setup lang="ts">
import { toRefs, reactive, onMounted, ref, getCurrentInstance } from 'vue';
import { FormInstance } from 'element-plus';
import { getReviewList as getReviewListApi } from "/@/api/system/tGame";
import {
    TGameReviewTableDataState,    
} from "/@/views/system/tGame/review/component/model"
import TGameReviewDetail from "/@/views/system/tGame/review/component/detail.vue"

defineOptions({ name: "TGameReview"})

const {proxy} = <any>getCurrentInstance()
const loading = ref(false)
const queryRef = ref()
const detailRef = ref();

// 是否显示所有搜索选项
const showAll = ref(false)

const state = reactive<TGameReviewTableDataState>({
    ids:[],
    tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
            pageNum: 1,
            pageSize: 10,            
            name: undefined,            
            status: undefined,            
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
    getReviewList()
};

/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    getReviewList()
};

// 获取审核列表数据
const getReviewList = ()=>{
  loading.value = true
  getReviewListApi(state.tableData.param).then((res:any)=>{
    let list = res.data.list??[];    
    state.tableData.data = list;
    state.tableData.total = res.data.total;
    loading.value = false
  })
};

// 查看详情（审核操作在详情页面中进行）
const handleView = (row: any) => {
    detailRef.value.openDialog(row);
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

