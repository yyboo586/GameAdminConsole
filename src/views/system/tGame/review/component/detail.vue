<template>
  <!-- 游戏审核详情抽屉 -->  
  <div class="system-tGame-review-detail">
    <el-drawer v-model="isShowDialog" size="80%" direction="ltr">
      <template #header>
        <h4>游戏审核详情</h4>
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
                  游戏名称
                </div>
              </template>
              {{ formData.name }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏分发类型
                </div>
              </template>
              {{ formatDistributeType(formData.distribute_type) }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  H5链接
                </div>
              </template>
              <el-link
                v-if="formData.h5_link"
                :href="formData.h5_link"
                target="_blank"
                type="primary"
              >
                {{ formData.h5_link }}
              </el-link>
              <span v-else>-</span>
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏分类
                </div>
              </template>
              {{ formData.category?.name || '-' }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  游戏标签
                </div>
              </template>
              <el-tag 
                v-for="tag in formData.tags" 
                :key="tag.id" 
                class="ml-2"
                type="info"
              >
                {{ tag.name }}
              </el-tag>
              <span v-if="!formData.tags || formData.tags.length === 0">-</span>
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
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  游戏描述
                </div>
              </template>
              {{ formData.description }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  游戏详情
                </div>
              </template>
              <div v-html="formData.details"></div>
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
      
      <!-- 媒体文件展示 -->
      <div style="margin: 20px 8px;">
        <!-- 游戏图标 -->
        <div v-if="formData.icon_file && formData.icon_file.file_link" style="margin-bottom: 20px;">
          <h4>游戏图标</h4>
          <div class="media-container">
            <el-image 
              :src="resolveFileUrl(formData.icon_file?.file_link)" 
              fit="cover"
              style="width: 150px; height: 150px; margin-right: 10px; border-radius: 8px;"
              :preview-src-list="[resolveFileUrl(formData.icon_file?.file_link)]"
            />
          </div>
        </div>
        
        <!-- 游戏截图 -->
        <div v-if="formData.feature_images && formData.feature_images.length > 0" style="margin-bottom: 20px;">
          <h4>游戏截图</h4>
          <div class="media-container">
            <el-image 
              v-for="screenshot in formData.feature_images" 
              :key="screenshot.file_id"
              :src="resolveFileUrl(screenshot.file_link)" 
              fit="cover"
              style="width: 200px; height: 120px; margin-right: 10px; border-radius: 8px;"
              :preview-src-list="formData.feature_images.map(s => resolveFileUrl(s.file_link))"
            />
          </div>
        </div>
        
        <!-- 游戏视频 -->
        <div v-if="formData.video_file && formData.video_file.file_link" style="margin-bottom: 20px;">
          <h4>游戏视频</h4>
          <div class="media-container">
            <video 
              :src="resolveFileUrl(formData.video_file.file_link)" 
              controls
              style="width: 400px; height: 225px; margin-right: 10px; border-radius: 8px;"
            />
          </div>
        </div>
        
        <!-- APK文件 -->
        <div v-if="formData.apk_file && formData.apk_file.file_link" style="margin-bottom: 20px;">
          <h4>APK文件</h4>
          <div class="file-list">
            <div class="file-item">
              <el-link :href="resolveFileUrl(formData.apk_file.file_link)" target="_blank" type="primary">
                <el-icon><ele-Download /></el-icon>
                下载 APK 文件
              </el-link>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 审核操作区域 -->
      <div v-if="formData.status === '审核中'" style="margin: 20px 8px; padding: 20px; background-color: var(--el-fill-color-light); border-radius: 8px;">
        <h4 style="margin-bottom: 15px;">审核操作</h4>
        
        <!-- 拒绝原因输入框 -->
        <el-form v-if="showRejectInput" :model="reviewForm" ref="reviewFormRef" label-width="100px">
          <el-form-item 
            label="拒绝原因" 
            prop="remark"
            :rules="[{ required: true, message: '请输入拒绝原因', trigger: 'blur' }]"
          >
            <el-input
              v-model="reviewForm.remark"
              type="textarea"
              :rows="4"
              placeholder="请输入拒绝原因（必填）"
            />
          </el-form-item>
        </el-form>
        
        <!-- 操作按钮 -->
        <div class="review-actions">
          <el-button
            v-if="!showRejectInput"
            type="success"
            size="large"
            @click="handleApprove"
            :loading="loading"
          >
            <el-icon><ele-Check /></el-icon>
            通过审核
          </el-button>
          
          <el-button
            v-if="!showRejectInput"
            type="danger"
            size="large"
            @click="showRejectInput = true"
          >
            <el-icon><ele-Close /></el-icon>
            拒绝审核
          </el-button>
          
          <!-- 拒绝确认按钮 -->
          <template v-if="showRejectInput">
            <el-button
              type="danger"
              size="large"
              @click="handleReject"
              :loading="loading"
            >
              <el-icon><ele-Check /></el-icon>
              确认拒绝
            </el-button>
            <el-button
              size="large"
              @click="cancelReject"
            >
              取消
            </el-button>
          </template>
        </div>
      </div>
      
      <!-- 审核状态提示 -->
      <div v-else style="margin: 20px 8px; padding: 20px; background-color: var(--el-fill-color-light); border-radius: 8px; text-align: center;">
        <el-tag v-if="formData.status === '初始状态'" type="info" size="large">初始状态</el-tag>
        <el-tag v-else-if="formData.status === '审核通过'" type="success" size="large">审核已通过</el-tag>
        <el-tag v-else-if="formData.status === '可预约'" type="primary" size="large">可预约</el-tag>
        <el-tag v-else-if="formData.status === '已上架'" type="success" size="large">已上架</el-tag>
        <el-tag v-else-if="formData.status === '已下架'" type="danger" size="large">已下架</el-tag>
        <el-tag v-else type="info" size="large">{{ formData.status }}</el-tag>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
  import { reactive, toRefs, ref, getCurrentInstance } from 'vue';
  import { ElMessage, ElMessageBox, FormInstance } from 'element-plus';
  import { approveGame, rejectGame } from "/@/api/system/tGame";  
  import {
    TGameReviewDetailState,
  } from "/@/views/system/tGame/review/component/model"
  import { TGameFileInfo } from "/@/views/system/tGame/list/component/model"
  
  defineOptions({ name: "TGameReviewDetail"})  
  const {proxy} = <any>getCurrentInstance()
  const emits = defineEmits(['refreshList']);
  
  const reviewFormRef = ref<FormInstance>();
  const showRejectInput = ref(false);
  const reviewForm = reactive({
    remark: ''
  });
  
  const state = reactive<TGameReviewDetailState>({
    loading:false,
    isShowDialog: false,
    formData: {      
      id: undefined,      
      name: undefined,
      category_id: undefined,
      category: undefined,
      tag_ids: undefined,
      tags: undefined,      
      distribute_type: undefined,      
      developer: undefined,      
      publisher: undefined,      
      description: undefined,      
      details: undefined,
      status: undefined,
      publish_time: undefined,
      reserve_count: undefined,
      average_rating: undefined,      
      rating_score: undefined,      
      rating_count: undefined,      
      favorite_count: undefined,      
      download_count: undefined,      
      create_time: undefined,      
    update_time: undefined,
    h5_link: undefined,
    icon_file: null,
    feature_images: [] as TGameFileInfo[],
    video_file: null,
    apk_file: null,      
    },
    rules: {}
  });
  
  const { isShowDialog, formData, loading } = toRefs(state);
  
const resolveFileUrl = (url?: string) => {
  if (!url) return '';
  if (proxy && typeof proxy.getUpFileUrl === 'function') {
    return proxy.getUpFileUrl(url);
  }
  return url;
};

const formatDistributeType = (type: number | string | undefined) => {
  if (type === 1 || type === '1') return 'APK';
  if (type === 2 || type === '2') return '链接';
  return '-';
};
  
  // 打开弹窗
  const openDialog = (row: any) => {
    resetForm();
  if (row) {
    state.formData = {
      ...state.formData,
      ...row,
      feature_images: row.feature_images ?? [],
      icon_file: row.icon_file ?? null,
      video_file: row.video_file ?? null,
      apk_file: row.apk_file ?? null,
    };
  }
    state.isShowDialog = true;
  };
  
  // 关闭弹窗
  const closeDialog = () => {
    state.isShowDialog = false;
    showRejectInput.value = false;
    reviewForm.remark = '';
  };
  
  // 通过审核
  const handleApprove = () => {
    ElMessageBox.confirm('确认通过该游戏的审核？', '提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    }).then(() => {
      state.loading = true;
      approveGame(state.formData.id!, { remark: '' }).then(() => {
        ElMessage.success('审核通过成功');
        closeDialog();
        emits('refreshList');
      }).finally(() => {
        state.loading = false;
      });
    }).catch(() => {});
  };
  
  // 拒绝审核
  const handleReject = () => {
    if (!reviewFormRef.value) return;
    
    reviewFormRef.value.validate((valid: boolean) => {
      if (!valid) return;
      
      ElMessageBox.confirm('确认拒绝该游戏的审核？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        state.loading = true;
        rejectGame(state.formData.id!, { remark: reviewForm.remark }).then(() => {
          ElMessage.success('审核拒绝成功');
          closeDialog();
          emits('refreshList');
        }).finally(() => {
          state.loading = false;
        });
      }).catch(() => {});
    });
  };
  
  // 取消拒绝
  const cancelReject = () => {
    showRejectInput.value = false;
    reviewForm.remark = '';
    if (reviewFormRef.value) {
      reviewFormRef.value.resetFields();
    }
  };
  
  defineExpose({
    openDialog,
  });
  
  const resetForm = ()=>{
    showRejectInput.value = false;
    reviewForm.remark = '';
    state.formData = {      
      id: undefined,      
      name: undefined,
      category_id: undefined,
      category: undefined,
      tag_ids: undefined,
      tags: undefined,      
      distribute_type: undefined,      
      developer: undefined,      
      publisher: undefined,      
      description: undefined,      
      details: undefined,
      status: undefined,
      publish_time: undefined,
      reserve_count: undefined,
      average_rating: undefined,      
      rating_score: undefined,      
      rating_count: undefined,      
      favorite_count: undefined,      
      download_count: undefined,      
      create_time: undefined,      
    update_time: undefined,
    h5_link: undefined,
    icon_file: null,
    feature_images: [] as TGameFileInfo[],
    video_file: null,
    apk_file: null,      
    }
  };  
</script>
<style scoped>  
  .system-tGame-review-detail :deep(.el-form-item--large .el-form-item__label){
    font-weight: bolder;
  }
  .ml-2{
    margin-right: 5px;
  }
  .media-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  .file-list {
    margin-top: 10px;
  }
  .file-item {
    padding: 10px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    margin-bottom: 8px;
  }
  h4 {
    margin-bottom: 10px;
    color: var(--el-text-color-primary);
    font-weight: bold;
  }
  .review-actions {
    display: flex;
    gap: 15px;
    margin-top: 15px;
  }
  .review-actions .el-button {
    flex: 1;
  }
</style>

