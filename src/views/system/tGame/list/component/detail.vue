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
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  游戏分类
                </div>
              </template>
              {{ formatCategoryName(formData.category) }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="3">            
              <template #label>
                <div class="cell-item">
                  游戏标签
                </div>
              </template>
              <el-tag 
                v-for="tag in formatTagList(formData.tags)" 
                :key="tag.key" 
                class="ml-2"
                type="info"
              >
                {{ tag.name }}
              </el-tag>
              <span v-if="!formatTagList(formData.tags).length">-</span>
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
                  游戏状态
                </div>
              </template>
              {{ formData.status }}            
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
                  发布时间
                </div>
              </template>
              {{ formData.publish_time ? proxy.parseTime(formData.publish_time, '{y}-{m}-{d} {h}:{i}:{s}') : '-' }}
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  预约人数
                </div>
              </template>
              {{ formData.reserve_count || 0 }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  游戏评分
                </div>
              </template>
              {{ formData.average_rating ? formData.average_rating.toFixed(1) : '0.0' }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  收藏次数
                </div>
              </template>
              {{ formData.favorite_count || 0 }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">            
              <template #label>
                <div class="cell-item">
                  下载次数
                </div>
              </template>
              {{ formData.download_count || 0 }}            
          </el-descriptions-item>        
          <el-descriptions-item :span="1">
            <template #label>
              <div class="cell-item">
                创建时间
              </div>
            </template>
            {{ proxy.parseTime(formData.create_time, '{y}-{m}-{d} {h}:{i}:{s}') }}
          </el-descriptions-item>        
      </el-descriptions>
      <div v-if="formData.status === '初始状态'" class="review-action">
        <el-button type="primary" :loading="submitting" @click="handleSubmitReview">
          提交审核
        </el-button>
      </div>
      
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
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRefs, getCurrentInstance } from 'vue';
import { ElMessage } from 'element-plus';
import { submitForReview, getTGame } from "/@/api/system/tGame";
import { TGameInfoData } from "/@/views/system/tGame/list/component/model";
defineOptions({ name: "ApiV1SystemTGameDetail"})  
const {proxy} = <any>getCurrentInstance()

interface DetailState { 
  isShowDialog: boolean;
  formData: TGameInfoData;
  submitting: boolean;
}

const createEmptyFormData = (): TGameInfoData => ({
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
  feature_images: [],
  video_file: null,
  apk_file: null,
});

const state = reactive<DetailState>({
  isShowDialog: false,
  formData: createEmptyFormData(),
  submitting: false,
});

const { isShowDialog, formData, submitting } = toRefs(state);

const resolveFileUrl = (url?: string) => {
  if (!url) return '';
  if (proxy && typeof proxy.getUpFileUrl === 'function') {
    return proxy.getUpFileUrl(url);
  }
  return url;
};

const formatDistributeType = (type: number | string | undefined) => {
  if (type === 1 || type === '1' || type === 'APK') return 'APK';
  if (type === 2 || type === '2' || type === '链接' || type === 'H5') return '链接';
  return type || '-';
};

const formatCategoryName = (category: any) => {
  if (!category) return '-';
  if (typeof category === 'string') return category;
  return category.name || '-';
};

const formatTagList = (tags: any): Array<{ key: string; name: string }> => {
  if (!Array.isArray(tags)) return [];
  return tags.map((tag: any, idx: number) => {
    if (typeof tag === 'string') {
      return { key: `tag-${idx}-${tag}`, name: tag };
    }
    return {
      key: `${tag?.id || idx}`,
      name: tag?.name || `标签${idx + 1}`,
    };
  });
};

const openDialog = (row?: TGameInfoData) => {
  resetForm();
  if (row) {
    mergeRow(row);
  }
  state.isShowDialog = true;
};

const closeDialog = () => {
  state.isShowDialog = false;
};

defineExpose({
  openDialog,
});

const resetForm = () => {
  state.formData = createEmptyFormData();
  state.submitting = false;
};

const mergeRow = (row: TGameInfoData) => {
  const normalizedCategory = row.category
    ? (typeof row.category === 'string' ? { name: row.category } : row.category)
    : undefined;
  const normalizedTags = Array.isArray(row.tags)
    ? row.tags.map((tag: any, idx: number) => {
        if (typeof tag === 'string') {
          return { id: `${row.id || idx}-tag-${idx}`, name: tag };
        }
        return tag;
      })
    : [];

  state.formData = {
    ...state.formData,
    ...row,
    category: normalizedCategory,
    tags: normalizedTags,
    feature_images: row.feature_images ?? [],
    icon_file: row.icon_file ?? null,
    video_file: row.video_file ?? null,
    apk_file: row.apk_file ?? null,
  };
};

const handleSubmitReview = async () => {
  if (!state.formData.id || state.submitting) return;
  state.submitting = true;
  try {
    await submitForReview(String(state.formData.id));
    ElMessage.success('提交审核成功');
    const fresh = await getTGame(String(state.formData.id));
    if (fresh?.data) {
      mergeRow(fresh.data);
    }
  } finally {
    state.submitting = false;
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
  .review-action {
    margin: 16px 8px 0;
    text-align: right;
  }
</style>