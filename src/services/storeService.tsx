import { invoke } from '@tauri-apps/api/tauri';
import {CommonErrorResponse, GetFilesResponseModel, GetOrdersErrorInterface, OrderInterface} from "../utils/Types.ts";

export const getStores = (storeId: string, pageNumber: number): Promise<OrderInterface[] | GetOrdersErrorInterface> =>
    invoke('get_stores_command', { storeId, pageNumber });
export const getFilesById = (fileIds: string[]): Promise<GetFilesResponseModel | CommonErrorResponse> =>
    invoke('get_files_command', {fileIds})
