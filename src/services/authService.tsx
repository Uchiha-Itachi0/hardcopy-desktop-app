import { invoke } from '@tauri-apps/api/tauri';

interface LoginResponse {
    success: boolean;
    message: string;
}

export const checkStoredSession = (): Promise<boolean> => invoke('check_stored_session');
export const login = (mobileNumber: string, otp: string): Promise<LoginResponse> =>
    invoke('handle_login_command', { mobileNumber, otp });
export const logout = (): Promise<void> => invoke('logout');