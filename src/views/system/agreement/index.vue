<template>
	<div class="agreement-page">
		<div class="page-header">
			<div>
				<h1>协议管理</h1>
				<p>无需重新构建后台即可查看、创建与编辑协议版本，默认与 <code>/api/v1/system/agreement</code> 接口联动。</p>
			</div>
			<el-select v-model="selectedName" placeholder="选择协议" class="name-select" @change="handleNameChange">
				<el-option v-for="option in agreementNames" :key="option" :label="option" :value="option" />
			</el-select>
		</div>

		<section class="agreement-section">
			<div class="section-header">
				<h2>最新协议</h2>
				<div class="actions">
					<el-button type="primary" :loading="latestLoading" @click="loadLatest">查看最新协议</el-button>
					<el-button type="warning" plain :loading="listLoading" @click="loadList">刷新列表</el-button>
				</div>
			</div>
			<el-empty v-if="!latestAgreement && !latestLoading" description="暂无协议" />
			<div v-else class="content-preview" v-loading="latestLoading">
				<h3 v-if="latestAgreement">
					{{ latestAgreement.name }} <span v-if="latestAgreement.version">v{{ latestAgreement.version }}</span>
				</h3>
				<div class="meta">
					<span>状态: <el-tag :type="statusTagType(latestAgreement?.status)">{{ statusText(latestAgreement?.status) }}</el-tag></span>
					<span>发布时间: {{ formatPublishedAt(latestAgreement?.published_at) }}</span>
				</div>
				<div class="preview-html" v-html="latestAgreement?.content || '暂无内容'"></div>
			</div>
		</section>

		<section class="agreement-section">
			<div class="section-header">
				<h2>版本列表</h2>
				<div class="muted">最多显示最新 50 条记录</div>
			</div>
			<el-table :data="tableData" border stripe :loading="listLoading" class="agreement-table">
				<el-table-column prop="id" label="ID" min-width="120" show-overflow-tooltip />
				<el-table-column prop="version" label="版本号" min-width="120" />
				<el-table-column prop="status" label="状态" min-width="120">
					<template #default="{ row }">
						<el-tag :type="statusTagType(row.status)">{{ statusText(row.status) }}</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="published_at" label="发布时间" min-width="180">
					<template #default="{ row }">
						{{ formatPublishedAt(row.published_at) }}
					</template>
				</el-table-column>
				<el-table-column label="操作" width="120" fixed="right">
					<template #default="{ row }">
						<el-button link type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
					</template>
				</el-table-column>
				<template #empty>
					<el-empty description="暂无记录" />
				</template>
			</el-table>
		</section>

		<section class="agreement-section">
			<div class="section-header">
				<h2>编辑 / 新增</h2>
				<div class="muted">切换协议后不会自动清空草稿，请在提交前确认版本号与内容。</div>
			</div>
			<el-form label-position="top" class="editor-form">
				<el-form-item label="版本号 (如 1.0.0)">
					<el-input v-model="versionInput" placeholder="1.0.0" />
				</el-form-item>
				<el-form-item label="协议内容（富文本）">
					<wng-editor v-model="editorHtml" height="280px" />
				</el-form-item>
				<el-form-item label="HTML 源码（只读）">
					<el-input v-model="rawHtml" type="textarea" :rows="6" readonly placeholder="HTML 源码会显示在这里，便于复制/保存" />
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="publishNow">立即发布</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="creating" @click="createAgreementHandler">创建新版本</el-button>
					<el-button type="warning" :disabled="!currentEditingId" :loading="updating" @click="updateAgreementHandler">更新当前版本</el-button>
					<el-button @click="resetForm">重置</el-button>
				</el-form-item>
				<div v-if="message.text" class="message" :class="message.type">{{ message.text }}</div>
			</el-form>
		</section>
	</div>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import WngEditor from '/@/components/editor/index.vue';
import {
	createAgreement,
	getAgreementDetail,
	getAgreementLatest,
	getAgreementList,
	updateAgreement,
} from '/@/api/system/agreement';
import { formatDate } from '/@/utils/formatTime';

interface AgreementItem {
	id: string | number;
	name: string;
	version: string;
	status: number;
	published_at?: number | string | null;
	content: string;
}

const agreementNames = ref(['用户服务协议', '隐私保护协议', '支付协议']);
const selectedName = ref(agreementNames.value[0]);

const tableData = ref<AgreementItem[]>([]);
const latestAgreement = ref<AgreementItem | null>(null);
const latestLoading = ref(false);
const listLoading = ref(false);
const creating = ref(false);
const updating = ref(false);

const versionInput = ref('');
const editorHtml = ref('<p>在此输入富文本内容...</p>');
const rawHtml = ref(editorHtml.value);
const publishNow = ref(false);
const currentEditingId = ref<string | number | null>(null);

const message = reactive({
	text: '',
	type: 'success',
});

const statusMap: Record<number, string> = {
	0: '草稿',
	1: '已发布',
	2: '已归档',
};

const statusTypeMap: Record<number, string> = {
	0: 'info',
	1: 'success',
	2: 'danger',
};

watch(
	() => editorHtml.value,
	(value) => {
		if (value !== rawHtml.value) rawHtml.value = value || '';
	}
);

function statusText(status?: number | null) {
	if (status === null || status === undefined) return '未知';
	return statusMap[status] ?? `状态${status}`;
}

