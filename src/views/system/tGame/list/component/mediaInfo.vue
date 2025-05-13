<template>
  <div class="system-tGame-mediaInfo">
    <el-dialog v-model="isShowDialog" width="1000px" :close-on-click-modal="false" :destroy-on-close="true">
      <template #header>
        <div v-drag="['.system-tGame-mediaInfo .el-dialog', '.system-tGame-mediaInfo .el-dialog__header']">
          游戏媒体信息管理 - {{ gameName }}
        </div>
      </template>
      
      <el-form ref="formRef" label-width="120px">
        <!-- 游戏图标上传 -->
        <el-form-item label="游戏图标" required>
          <div class="icon-upload-container">
            <el-upload
              ref="iconUploadRef"
              class="icon-uploader"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleIconChange"
              :before-upload="beforeIconUpload"
              accept="image/*"
            >
              <div class="icon-upload-area">
                <img v-if="iconPreview" :src="iconPreview" class="icon-preview" />
                <div v-else class="icon-upload-placeholder">
                  <el-icon class="icon-uploader-icon"><ele-Plus /></el-icon>
                  <div class="icon-upload-text">选择图标</div>
                </div>
              </div>
            </el-upload>
          </div>
          
          <!-- 图标上传结果 -->
          <div v-if="uploadedFiles.find(f => f.media_type === 1)" class="upload-result-info">
            <el-tag type="success" size="small">
              <el-icon><ele-CircleCheck /></el-icon>
              图标上传成功
            </el-tag>
            <span class="file-info">
              {{ uploadedFiles.find(f => f.media_type === 1)?.originalName }}
            </span>
          </div>
        </el-form-item>

        <!-- 游戏分发方式相关上传 -->
        <el-form-item label="游戏分发方式" required>
          <div class="distribute-upload-container">
            <!-- APK上传 -->
            <div v-if="gameDistributeType === 1" class="apk-upload-section">
              <h4>APK文件上传</h4>
              <el-upload
                ref="apkUploadRef"
                class="apk-uploader"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleApkChange"
                :before-upload="beforeApkUpload"
                accept=".apk"
              >
                <div class="apk-upload-area">
                  <div v-if="apkFile" class="apk-file-info">
                    <el-icon class="apk-icon"><ele-Document /></el-icon>
                    <div class="apk-name">{{ apkFile.fileName }}</div>
                    <div class="apk-size">{{ formatFileSize(apkFile.fileSize) }}</div>
                  </div>
                  <div v-else class="apk-upload-placeholder">
                    <el-icon class="apk-uploader-icon"><ele-Plus /></el-icon>
                    <div class="apk-upload-text">选择APK文件</div>
                  </div>
                </div>
              </el-upload>
              
              <!-- APK上传结果 -->
              <div v-if="uploadedFiles.find(f => f.media_type === 4)" class="upload-result-info">
                <el-tag type="success" size="small">
                  <el-icon><ele-CircleCheck /></el-icon>
                  APK上传成功
                </el-tag>
                <span class="file-info">
                  {{ uploadedFiles.find(f => f.media_type === 4)?.originalName }}
                </span>
              </div>
            </div>
            
            <!-- 游戏链接输入 -->
            <div v-else-if="gameDistributeType === 2" class="link-input-section">
              <h4>游戏链接</h4>
              <el-input
                v-model="gameLink"
                placeholder="请输入游戏下载链接或官网链接"
                clearable
                style="width: 100%"
              />
              <!-- 游戏链接状态 -->
              <div v-if="gameLink.trim()" class="upload-result-info">
                <el-tag type="success" size="small">
                  <el-icon><ele-CircleCheck /></el-icon>
                  游戏链接已设置
                </el-tag>
                <span class="file-info">
                  {{ gameLink }}
                </span>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 游戏宣传素材 -->
        <el-form-item label="游戏宣传素材" required>
          <!-- 视频素材行 -->
          <div class="material-row">
            <div class="material-row-header">
              <h4>视频素材</h4>
              <el-upload
                ref="videoUploadRef"
                class="material-uploader"
                :auto-upload="false"
                :multiple="true"
                :on-change="handleVideoChange"
                :before-upload="beforeVideoUpload"
                :show-file-list="false"
                accept="video/*"
              >
                <div class="material-upload-area">
                  <el-icon><ele-Plus /></el-icon>
                  <div class="material-upload-text">添加视频</div>
                </div>
              </el-upload>
            </div>
            
            <!-- 已上传的视频素材 -->
            <div v-if="uploadedFiles.filter(f => f.media_type === 3).length > 0" class="uploaded-materials">
              <div class="material-grid">
                <div 
                  v-for="(file, index) in uploadedFiles.filter(f => f.media_type === 3)" 
                  :key="`video-${file.file_id || file.fileId || index}`"
                  class="material-item"
                >
                  <div 
                    class="video-preview"
                    @click="previewMedia(file.media_url || file.visitUrl, true, file.originalName)"
                  >
                    <div class="video-thumbnail">
                      <el-icon class="video-play-icon"><ele-VideoPlay /></el-icon>
                      <span class="video-label">视频</span>
                    </div>
                  </div>
                  <div class="material-actions">
                    <el-button 
                      type="danger" 
                      size="small" 
                      @click="removeMaterial(file)"
                      :icon="Delete"
                    >
                      删除
                    </el-button>
                  </div>
                  <div class="material-info">
                    <span class="file-name">{{ file.originalName || '未知文件' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 图片素材行 -->
          <div class="material-row">
            <div class="material-row-header">
              <h4>图片素材</h4>
              <el-upload
                ref="imageUploadRef"
                class="material-uploader"
                :auto-upload="false"
                :multiple="true"
                :on-change="handleImageChange"
                :before-upload="beforeImageUpload"
                :show-file-list="false"
                accept="image/*"
              >
                <div class="material-upload-area">
                  <el-icon><ele-Plus /></el-icon>
                  <div class="material-upload-text">添加图片</div>
                </div>
              </el-upload>
            </div>
            
            <!-- 已上传的图片素材 -->
            <div v-if="uploadedFiles.filter(f => f.media_type === 2).length > 0" class="uploaded-materials">
              <div class="material-grid">
                <div 
                  v-for="(file, index) in uploadedFiles.filter(f => f.media_type === 2)" 
                  :key="`image-${file.file_id || file.fileId || index}`"
                  class="material-item"
                >
                  <img 
                    :src="file.media_url || file.visitUrl" 
                    class="material-preview"
                    @click="previewMedia(file.media_url || file.visitUrl, false, file.originalName)"
                  />
                  <div class="material-actions">
                    <el-button 
                      type="danger" 
                      size="small" 
                      @click="removeMaterial(file)"
                      :icon="Delete"
                    >
                      删除
                    </el-button>
                  </div>
                  <div class="material-info">
                    <span class="file-name">{{ file.originalName || '未知文件' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>

        <!-- 上传进度 -->
        <el-form-item v-if="uploadProgress > 0 && uploadProgress < 100" label="上传进度">
          <el-progress :percentage="uploadProgress" :format="format" :stroke-width="8" />
        </el-form-item>


      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleUpload" :disabled="loading || !canUpload">
            <el-icon v-if="!loading"><ele-Upload /></el-icon>
            <el-icon v-else class="is-loading"><ele-Loading /></el-icon>
            {{ loading ? '保存中...' : '保存' }}
          </el-button>
          <el-button @click="onCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 媒体预览弹窗 -->
    <el-dialog v-model="previewVisible" :title="previewTitle" width="800px" :close-on-click-modal="true">
      <div class="media-preview-container">
        <!-- 图片预览 -->
        <img v-if="previewImageUrl && !isVideoPreview" :src="previewImageUrl" class="preview-image" />
        <!-- 视频预览 -->
        <video v-else-if="previewVideoUrl && isVideoPreview" :src="previewVideoUrl" class="preview-video" controls>
          您的浏览器不支持视频播放
        </video>

      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRefs, ref, computed, getCurrentInstance } from 'vue';
import { ElMessage, ElMessageBox, UploadProps, UploadUserFile } from 'element-plus';
import { Delete } from '@element-plus/icons-vue';
import { uploadTGameMediaInfo, reportTGameMediaUploadResult, saveTGameMediaInfo } from "/@/api/system/tGame";
import {
  TGameTableColumns,
  TGameMediaInfo,
  TGameMediaInfoState
} from "/@/views/system/tGame/list/component/model";

defineOptions({ name: "ApiV1SystemTGameMediaInfo" });

const emit = defineEmits(['tGameList']);
const { proxy } = <any>getCurrentInstance();

const formRef = ref();
const iconUploadRef = ref();
const imageUploadRef = ref();
const videoUploadRef = ref();
const apkUploadRef = ref();

const state = reactive<TGameMediaInfoState>({
  loading: false,
  isShowDialog: false,
  gameId: 0,
  gameName: '',
  iconFile: null,
  screenshotFiles: [],
  uploadProgress: 0,
  uploadedFiles: [] as TGameMediaInfo[]
});

const { loading, isShowDialog, gameId, gameName, iconFile, uploadProgress, uploadedFiles } = toRefs(state);

// 图标预览
const iconPreview = ref('');

// APK文件相关
const apkFile = ref<TGameMediaInfo | null>(null);
const gameLink = ref('');

// 游戏分发类型（从父组件传入）
const gameDistributeType = ref(1);

// 媒体预览
const previewVisible = ref(false);
const previewImageUrl = ref('');
const previewVideoUrl = ref('');
const isVideoPreview = ref(false);
const previewTitle = ref('媒体预览');

// 计算是否可以上传
const canUpload = computed(() => {
  // 必须有图标 - 检查是否有图标文件或图标预览
  const hasIcon = iconFile.value || iconPreview.value;
  if (!hasIcon) return false;
  
  // 必须有截图/视频 - 检查uploadedFiles中是否有截图或视频文件
  const hasScreenshotOrVideo = uploadedFiles.value.some(file => file.media_type === 2 || file.media_type === 3);
  if (!hasScreenshotOrVideo) return false;
  
  // 根据分发类型验证
  if (gameDistributeType.value === 1) {
    // APK分发：必须有APK文件
    return apkFile.value !== null;
  } else if (gameDistributeType.value === 2) {
    // 链接分发：必须有游戏链接
    return gameLink.value.trim() !== '';
  }
  
  return false;
});

// 打开弹窗
const openDialog = (row: TGameTableColumns) => {
  resetForm();
  state.gameId = row.id || 0;
  state.gameName = row.name || '';
  gameDistributeType.value = row.distribute_type || 1;
  
  // 如果有现有的媒体信息，加载到uploadedFiles中
  if (row.media_infos && row.media_infos.length > 0) {
    state.uploadedFiles = row.media_infos.map(media => ({
      ...media,
      // 兼容字段映射
      media_type: media.media_type,
      media_url: media.media_url,
      fileId: media.file_id,
      visitUrl: media.media_url
    }));
    
    // 设置图标预览
    const iconMedia = row.media_infos.find(m => m.media_type === 1);
    if (iconMedia) {
      iconPreview.value = iconMedia.media_url;
    }
    
    // 设置APK文件
    const apkMedia = row.media_infos.find(m => m.media_type === 4);
    if (apkMedia) {
      apkFile.value = apkMedia;
    }
    
    // 设置游戏链接（如果有的话，需要从其他地方获取）
    // 这里可能需要根据实际的数据结构来设置
  }
  
  state.isShowDialog = true;
};

// 关闭弹窗
const onCancel = () => {
  state.isShowDialog = false;
  resetForm();
};

// 重置表单
const resetForm = () => {
  state.iconFile = null;
  state.screenshotFiles = [];
  state.uploadProgress = 0;
  state.uploadedFiles = [];
  iconPreview.value = '';
  apkFile.value = null;
  gameLink.value = '';
  
  // 重置预览相关变量
  previewVisible.value = false;
  previewImageUrl.value = '';
  previewVideoUrl.value = '';
  isVideoPreview.value = false;
  previewTitle.value = '媒体预览';
};

// 图标上传前验证
const beforeIconUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  if (!isValidType) {
    ElMessage.error('图标只能是 JPG/PNG/GIF 格式!');
    return false;
  }
  
  const isValidSize = file.size / 1024 / 1024 <= 2;
  if (!isValidSize) {
    ElMessage.error('图标大小不能超过 2MB!');
    return false;
  }
  
  return false; // 阻止自动上传
};

// APK上传前验证
const beforeApkUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = file.type === 'application/vnd.android.package-archive' || file.name.endsWith('.apk');
  if (!isValidType) {
    ElMessage.error('只能选择APK文件!');
    return false;
  }
  
  const isValidSize = file.size / 1024 / 1024 <= 100;
  if (!isValidSize) {
    ElMessage.error('APK文件大小不能超过 100MB!');
    return false;
  }
  
  return false; // 阻止自动上传
};

// 图片上传前验证
const beforeImageUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
  if (!isValidType) {
    ElMessage.error('只能选择 JPG/PNG/GIF 格式的图片!');
    return false;
  }
  
  const isValidSize = file.size / 1024 / 1024 <= 5;
  if (!isValidSize) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  
  return false; // 阻止自动上传
};

