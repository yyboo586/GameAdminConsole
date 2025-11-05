// 游戏审核相关的类型定义

import { TGameFileInfo } from '/@/views/system/tGame/list/component/model';

export interface TGameReviewTableColumns {    
    id:string;  // 主键    
    name:string;  // 游戏名称    
    category_id:number;  // 游戏分类ID
    category?: any;  // 游戏分类对象
    tag_ids:number[];  // 游戏标签ID列表
    tags?: Array<{id: number; name: string; create_time: string; update_time: string}>;  // 游戏标签列表
    distribute_type:number;  // 游戏分发类型(链接/APK文件)    
    developer:string;  // 开发商    
    publisher:string;  // 发行商    
    description:string;  // 游戏描述    
    details:string;  // 游戏详情    
    h5_link?: string; // H5链接
    status:string;  // 游戏状态(0:初始状态,1:审核中,2:审核通过,3:可预约,4:已上架,5:已下架)
    publish_time?:string;  // 发布时间
    reserve_count:number;  // 预约人数
    average_rating:number;  // 游戏平均评分
    rating_score:number;  // 评分总分    
    rating_count:number;  // 评分次数    
    favorite_count:number;  // 收藏次数    
    download_count:number;  // 下载次数    
    create_time:string;  // 创建时间    
    update_time:string;  // 更新时间    
    icon_file?: TGameFileInfo | null;
    feature_images?: TGameFileInfo[];
    video_file?: TGameFileInfo | null;
    apk_file?: TGameFileInfo | null;
    is_favorite?: boolean;  // 是否收藏
    is_reserve?: boolean;  // 是否预约
}

export interface TGameReviewTableDataState {
    ids:any[];
    tableData: {
        data: Array<TGameReviewTableColumns>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;            
            name: string|undefined;            
            status: string|undefined;            
            dateRange: string[];
        };
    };
}

// 审核操作状态
export interface TGameReviewState {
    loading: boolean;
    isShowDialog: boolean;
    gameId: number | undefined;
    gameName: string;
    reviewAction: 'approve' | 'reject' | '';  // 审核动作：批准或拒绝
    reviewRemark: string;  // 审核备注
}

// 详情展示状态
export interface TGameReviewDetailState {
    loading: boolean;
    isShowDialog: boolean;
    formData: {
        id: number | undefined;
        name: string | undefined;
        category_id?: number | undefined;
        category?: any;
        tag_ids?: number[] | undefined;
        tags?: Array<{id: number; name: string; create_time: string; update_time: string}>;
        distribute_type: string | undefined;
        developer: string | undefined;
        publisher: string | undefined;
        description: string | undefined;
        details: string | undefined;
        status?: string | undefined;
        publish_time?: string | undefined;
        reserve_count?: number | undefined;
        average_rating?: number | undefined;
        rating_score?: number | undefined;
        rating_count?: number | undefined;
        favorite_count?: number | undefined;
        download_count?: number | undefined;
        create_time: string | undefined;
        update_time: string | undefined;
        h5_link?: string | undefined;
        icon_file?: TGameFileInfo | null;
        feature_images?: TGameFileInfo[];
        video_file?: TGameFileInfo | null;
        apk_file?: TGameFileInfo | null;
    };
    rules: object;
}

