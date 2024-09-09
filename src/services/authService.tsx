import { invoke } from '@tauri-apps/api/tauri';
import {LoginResponseInterface} from "../utils/Types.ts";


export const checkStoredSession = (): Promise<boolean> => invoke('check_stored_session');
export const login = (mobileNumber: string, otp: string): Promise<LoginResponseInterface> =>
    invoke('handle_login_command', { mobileNumber, otp });
export const logout = (): Promise<void> => invoke('logout');