// 视频上传前验证
const beforeVideoUpload: UploadProps['beforeUpload'] = (file) => {
  const isValidType = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv'].includes(file.type) || 
                      file.name.toLowerCase().match(/\.(mp4|avi|mov|wmv|flv|mkv|webm)$/);
  
  if (!isValidType) {
    ElMessage.error('只能选择 MP4/AVI/MOV 等格式的视频!');
    return false;
  }
  
  const isValidSize = file.size / 1024 / 1024 <= 50;
  if (!isValidSize) {
    ElMessage.error('视频大小不能超过 50MB!');
    return false;
  }
  
  return false; // 阻止自动上传
};

// 处理APK选择 - 选择后立即上传
const handleApkChange = async (uploadFile: UploadUserFile) => {
  if (uploadFile.raw) {
    const mediaInfo: TGameMediaInfo = {
      media_type: 4, // APK类型
      media_url: 'temp', // 临时占位
      fileName: uploadFile.raw.name,
      fileSize: uploadFile.raw.size,
      contentType: uploadFile.raw.type
    };
    apkFile.value = mediaInfo;
    
    // 立即开始上传
    await uploadSingleFile(mediaInfo, uploadFile.raw, 2);
  }
};

// 处理图标选择 - 选择后立即上传
const handleIconChange = async (uploadFile: UploadUserFile) => {
  if (uploadFile.raw) {
    state.iconFile = {
      media_type: 1, // 图标类型
      media_url: 'temp', // 临时占位
      fileName: uploadFile.raw.name,
      fileSize: uploadFile.raw.size,
      contentType: uploadFile.raw.type
    };
    
    // 立即开始上传
    await uploadSingleFile(state.iconFile, uploadFile.raw, 0);
  }
};

