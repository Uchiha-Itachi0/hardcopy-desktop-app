import React from "react";
import validateMobileNumber from "../utils/ValidateMobileNumber.ts";
import { OTPResponseInterface } from "../utils/Types.ts";
import { invoke } from "@tauri-apps/api";
import Snackbar from "../components/Snackbar.tsx";
import {useAuth} from "../hooks/useAuth.tsx";
import {useNavigate} from "react-router-dom";


interface SnackbarModel {
    message: string;
    show: boolean;
}

const defaultSnackbar: SnackbarModel = {
    message: "Default message. If you are seeing this means there is something wrong. Please report it",
    show: false
}


const LoginScreen: React.FC = () => {

    const navigate = useNavigate();


    const [mobileNumber, setMobileNumber] = React.useState<string>('');
    const [otp, setOtp] = React.useState<string>('')
    const [showOtp, setShowOtp] = React.useState<boolean>(false);
    const [isRequestOtpFails, setIsRequestOtpFails] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isValidMobileNumber, setIsValidMobileNumber] = React.useState<boolean>(true);
    const [snackbar, setSnackbar] = React.useState<SnackbarModel>(defaultSnackbar);
    const { login } = useAuth();

    const handleMobileNumberChange = (mobileNumber: string): void => {
        setMobileNumber(mobileNumber);
        if (mobileNumber.length === 0) {
            setIsValidMobileNumber(true);
            return;
        }
        const valid: boolean = validateMobileNumber(mobileNumber);
        setIsValidMobileNumber(valid);
    };

    const handleGenerateOTP = async (): Promise<void> => {
        setLoading(true);
        if (!isValidMobileNumber) {
            setLoading(false);
            return;
        }
        let message;
        try {
            const response: OTPResponseInterface = await invoke('request_otp_command', { mobileNumber });
            if (response.success) {
                setShowOtp(true);
            }
            setIsRequestOtpFails(!response.success);
            message = response.message;
        } catch (error: any) {
            console.log("This is the error", error);
            message = error;
        } finally {
            setLoading(false);
            setSnackbar({
                message: message,
                show: true
            });
        }
    };

    const handleLogin = async (): Promise<void> => {
        let message: string = "Invalid OTP. Please enter again";
        setLoading(true);
        setOtp(otp);
        if(otp.length !== 4){
            setLoading(false);
            setSnackbar({show: true, message: message})
            return
        }
        try {
            const success = await login(mobileNumber, otp);
            message = success ? "Login successful!" : "Login failed. Please try again.";
            if (success){
                navigate('/content')
            }
        }
        catch (error: any) {
            console.log("This is the error", error);
            message = error.message;
        } finally {
            setLoading(false);
            setSnackbar({
                message: message,
                show: true
            });
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab' && !showOtp) {
            e.preventDefault();
        }
    };

    return (
        <>
            {snackbar.show ? <Snackbar message={snackbar.message} onClose={() => setSnackbar(defaultSnackbar)} /> : null}
            <div className="flex flex-col h-screen items-center justify-center">
                <div className="relative z-[1] bg-white flex flex-col items-center justify-center p-6 h-[70vh] lg:h-[70vh] w-[50vw] lg:w-[25vw] border-[1px] border-black shadow-2xl radius rounded-3xl">
                    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-between py-10 gap-8 border-[1px] border-black rounded-3xl shadow-2xl">
                        <h1 className="text-secondary-green font-bold text-[6vw] lg:text-[3vw] select-none">Welcome</h1>
                        <div className="flex flex-col items-center justify-center">
                            <div className={`${showOtp ? 'translate-x-[1000%]' : 'translate-x-0'} flex items-center absolute text-green-300 transition duration-300`}>
                                <div className="flex flex-col items-center mb-5 ml-3 font-bold">
                                    <p className="text-black">🇮🇳</p>
                                    <p className="text-black text-xl">+91</p>
                                </div>
                                <div className={`${isValidMobileNumber ? 'mb-2' : '-mb-3'} flex flex-col`}>
                                    <input
                                        className="w-[90%] border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-secondary-green font-bold text-[2.5vw] lg:text-[1.5vw] transition duration-300"
                                        type="tel"
                                        pattern="[0-9]{10}"
                                        placeholder="Phone Number"
                                        value={mobileNumber}
                                        onChange={(e) => handleMobileNumberChange(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    {!isValidMobileNumber &&
                                        <p className="text-red-600 text-sm">Please enter a valid phone number.</p>}
                                </div>
                            </div>
                            <input
                                className={`${showOtp ? 'translate-x-0' : 'translate-x-[1000%]'} border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-[1.5vw] lg:text-[1.2vw]`}
                                type="text"
                                placeholder="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        {showOtp &&
                            <p className="text-primary-blue text-[1.5vw] lg:text-[1vw] font-bold !select-none cursor-pointer">Resend OTP</p>
                        }
                        <div className="flex flex-col items-center justify-center select-none">
                            <button
                                className="font-bold text-white rounded-xl bg-secondary-green px-[4vw] py-[0.5vw]"
                                onClick={showOtp ? handleLogin : handleGenerateOTP}>
                                {loading ?
                                    <div className="flex justify-center items-center">
                                        <div className="border-t-2 border-white border-solid rounded-full w-8 h-8 animate-spin"></div>
                                    </div> :
                                    showOtp ? 'Login' : 'Generate OTP'
                                }
                            </button>
                            <div className={`${isRequestOtpFails ? 'block' : 'hidden'}`}>
                                <p className="text-secondary-green text-xs pt-6 mx-3 font-bold text-center">
                                    Sorry, But you are not connected with us
                                    <span className="text-primary-blue cursor-pointer"> Become our partner</span> or <span className="text-primary-blue cursor-pointer">Download our app</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginScreen;
