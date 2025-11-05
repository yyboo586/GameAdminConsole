import request from '/@/utils/request';

const AgreementService = 'http://127.0.0.1:9700/api/v1/system';

export interface AgreementListParams {
	name: string;
	page?: number;
	size?: number;
}

export interface AgreementCreatePayload {
	name: string;
	version: string;
	content: string;
	publish_now?: boolean;
}

export interface AgreementUpdatePayload {
	content: string;
	publish_now?: boolean;
}

export function getAgreementLatest(params: { name: string }) {
	return request({
		url: `${AgreementService}/agreement/latest`,
		method: 'get',
		params,
	});
}

export function getAgreementList(params: AgreementListParams) {
	return request({
		url: `${AgreementService}/agreements`,
		method: 'get',
		params,
	});
}

export function getAgreementDetail(id: string | number) {
	return request({
		url: `${AgreementService}/agreement/${id}`,
		method: 'get',
	});
}

export function createAgreement(data: AgreementCreatePayload) {
	return request({
		url: `${AgreementService}/agreement`,
		method: 'post',
		data,
	});
}

export function updateAgreement(id: string | number, data: AgreementUpdatePayload) {
	return request({
		url: `${AgreementService}/agreement/${id}`,
		method: 'put',
		data,
	});
}

