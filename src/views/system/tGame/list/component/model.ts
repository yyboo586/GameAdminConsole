export interface TGameTableColumns {    
    id:number;  // 主键    
    name:string;  // 游戏名称    
    category_id:number;  // 游戏分类ID
    tag_ids:number[];  // 游戏标签ID列表
    distribute_type:number;  // 游戏分发类型(链接/APK文件)    
    developer:string;  // 开发商    
    publisher:string;  // 发行商    
    description:string;  // 游戏描述    
    details:string;  // 游戏详情    
    rating_score:number;  // 评分总分    
    rating_count:number;  // 评分次数    
    favorite_count:number;  // 收藏次数    
    download_count:number;  // 下载次数    
    create_time:string;  // 创建时间    
    update_time:string;  // 更新时间    
    media_infos?: TGameMediaInfo[]; // 游戏媒体信息列表
}


export interface TGameInfoData {    
    id:number|undefined;        // 主键    
    name:string|undefined; // 游戏名称    
    category_id?:number|undefined; // 游戏分类ID
    category?:string|undefined; // 游戏分类名称（接口返回）
    tag_ids?:number[]|undefined; // 游戏标签ID列表
    tags?:string[]|undefined; // 游戏标签名称列表（接口返回）
    distribute_type:number|undefined; // 游戏分发类型(链接/APK文件)    
    developer:string|undefined; // 开发商    
    publisher:string|undefined; // 发行商    
    description:string|undefined; // 游戏描述    
    details:string|undefined; // 游戏详情    
    rating_score?:number|undefined; // 评分总分    
    rating_count?:number|undefined; // 评分次数    
    favorite_count?:number|undefined; // 收藏次数    
    download_count?:number|undefined; // 下载次数    
    average_rating?:number|undefined; // 平均评分（接口返回）
    create_time:string|undefined; // 创建时间    
    update_time:string|undefined; // 更新时间    
}


export interface TGameTableDataState {
    ids:any[];
    tableData: {
        data: Array<TGameTableColumns>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;            
            id: number|undefined;            
            name: string|undefined;            
            distribute_type: number|undefined;            
            developer: string|undefined;            
            publisher: string|undefined;            
            description: string|undefined;            
            details: string|undefined;            
            rating_score: number|undefined;            
            rating_count: number|undefined;            
            favorite_count: number|undefined;            
            download_count: number|undefined;            
            create_time: string|undefined;            
            update_time: string|undefined;            
            dateRange: string[];
        };
    };
}


export interface TGameEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TGameInfoData;
    rules: object;
}

// 游戏媒体信息
export interface TGameMediaInfo {
    id?: number;            // 媒体信息ID
    file_id?: string;       // 文件ID
    media_type: number;     // 媒体类型(1:图标,2:图片,3:视频,4:APK文件)
    media_url: string;      // 媒体URL
    status?: number;        // 状态
    // 上传时使用的字段
    fileName?: string;      // 文件名称
    fileSize?: number;      // 文件大小
    contentType?: string;   // 文件内容类型
    uploadUrl?: string;     // 上传地址
    fileId?: string;        // 文件ID
    originalName?: string;  // 原始文件名
    visitUrl?: string;      // 访问/预览URL
}

// 上传响应数据
export interface TGameMediaUploadResponse {
    id: string;             // 文件ID
    original_name: string;  // 原始文件名
    upload_url: string;     // 上传地址
}

// 游戏媒体信息状态
export interface TGameMediaInfoState {
    loading: boolean;
    isShowDialog: boolean;
    gameId: number;
    gameName: string;
    iconFile: TGameMediaInfo | null;
    screenshotFiles: TGameMediaInfo[];
    uploadProgress: number;
    uploadedFiles: TGameMediaInfo[]; // 已上传的文件
}