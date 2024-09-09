import { invoke } from '@tauri-apps/api/tauri';
import {GetOrdersErrorInterface, OrderInterface} from "../utils/Types.ts";

export const getStores = (storeId: string, pageNumber: number): Promise<OrderInterface[] | GetOrdersErrorInterface> =>
    invoke('get_stores_command', { storeId, pageNumber });
