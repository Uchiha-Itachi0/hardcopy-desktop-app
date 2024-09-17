
export interface CommonErrorResponse {
    message: string,
    success: boolean
}

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
export interface OrderInterface {
    id: number;
    orderStatus: string;
    fileNames: string[];
    localDateTime: string;
    orderAmount: number;
    userId: string;
    userName: string;
}

export interface GetStoreRequestInterface {
    storeId: string;
    pageNumber: number;
}

export interface GetOrdersResponseInterface {
    orders: OrderInterface[];
}

export interface GetOrdersErrorInterface {
    message: string;
    success: boolean;
}

interface FileInterface {
    fileName: string,
    fileType: string,
    color: string,
    startPage: string,
    endPage: string,
    numberOfCopies: number
}
export interface GetFilesResponseModel {
    files: FileInterface[],
    unableToFetch: string[]
}

export interface GetFilesRequestModel {
    id: string[]
}


