export interface OTPRequestInterface {
    mobileNumber: string,
}

export interface OTPResponseInterface {
    success: boolean;
    message: string;
}

interface LoginData {
    token: string;
    storeId: string;
}

export interface LoginResponseInterface {
    message: string;
    success: boolean;
    data: LoginData;
}

export interface LoginErrorResponseInterface {
    message: string;
    success: boolean;
}