// 处理图片选择 - 选择后立即上传
const handleImageChange = async (uploadFile: UploadUserFile) => {
  if (uploadFile.raw) {
    // 检查是否已经存在相同名称的图片文件
    const existingFile = state.uploadedFiles.find(f => 
      f.media_type === 2 && 
      (f.fileName === uploadFile.raw!.name || f.originalName === uploadFile.raw!.name)
    );
    
    if (existingFile) {
      ElMessage.warning('该图片文件已存在，请选择其他文件');
      return;
    }
    
    const mediaInfo: TGameMediaInfo = {
      media_type: 2, // 图片类型
      media_url: 'temp', // 临时占位
      fileName: uploadFile.raw.name,
      fileSize: uploadFile.raw.size,
      contentType: uploadFile.raw.type
    };
    
    // 立即开始上传
    await uploadSingleFile(mediaInfo, uploadFile.raw, 1);
  }
};

// 处理视频选择 - 选择后立即上传
const handleVideoChange = async (uploadFile: UploadUserFile) => {
  if (uploadFile.raw) {
    // 检查是否已经存在相同名称的视频文件
    const existingFile = state.uploadedFiles.find(f => 
      f.media_type === 3 && 
      (f.fileName === uploadFile.raw!.name || f.originalName === uploadFile.raw!.name)
    );
    
    if (existingFile) {
      ElMessage.warning('该视频文件已存在，请选择其他文件');
      return;
    }
    
    const mediaInfo: TGameMediaInfo = {
      media_type: 3, // 视频类型
      media_url: 'temp', // 临时占位
      fileName: uploadFile.raw.name,
      fileSize: uploadFile.raw.size,
      contentType: uploadFile.raw.type
    };
    
    // 立即开始上传
    await uploadSingleFile(mediaInfo, uploadFile.raw, 1);
  }
};

