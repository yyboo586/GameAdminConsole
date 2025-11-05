<template>  
  <div class="system-tGame-edit">
    <!-- 添加或修改游戏表对话框 -->
    <el-dialog v-model="isShowDialog" width="900px" :close-on-click-modal="false" :destroy-on-close="true">
      <template #header>
        <div v-drag="['.system-tGame-edit .el-dialog', '.system-tGame-edit .el-dialog__header']">{{(!formData.id ? '添加' : '修改') + '游戏表'}}</div>
      </template>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="120px">        
        <el-form-item label="游戏名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入游戏名称" />
        </el-form-item>
        <el-form-item label="游戏分类" prop="category_id">
          <el-select filterable clearable v-model="formData.category_id" placeholder="请选择游戏分类">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="String(item.id)"
            />
          </el-select>
        </el-form-item>

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
              :value="String(item.id)"
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
        
        <!-- 游戏图标上传 -->
        <el-form-item label="游戏图标" prop="icon_file">
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleIconChange"
            :before-upload="beforeIconUpload"
            accept="image/*"
          >
            <img v-if="iconPreviewUrl" :src="iconPreviewUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><ele-Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">支持 JPG、PNG 格式，建议尺寸 512x512，大小不超过 2MB</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 游戏宣传图上传 -->
        <el-form-item label="游戏宣传图" prop="screenshot_files">
          <el-upload
            v-model:file-list="screenshotFileList"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="handleScreenshotChange"
            :on-remove="handleScreenshotRemove"
            :before-upload="beforeScreenshotUpload"
            accept="image/*"
            :limit="10"
          >
            <el-icon><ele-Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">支持 JPG、PNG 格式，每张图片大小不超过 5MB，最多上传 10 张</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 游戏宣传视频上传 -->
        <el-form-item label="游戏宣传视频" prop="video_file">
          <el-upload
            v-model:file-list="videoFileList"
            class="video-uploader"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleVideoChange"
            :on-remove="handleVideoRemove"
            :before-upload="beforeVideoUpload"
            accept="video/*"
            :limit="1"
          >
            <el-button type="primary"><el-icon><ele-UploadFilled /></el-icon>选择视频文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 MP4、AVI 格式，大小不超过 100MB</div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 游戏本体上传或链接输入 -->
        <el-form-item 
          v-if="Number(formData.distribute_type) === 1" 
          label="游戏本体(APK)" 
          prop="apk_file"
        >
          <el-upload
            v-model:file-list="apkFileList"
            class="apk-uploader"
            :auto-upload="false"
            :show-file-list="true"
            :on-change="handleApkChange"
            :on-remove="handleApkRemove"
            :before-upload="beforeApkUpload"
            accept=".apk"
            :limit="1"
          >
            <el-button type="primary"><el-icon><ele-UploadFilled /></el-icon>选择APK文件</el-button>
            <template #tip>
              <div class="el-upload__tip">支持 APK 格式，大小不超过 500MB</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item 
          v-if="Number(formData.distribute_type) === 2" 
          label="游戏链接" 
          prop="h5_link"
        >
          <el-input v-model="formData.h5_link" placeholder="请输入游戏链接地址" />
        </el-form-item>

       
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="onSubmit" :disabled="loading || uploading">
            {{ uploading ? '上传中...' : '确 定' }}
          </el-button>
          <el-button @click="onCancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { reactive, toRefs, ref, unref, getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage, FormInstance, UploadProps, UploadUserFile } from 'element-plus';
import { listTCategory } from '/@/api/system/tCategory';
import { listTTag } from '/@/api/system/tTag';
import { addTGame, updateTGame } from "/@/api/system/tGame";
import {
  addGameFile,
  reportFileUploadResult
} from "/@/api/system/tGameFile";
import {
  TGameTableColumns,
  TGameInfoData,
  TGameEditState,
  TGameFileInfo
} from "/@/views/system/tGame/list/component/model"
defineOptions({ name: "ApiV1SystemTGameEdit"})
const emit = defineEmits(['tGameList'])
const {proxy} = <any>getCurrentInstance()
const formRef = ref<HTMLElement | null>(null);
const menuRef = ref();
const categoryList = ref<any[]>([]);
const tagList = ref<any[]>([]);
const optionsLoading = ref(false);

