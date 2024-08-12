export interface OTPRequestInterface {
    mobileNumber: string,
}

export interface OTPResponseInterface {
    success: boolean;
    message: string;
}