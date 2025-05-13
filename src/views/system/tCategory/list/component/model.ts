export interface TCategoryTableColumns {    
    id:number;  // 主键    
    name:string;  // 分类名    
    create_time:string;  // 创建时间    
    update_time:string;  // 更新时间    
}


export interface TCategoryInfoData {    
    id:number|undefined;        // 主键    
    name:string|undefined; // 分类名    
    create_time:string|undefined; // 创建时间    
    update_time:string|undefined; // 更新时间    
}


export interface TCategoryTableDataState {
    ids:any[];
    tableData: {
        data: Array<TCategoryTableColumns>;
        total: number;
        loading: boolean;
        param: {
            page_num: number;
            page_size: number;            
            id: number|undefined;            
            name: string|undefined;            
            create_time: string|undefined;            
            update_time: string|undefined;            
            dateRange: string[];
        };
    };
}


export interface TCategoryEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TCategoryInfoData;
    rules: object;
}