// 文件上传相关状态
const iconFile = ref<File | null>(null);
const iconPreviewUrl = ref<string>('');
const screenshotFileList = ref<UploadUserFile[]>([]);
const videoFileList = ref<UploadUserFile[]>([]);
const apkFileList = ref<UploadUserFile[]>([]);
const uploading = ref(false);
const resolveFileUrl = (url?: string) => {
  if (!url) return '';
  if (proxy && typeof proxy.getUpFileUrl === 'function') {
    return proxy.getUpFileUrl(url);
  }
  return url;
};

const generateUid = (seed?: string | number) => {
  if (typeof seed === 'number') return seed;
  if (typeof seed === 'string') {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    return absHash === 0 ? Date.now() : absHash;
  }
  return Date.now();
};

const createUploadUserFile = (fileInfo: TGameFileInfo, defaultLabel: string): UploadUserFile => {
  const fileId = fileInfo.file_id || defaultLabel;
  return {
    name: fileInfo.file_name || defaultLabel,
    url: resolveFileUrl(fileInfo.file_link),
    status: 'success',
    uid: generateUid(fileId),
    response: {
      file_id: fileInfo.file_id
    } as any
  };
};

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
    h5_link: undefined,  // 游戏链接（当分发类型为链接时）
    icon_file: null as TGameFileInfo | null,
    feature_images: [] as TGameFileInfo[],
    video_file: null as TGameFileInfo | null,
    apk_file: null as TGameFileInfo | null,
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
    h5_link: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (state.formData.distribute_type === 2 && !value) {
            callback(new Error('游戏链接不能为空'));
          } else {
            callback();
          }
        },
        trigger: 'blur'
      }
    ],
    apk_file: [
      {
        validator: (rule: any, value: any, callback: any) => {
          if (Number(state.formData.distribute_type) === 1 && !state.formData.apk_file) {
            callback(new Error('APK文件不能为空'));
          } else {
            callback();
          }
        },
        trigger: 'change'
      }
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
  loadOptions().then(() => {
    if (row) {
      applyRow(row);
    } else {
      iconPreviewUrl.value = '';
      screenshotFileList.value = [];
      videoFileList.value = [];
      apkFileList.value = [];
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
const onSubmit = async () => {
  const formWrap = unref(formRef) as any;
  if (!formWrap) return;
  if (uploading.value) {
    ElMessage.warning('文件上传中，请稍候');
    return;
  }

  if (!state.formData.icon_file) {
    ElMessage.error('请上传游戏图标');
    return;
  }

  if (!state.formData.feature_images || state.formData.feature_images.length === 0) {
    ElMessage.error('请至少上传一张宣传图');
    return;
  }
  
  // 验证 APK 文件（如果是 APK 类型）
  if (Number(state.formData.distribute_type) === 1 && !state.formData.apk_file) {
    ElMessage.error('请上传APK文件');
    return;
  }
  
  // 验证游戏链接（如果是链接类型）
  if (Number(state.formData.distribute_type) === 2 && !state.formData.h5_link) {
    ElMessage.error('请输入游戏链接');
    return;
  }
  
  formWrap.validate((valid: boolean) => {
    if (valid) {
      state.loading = true;
      const payload = prepareSubmitPayload();
      if (!state.formData.id) {
        addTGame(payload).then(()=>{
          ElMessage.success('添加成功');
          closeDialog(); // 关闭弹窗
          emit('tGameList')
        }).finally(()=>{
          state.loading = false;
        })
      }else{
        updateTGame(state.formData.id, payload).then(()=>{
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
    h5_link: undefined,
    icon_file: null,
    feature_images: [] as TGameFileInfo[],
    video_file: null,
    apk_file: null,
    rating_score: undefined,    
    rating_count: undefined,    
    favorite_count: undefined,    
    download_count: undefined,    
    create_time: undefined,    
    update_time: undefined,    
  };
  iconPreviewUrl.value = '';
  screenshotFileList.value = [];
  videoFileList.value = [];
  apkFileList.value = [];
};

const prepareSubmitPayload = () => ({
  ...state.formData,
  category_id: state.formData.category_id ? Number(state.formData.category_id) : undefined,
  tag_ids: Array.isArray(state.formData.tag_ids) ? state.formData.tag_ids.map(id => Number(id)) : [],
  distribute_type: state.formData.distribute_type ? Number(state.formData.distribute_type) : undefined,
  icon_file: state.formData.icon_file,
  feature_images: state.formData.feature_images,
  video_file: state.formData.video_file,
  apk_file: state.formData.apk_file,
});

const loadOptions = () => {
  if (optionsLoading.value) return Promise.resolve();
  optionsLoading.value = true;
  return Promise.all([listTCategory({}), listTTag({})])
    .then(([categoryRes, tagRes]) => {
      categoryList.value = categoryRes?.data?.list || [];
      tagList.value = tagRes?.data?.list || [];
    })
    .catch(() => {})
    .finally(() => {
      optionsLoading.value = false;
    });
};

const applyRow = (row: TGameInfoData) => {
  const categoryId = (() => {
    if (row.category_id !== undefined && row.category_id !== null) return String(row.category_id);
    if (row.category && typeof row.category === 'object' && row.category.id) return String(row.category.id);
    if (typeof row.category === 'string') {
      const match = categoryList.value.find((item: any) => item.name === row.category);
      if (match) return String(match.id);
    }
    return undefined;
  })();

  const tagIds = (() => {
    const result: string[] = [];
    if (Array.isArray(row.tag_ids) && row.tag_ids.length) {
      return row.tag_ids.map(id => String(id)).filter(Boolean);
    }
    if (Array.isArray(row.tags)) {
      row.tags.forEach((tag: any) => {
        if (tag && typeof tag === 'object' && tag.id) {
          result.push(String(tag.id));
        } else if (typeof tag === 'string') {
          const match = tagList.value.find((item: any) => item.name === tag);
          if (match) result.push(String(match.id));
        }
      });
    }
    return result;
  })();

  const distributeType = (() => {
    const raw = row.distribute_type as any;
    if (typeof raw === 'number') return raw;
    if (typeof raw === 'string') {
      const upper = raw.toUpperCase();
      if (upper === 'APK') return 1;
      if (raw === '链接' || upper === 'H5') return 2;
      const parsed = Number(raw);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return undefined;
  })();

  state.formData = {
    ...state.formData,
    ...row,
    category_id: categoryId,
    tag_ids: tagIds,
    distribute_type: distributeType,
    icon_file: row.icon_file ?? null,
    feature_images: row.feature_images ?? [],
    video_file: row.video_file ?? null,
    apk_file: row.apk_file ?? null,
  } as TGameInfoData;

  iconPreviewUrl.value = state.formData.icon_file?.file_link ? resolveFileUrl(state.formData.icon_file.file_link) : '';
  screenshotFileList.value = (state.formData.feature_images || []).map((item) =>
    createUploadUserFile(item, item.file_name || item.file_id || 'feature-image')
  );
  videoFileList.value = state.formData.video_file
    ? [createUploadUserFile(state.formData.video_file, state.formData.video_file.file_name || 'video-file')]
    : [];
  apkFileList.value = state.formData.apk_file
    ? [createUploadUserFile(state.formData.apk_file, state.formData.apk_file.file_name || 'apk-file')]
    : [];
};

// 文件上传处理函数
// 游戏图标上传
const beforeIconUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt2M = file.size / 1024 / 1024 < 2;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!');
    return false;
  }
  return false; // 阻止自动上传
};

const uploadAndBuildFileInfo = async (file: File, fallbackContentType: string): Promise<TGameFileInfo | null> => {
  const contentType = file.type || fallbackContentType;
  const fileId = await uploadFile(file, contentType);
  if (!fileId) {
    return null;
  }
  return {
    file_id: fileId,
    file_name: file.name,
    file_type: contentType,
  };
};

const handleIconChange: UploadProps['onChange'] = async (uploadFile) => {
  if (!uploadFile || !uploadFile.raw) return;
  iconFile.value = uploadFile.raw as File;
  const reader = new FileReader();
  reader.onload = (e) => {
    iconPreviewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(iconFile.value);

  uploading.value = true;
  const fileInfo = await uploadAndBuildFileInfo(iconFile.value, 'image/png');
  uploading.value = false;
  if (!fileInfo) {
    iconFile.value = null;
    return;
  }
  state.formData.icon_file = fileInfo;
};

// 游戏宣传图上传
const beforeScreenshotUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!');
    return false;
  }
  return false; // 阻止自动上传
};

const handleScreenshotChange: UploadProps['onChange'] = async (uploadFile, uploadFiles) => {
  if (!uploadFile) return;
  if (uploadFile.status === 'ready' && uploadFile.raw) {
    uploading.value = true;
    const newFileInfo = await uploadAndBuildFileInfo(uploadFile.raw as File, 'image/png');
    uploading.value = false;
    if (!newFileInfo) {
      screenshotFileList.value = screenshotFileList.value.filter(item => (item as any)?.response?.file_id !== (uploadFile as any)?.response?.file_id);
      return;
    }
    const previewUrl = URL.createObjectURL(uploadFile.raw as File);
    const newUploadFile: UploadUserFile = {
      name: uploadFile.name,
      status: 'success',
      url: previewUrl,
      uid: generateUid(newFileInfo.file_id || uploadFile.uid),
      response: { file_id: newFileInfo.file_id } as any,
    };
    const filtered = screenshotFileList.value.filter(item => (item as any)?.response?.file_id !== newFileInfo.file_id && item.uid !== uploadFile.uid);
    screenshotFileList.value = [...filtered, newUploadFile];
    const featureImages = (state.formData.feature_images || []).filter(item => item.file_id !== newFileInfo.file_id);
    featureImages.push(newFileInfo);
    state.formData.feature_images = featureImages;
  } else if (uploadFiles) {
    screenshotFileList.value = uploadFiles.map((item: any) => ({
      ...item,
      uid: generateUid(item?.response?.file_id || item.uid),
      status: item.status || 'success',
    }));
    const oldFeatureImages = state.formData.feature_images || [];
    state.formData.feature_images = screenshotFileList.value
      .map((item: any) => {
        const fileId = item?.response?.file_id as string | undefined;
        if (!fileId) return null;
        const existing = oldFeatureImages.find(file => file.file_id === fileId);
        return existing || {
          file_id: fileId,
          file_name: item?.name,
          file_type: undefined,
        } as TGameFileInfo;
      })
      .filter((item): item is TGameFileInfo => !!item);
  }
};

const handleScreenshotRemove = (file: UploadUserFile) => {
  const fileId = (file as any)?.response?.file_id as string | undefined;
  if (fileId) {
    screenshotFileList.value = screenshotFileList.value.filter(item => (item as any)?.response?.file_id !== fileId);
    state.formData.feature_images = (state.formData.feature_images || []).filter(item => item.file_id !== fileId);
  } else {
    screenshotFileList.value = screenshotFileList.value.filter(item => item.uid !== file.uid);
  }
};

// 游戏宣传视频上传
const beforeVideoUpload: UploadProps['beforeUpload'] = (file) => {
  const isVideo = file.type.startsWith('video/');
  const isLt100M = file.size / 1024 / 1024 < 100;
  
  if (!isVideo) {
    ElMessage.error('只能上传视频文件!');
    return false;
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB!');
    return false;
  }
  return false; // 阻止自动上传
};

const handleVideoChange: UploadProps['onChange'] = async (uploadFile) => {
  if (!uploadFile || uploadFile.status !== 'ready' || !uploadFile.raw) return;
  uploading.value = true;
  const fileInfo = await uploadAndBuildFileInfo(uploadFile.raw as File, 'video/mp4');
  uploading.value = false;
  if (!fileInfo) {
    return;
  }
  state.formData.video_file = fileInfo;
  const previewUrl = URL.createObjectURL(uploadFile.raw as File);
  videoFileList.value = [{
    name: uploadFile.name,
    status: 'success',
    url: previewUrl,
    uid: generateUid(fileInfo.file_id || uploadFile.uid),
    response: { file_id: fileInfo.file_id } as any,
  }];
};

const handleVideoRemove = () => {
  state.formData.video_file = null;
  videoFileList.value = [];
};

// 游戏本体APK上传
const beforeApkUpload: UploadProps['beforeUpload'] = (file) => {
  const isApk = file.name.endsWith('.apk');
  const isLt500M = file.size / 1024 / 1024 < 500;
  
  if (!isApk) {
    ElMessage.error('只能上传APK文件!');
    return false;
  }
  if (!isLt500M) {
    ElMessage.error('APK文件大小不能超过 500MB!');
    return false;
  }
  return false; // 阻止自动上传
};

const handleApkChange: UploadProps['onChange'] = async (uploadFile) => {
  if (!uploadFile || uploadFile.status !== 'ready' || !uploadFile.raw) return;
  uploading.value = true;
  const fileInfo = await uploadAndBuildFileInfo(uploadFile.raw as File, 'application/vnd.android.package-archive');
  uploading.value = false;
  if (!fileInfo) {
    return;
  }
  state.formData.apk_file = fileInfo;
  apkFileList.value = [{
    name: uploadFile.name,
    status: 'success',
    uid: generateUid(fileInfo.file_id || uploadFile.uid),
    response: { file_id: fileInfo.file_id } as any,
  }];
};

const handleApkRemove = () => {
  apkFileList.value = [];
  state.formData.apk_file = null;
};

// 上传文件到服务器
const uploadFile = async (file: File, contentType: string): Promise<string | null> => {
  try {
    const normalizedContentType = contentType || 'application/octet-stream';
    // 1. 获取上传URL
    const uploadInfoRes = await addGameFile({
      file_size: file.size,
      file_name: file.name,
      content_type: normalizedContentType
    });
    
    if (!uploadInfoRes.data || !uploadInfoRes.data.upload_url || !uploadInfoRes.data.file_id) {
      ElMessage.error('获取上传地址失败');
      return null;
    }
    
    const { upload_url, file_id } = uploadInfoRes.data;
    
    // 2. PUT 上传文件
    const uploadResponse = await fetch(upload_url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': normalizedContentType,
      }
    });
    
    if (!uploadResponse.ok) {
      ElMessage.error('文件上传失败');
      await reportFileUploadResult(file_id, false);
      return null;
    }
    
    // 3. 报告上传结果
    await reportFileUploadResult(file_id, true);
    
    return file_id;
  } catch (error: any) {
    ElMessage.error('文件上传失败: ' + (error.message || '未知错误'));
    return null;
  }
};
</script>
<style scoped>  
  .kv-label{margin-bottom: 15px;font-size: 14px;}
  .mini-btn i.el-icon{margin: unset;}
  .kv-row{margin-bottom: 12px;}
  
  /* 游戏图标上传样式 */
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }
    :deep(.el-upload:hover) {
      border-color: var(--el-color-primary);
    }
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    text-align: center;
    line-height: 128px;
  }
  
  /* 视频和APK上传样式 */
  .video-uploader,
  .apk-uploader {
    :deep(.el-upload) {
      display: inline-block;
    }
  }
</style>