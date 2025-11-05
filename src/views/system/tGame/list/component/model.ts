export interface TGameFileInfo {
    file_id: string;        // 文件ID
    file_type?: string;     // 文件类型
    file_name?: string;     // 文件名称
    file_link?: string;     // 文件访问链接
    create_time?: string;   // 创建时间
    update_time?: string;   // 更新时间
}

export interface TGameTableColumns {    
    id: string;  // 主键    
    name: string;  // 游戏名称    
    distribute_type: number;  // 游戏分发类型(1:APK文件,2:链接)    
    developer: string;  // 开发商    
    publisher: string;  // 发行商    
    description: string;  // 游戏描述    
    details: string;  // 游戏详情    
    h5_link?: string;  // H5游戏链接
    
    category_id: number | string;  // 游戏分类ID
    category?: any;  // 游戏分类对象
    tag_ids: Array<number | string>;  // 游戏标签ID列表
    tags?: Array<{id: number; name: string; create_time: string; update_time: string}>;  // 游戏标签列表

    status: string;  // 游戏状态
    publish_time?: string;  // 发布时间
    reserve_count: number;  // 预约人数
    average_rating: number;  // 游戏平均评分
    rating_score: number;  // 评分总分    
    rating_count: number;  // 评分次数    
    favorite_count: number;  // 收藏次数    
    download_count: number;  // 下载次数    
    version?: number; // 版本
    create_time: string;  // 创建时间    
    update_time: string;  // 更新时间    

    icon_file?: TGameFileInfo | null;          // 图标文件
    feature_images?: TGameFileInfo[];          // 宣传图列表
    video_file?: TGameFileInfo | null;         // 视频文件
    apk_file?: TGameFileInfo | null;           // APK文件

    is_favorite?: boolean;  // 是否收藏
    is_reserve?: boolean;  // 是否预约
}


export interface TGameInfoData {    
    id: string | undefined;        // 主键    
    name: string | undefined; // 游戏名称    
    distribute_type: number | undefined; // 游戏分发类型(1:APK文件,2:链接)    
    developer: string | undefined; // 开发商    
    publisher: string | undefined; // 发行商    
    description: string | undefined; // 游戏描述    
    details: string | undefined; // 游戏详情    
    h5_link?: string | undefined; // H5游戏链接
    
    category_id?: number | string | undefined; // 游戏分类ID
    category?: any; // 游戏分类对象（接口返回）
    tag_ids?: Array<number | string> | undefined; // 游戏标签ID列表
    tags?: Array<{id: number; name: string; create_time: string; update_time: string}>; // 游戏标签列表（接口返回）
      
    status?: string | undefined; // 游戏状态
    publish_time?: string | undefined; // 发布时间
    reserve_count?: number | undefined; // 预约人数
    average_rating?: number | undefined; // 平均评分（接口返回）
    rating_score?: number | undefined; // 评分总分    
    rating_count?: number | undefined; // 评分次数    
    favorite_count?: number | undefined; // 收藏次数    
    download_count?: number | undefined; // 下载次数    
    version?: number | undefined; // 版本
    create_time: string | undefined; // 创建时间    
    update_time: string | undefined; // 更新时间

    icon_file?: TGameFileInfo | null;          // 图标文件
    feature_images?: TGameFileInfo[];          // 宣传图列表
    video_file?: TGameFileInfo | null;         // 视频文件
    apk_file?: TGameFileInfo | null;           // APK文件

    is_favorite?: boolean;  // 是否收藏
    is_reserve?: boolean;  // 是否预约
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
            id: string|undefined;            
            name: string|undefined;            
            distribute_type: number|undefined;            
            h5_link?: string|undefined;            
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