function statusTagType(status?: number | null) {
	if (status === null || status === undefined) return 'default';
	return statusTypeMap[status] ?? 'default';
}

function formatPublishedAt(value?: number | string | null) {
	if (!value) return '-';
	const timestamp = typeof value === 'number' ? value : Number(value);
	const millis = timestamp > 1e12 ? timestamp : timestamp * 1000;
	return formatDate(new Date(millis), 'YYYY-mm-dd HH:MM:SS');
}

async function loadLatest() {
	latestLoading.value = true;
	try {
		const { data } = await getAgreementLatest({ name: selectedName.value });
		latestAgreement.value = data ?? null;
	} catch (error) {
		latestAgreement.value = null;
		showMessage((error as Error).message || '获取最新协议失败', 'error');
	} finally {
		latestLoading.value = false;
	}
}

async function loadList() {
	listLoading.value = true;
	try {
		const { data } = await getAgreementList({
			name: selectedName.value,
			page: 1,
			size: 50,
		});
		tableData.value = data?.list ?? [];
	} catch (error) {
		tableData.value = [];
		showMessage((error as Error).message || '获取协议列表失败', 'error');
	} finally {
		listLoading.value = false;
	}
}

function handleNameChange() {
	resetForm();
	loadLatest();
	loadList();
}

async function handleEdit(row: AgreementItem) {
	try {
		const { data } = await getAgreementDetail(row.id);
		if (!data) return;
		currentEditingId.value = data.id;
		versionInput.value = data.version;
		editorHtml.value = data.content || '';
		rawHtml.value = data.content || '';
		publishNow.value = data.status === 1;
		showMessage(`已加载版本 ${data.version}，可编辑后保存`, 'success');
	} catch (error) {
		showMessage((error as Error).message || '加载协议详情失败', 'error');
	}
}

async function createAgreementHandler() {
	if (!versionInput.value.trim()) {
		return ElMessage.warning('请填写版本号');
	}
	if (!editorHtml.value.trim()) {
		return ElMessage.warning('请填写协议内容');
	}
	creating.value = true;
	try {
		await createAgreement({
			name: selectedName.value,
			version: versionInput.value.trim(),
			content: editorHtml.value,
			publish_now: publishNow.value,
		});
		showMessage('创建成功', 'success');
		resetForm();
		await Promise.all([loadList(), loadLatest()]);
	} catch (error) {
		showMessage((error as Error).message || '创建协议失败', 'error');
	} finally {
		creating.value = false;
	}
}

async function updateAgreementHandler() {
	if (!currentEditingId.value) {
		return ElMessage.error('请先选择要编辑的协议版本');
	}
	updating.value = true;
	try {
		await updateAgreement(currentEditingId.value, {
			content: editorHtml.value,
			publish_now: publishNow.value,
		});
		showMessage('更新成功', 'success');
		await Promise.all([loadList(), loadLatest()]);
	} catch (error) {
		showMessage((error as Error).message || '更新协议失败', 'error');
	} finally {
		updating.value = false;
	}
}

function resetForm() {
	versionInput.value = '';
	editorHtml.value = '<p>在此输入富文本内容...</p>';
	rawHtml.value = editorHtml.value;
	publishNow.value = false;
	currentEditingId.value = null;
}

function showMessage(text: string, type: 'success' | 'error' | 'info' = 'success') {
	message.text = text;
	message.type = type;
}

loadLatest();
loadList();
</script>

<style scoped lang="scss">
.agreement-page {
	padding: 24px;
	background: #f7f9fb;
	color: #1f2a37;

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;

		h1 {
			font-size: 26px;
			margin: 0 0 6px;
			color: #1f2a37;
		}

		p {
			margin: 0;
			color: #4b5563;
		}
	}

	.name-select {
		min-width: 220px;
	}
}

.agreement-section {
	background: #fff;
	border-radius: 16px;
	padding: 20px;
	margin-bottom: 24px;
	box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	margin-bottom: 16px;

	h2 {
		margin: 0;
		font-size: 18px;
	}

	.actions {
		display: flex;
		gap: 12px;
	}

	.muted {
		color: #94a3b8;
		font-size: 13px;
	}
}

.content-preview {
	border: 1px solid #dbeafe;
	border-radius: 12px;
	padding: 18px;
	background: #fff;
	min-height: 180px;

	h3 {
		margin: 0 0 6px;
		color: #1f2937;
	}

	.meta {
		display: flex;
		gap: 24px;
		font-size: 13px;
		color: #475569;
		margin-bottom: 10px;
	}

	.preview-html {
		max-height: 320px;
		overflow: auto;
		line-height: 1.6;
	}
}

.agreement-table {
	:deep(.el-table__cell) {
		font-size: 13px;
	}
}

.editor-form {
	:deep(.el-form-item) {
		margin-bottom: 20px;
	}

	:deep(.el-input__wrapper) {
		border-radius: 10px;
	}

	:deep(.el-textarea__inner) {
		border-radius: 12px;
		font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		font-size: 13px;
	}
}

.message {
	margin-top: 8px;
	font-weight: 500;

	&.success {
		color: #15803d;
	}

	&.error {
		color: #b91c1c;
	}

	&.info {
		color: #2563eb;
	}
}
</style>