// 移除媒体文件
const removeMaterial = (file: TGameMediaInfo) => {
  console.log('准备移除文件:', file);
  console.log('移除前uploadedFiles长度:', state.uploadedFiles.length);
  
  const index = state.uploadedFiles.findIndex(f => 
    (f.file_id && f.file_id === file.file_id) || 
    (f.fileId && f.fileId === file.fileId) ||
    (f.originalName && f.originalName === file.originalName && f.media_type === file.media_type)
  );
  
  console.log('找到的索引:', index);
  
  if (index > -1) {
    const removedFile = state.uploadedFiles.splice(index, 1)[0];
    console.log('已移除文件:', removedFile);
    console.log('移除后uploadedFiles长度:', state.uploadedFiles.length);
    ElMessage.success('媒体文件已移除');
    
    // 如果是图标文件，同时清除图标相关状态
    if (file.media_type === 1) {
      state.iconFile = null;
      iconPreview.value = '';
      console.log('已清除图标状态');
    }
    
    // 如果是APK文件，同时清除APK相关状态
    if (file.media_type === 4) {
      apkFile.value = null;
      console.log('已清除APK状态');
    }
  } else {
    console.log('未找到要移除的文件');
    ElMessage.warning('未找到要移除的文件');
  }
};

// 上传单个文件
const uploadSingleFile = async (mediaInfo: TGameMediaInfo, file: File, type: 0 | 1 | 2) => {
  try {
    // 获取上传地址
    const uploadResponse: any = await uploadTGameMediaInfo(gameId.value || 0, {
      type: mediaInfo.media_type,
      file_name: mediaInfo.fileName,
      file_size: mediaInfo.fileSize,
      content_type: mediaInfo.contentType
    });
    
    if (uploadResponse.code !== 0) {
      throw new Error(uploadResponse.message || '获取上传地址失败');
    }

    const uploadData = uploadResponse.data;
    state.uploadProgress = 20;

    // 上传文件到指定地址
    const response = await fetch(uploadData.upload_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    if (!response.ok) {
      throw new Error(`文件 ${mediaInfo.fileName} 上传失败`);
    }

    // 上报上传结果
    await reportTGameMediaUploadResult(uploadData.id, { success: true });

    // 保存上传成功的文件信息
    const uploadedFile: TGameMediaInfo = {
      media_type: mediaInfo.media_type,
      media_url: uploadData.visit_url, // 使用visit_url作为预览地址
      fileName: mediaInfo.fileName,
      fileSize: mediaInfo.fileSize,
      contentType: mediaInfo.contentType,
      fileId: uploadData.id,
      originalName: uploadData.original_name,
      uploadUrl: uploadData.upload_url,
      visitUrl: uploadData.visit_url
    };

    // 对于图标和APK，替换相同类型的文件；对于图片和视频，追加到列表
    if (mediaInfo.media_type === 1 || mediaInfo.media_type === 4) {
      // 图标和APK只能有一个，替换现有的
      const existingIndex = state.uploadedFiles.findIndex(f => f.media_type === mediaInfo.media_type);
      if (existingIndex > -1) {
        state.uploadedFiles[existingIndex] = uploadedFile;
      } else {
        state.uploadedFiles.push(uploadedFile);
      }
    } else {
      // 图片和视频可以有多个，直接追加
      state.uploadedFiles.push(uploadedFile);
    }

    state.uploadProgress = 100;
    ElMessage.success(`文件 ${mediaInfo.fileName} 上传成功`);
    
    if(type === 0) {
      // 图标文件
      iconPreview.value = uploadData.visit_url;
      // 更新iconFile，确保canUpload能正确计算
      state.iconFile = uploadedFile;
    } else if(type === 2) {
      // APK文件
      apkFile.value = uploadedFile;
    } else {
      // 图片或视频文件 - 不要重复添加到screenshotFiles，因为已经在uploadedFiles中了
      // state.screenshotFiles.push(uploadedFile); // 注释掉这行，避免重复
    }

  } catch (error: any) {
    console.error(`文件 ${mediaInfo.fileName} 上传失败:`, error);
    ElMessage.error(`文件 ${mediaInfo.fileName} 上传失败: ${error.message}`);
    
    // 上传失败时从选择列表中移除
    if (mediaInfo.media_type === 1) {
      state.iconFile = null;
      iconPreview.value = '';
    } else {
      // 从uploadedFiles中移除失败的文件
      const index = state.uploadedFiles.findIndex(f => f.fileName === mediaInfo.fileName);
      if (index > -1) {
        state.uploadedFiles.splice(index, 1);
      }
    }
  } finally {
    state.uploadProgress = 0;
  }
};

// 格式化进度条
const format = (percentage: number) => {
  return percentage === 100 ? '完成' : `${percentage}%`;
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 预览媒体文件
const previewMedia = (url?: string, isVideo: boolean = false, fileName?: string) => {
  if (url) {
    if (isVideo) {
      previewVideoUrl.value = url;
      previewImageUrl.value = '';
      isVideoPreview.value = true;
      previewTitle.value = `视频预览 - ${fileName || '未知文件'}`;
    } else {
      previewImageUrl.value = url;
      previewVideoUrl.value = '';
      isVideoPreview.value = false;
      previewTitle.value = `图片预览 - ${fileName || '未知文件'}`;
    }
    previewVisible.value = true;
  }
};

// 预览图片（保持向后兼容）
const previewImage = (url?: string) => {
  previewMedia(url, false);
};

// 保存媒体信息
const handleUpload = async () => {
  if (!canUpload.value) {
    if (gameDistributeType.value === 1) {
      ElMessage.error('请选择游戏图标、宣传素材和APK文件');
    } else {
      ElMessage.error('请选择游戏图标、宣传素材和游戏链接');
    }
    return;
  }

  // 检查是否所有文件都已上传
  if (state.uploadedFiles.length === 0) {
    ElMessage.error('请先选择文件进行上传');
    return;
  }

  // 验证分发方式相关的内容
  if (gameDistributeType.value === 1 && !apkFile.value) {
    ElMessage.error('请选择APK文件');
    return;
  }
  
  if (gameDistributeType.value === 2 && !gameLink.value.trim()) {
    ElMessage.error('请输入游戏链接');
    return;
  }

  try {
    state.loading = true;
    
    console.log('准备保存，当前uploadedFiles:', state.uploadedFiles);
    console.log('当前uploadedFiles长度:', state.uploadedFiles.length);
    
    // 准备要保存的媒体信息数据
    const mediaInfoData = state.uploadedFiles.map(file => ({
      media_type: file.media_type,
      file_id: file.fileId || file.file_id,
      media_url: file.media_url || file.visitUrl
    }));
    
    console.log('准备提交的媒体信息数据:', mediaInfoData);
    console.log('提交数据长度:', mediaInfoData.length);

    // 调用保存接口
    const response: any = await saveTGameMediaInfo(gameId.value || 0, {
      media_infos: mediaInfoData
    });

    if (response.code === 0) {
      ElMessage.success('媒体信息保存成功！');
      // 延迟关闭弹窗
      setTimeout(() => {
        onCancel();
        emit('tGameList');
      }, 1500);
    } else {
      ElMessage.error(response.message || '保存失败');
    }
  } catch (error: any) {
    console.error('保存媒体信息失败:', error);
    ElMessage.error('保存失败: ' + error.message);
  } finally {
    state.loading = false;
  }
};

// 根据文件名获取文件对象
const getFileByName = (fileName: string): File | null => {
  // 从图标上传组件获取文件
  if (iconFile.value?.fileName === fileName) {
    const iconFiles = iconUploadRef.value?.uploadFiles || [];
    const file = iconFiles.find((f: any) => f.name === fileName);
    return file?.raw || null;
  }
  
  // 从图片上传组件获取文件
  const imageFiles = imageUploadRef.value?.uploadFiles || [];
  const file = imageFiles.find((f: any) => f.name === fileName);
  return file?.raw || null;
};

// 暴露方法
defineExpose({
  openDialog
});
</script>

<style lang="scss" scoped>
.system-tGame-mediaInfo {
  .icon-upload-container {
    display: flex;
    align-items: flex-start;
    gap: 30px;
  }

  .distribute-upload-container {
    .apk-upload-section,
    .link-input-section {
      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #e4e7ed;
        padding-bottom: 8px;
      }
    }

    .apk-uploader {
      .apk-upload-area {
        width: 200px;
        height: 120px;
        border: 2px dashed #d9d9d9;
        border-radius: 12px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: all 0.3s;
        
        &:hover {
          border-color: #409eff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
        }
      }

      .apk-upload-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #8c939d;
      }

      .apk-uploader-icon {
        font-size: 32px;
        margin-bottom: 8px;
      }

      .apk-upload-text {
        font-size: 14px;
        font-weight: 500;
      }

      .apk-file-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 16px;
        text-align: center;
        
        .apk-icon {
          font-size: 32px;
          color: #67c23a;
          margin-bottom: 8px;
        }
        
        .apk-name {
          font-size: 12px;
          color: #303133;
          font-weight: 500;
          margin-bottom: 4px;
          word-break: break-all;
        }
        
        .apk-size {
          font-size: 11px;
          color: #909399;
        }
      }
    }

    .link-input-section {
      .el-input {
        margin-bottom: 16px;
      }
    }
  }

  .icon-uploader {
    .icon-upload-area {
      width: 150px;
      height: 150px;
      border: 2px dashed #d9d9d9;
      border-radius: 12px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
      }
    }

    .icon-upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: #8c939d;
    }

    .icon-uploader-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    .icon-upload-text {
      font-size: 14px;
      font-weight: 500;
    }

    .icon-preview {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 10px;
    }
  }

  .material-row {
    margin-bottom: 32px;
    
    .material-row-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      
      h4 {
        margin: 0;
        color: #303133;
        font-size: 16px;
        font-weight: 600;
        border-bottom: 2px solid #e4e7ed;
        padding-bottom: 8px;
        flex: 1;
      }
      
      .material-uploader {
        margin-left: 20px;
        flex-shrink: 0;
      }
    }
  }

  .material-uploader {
    .material-upload-area {
      width: 150px;
      height: 150px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #8c939d;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }

    .material-upload-text {
      font-size: 12px;
      margin-top: 4px;
    }
  }

  .uploaded-materials {
    margin-top: 16px;
    
    .material-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      align-items: flex-start;
      
      .material-item {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s;
        position: relative;
        width: 200px;
        flex-shrink: 0;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .material-preview {
          width: 100%;
          height: 120px;
          object-fit: cover;
          cursor: pointer;
          transition: transform 0.2s;
          
          &:hover {
            transform: scale(1.05);
          }
        }
        
        .video-preview {
          width: 100%;
          height: 120px;
          cursor: pointer;
          transition: transform 0.2s;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            transform: scale(1.05);
          }
          
          .video-thumbnail {
            text-align: center;
            color: white;
            
            .video-play-icon {
              font-size: 32px;
              margin-bottom: 8px;
              display: block;
            }
            
            .video-label {
              font-size: 12px;
              font-weight: 500;
            }
          }
        }
        
        .material-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        
        &:hover .material-actions {
          opacity: 1;
        }
        
        .material-info {
          padding: 12px;
          
          .file-name {
            display: block;
            font-size: 12px;
            color: #303133;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }

  .upload-tip {
    flex: 1;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    border-left: 4px solid #409eff;
    
    h4 {
      margin: 0 0 12px 0;
      color: #303133;
      font-size: 14px;
      font-weight: 600;
    }
    
    p {
      margin: 6px 0;
      color: #606266;
      font-size: 13px;
      line-height: 1.5;
    }
  }

  .upload-result-info {
    margin-top: 16px;
    padding: 12px 16px;
    background: #f0f9ff;
    border-radius: 8px;
    border: 1px solid #b3d8ff;
    display: flex;
    align-items: center;
    gap: 12px;
    
    .el-tag {
      flex-shrink: 0;
    }
    
    .file-info {
      color: #606266;
      font-size: 13px;
      word-break: break-all;
      line-height: 1.4;
    }
  }



  .media-preview-container {
    text-align: center;
    
    .preview-image {
      max-width: 100%;
      max-height: 600px;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .preview-video {
      max-width: 100%;
      max-height: 600px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      background: #000;
    }
  }

  .dialog-footer {
    text-align: right;
  }
}
</style> 