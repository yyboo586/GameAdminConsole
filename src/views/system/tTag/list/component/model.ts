export interface TTagTableColumns {    
    id:number;  // 主键    
    name:string;  // 标签名    
    create_time:string;  // 创建时间    
    update_time:string;  // 更新时间    
}


export interface TTagInfoData {    
    id:number|undefined;        // 主键    
    name:string|undefined; // 标签名    
    create_time:string|undefined; // 创建时间    
    update_time:string|undefined; // 更新时间    
}


export interface TTagTableDataState {
    ids:any[];
    tableData: {
        data: Array<TTagTableColumns>;
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


export interface TTagEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:TTagInfoData;
    rules: object;
}