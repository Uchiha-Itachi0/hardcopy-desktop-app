import React from "react";
import validateMobileNumber from "../utils/ValidateMobileNumber.ts";
import {OTPRequestInterface, OTPResponseInterface} from "../utils/Types.ts";
import {invoke} from "@tauri-apps/api";

const LoginScreen: React.FC = () => {

    // For phone number
    const [mobileNumber, setMobileNumber] = React.useState<string>('');
    const [showOtp, setShowOtp] = React.useState<boolean>(false);
    const [isRequestOtpFails, setIsRequestOtpFails] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(false);
    const [isValidMobileNumber, setIsValidMobileNumber] = React.useState<boolean>(true);

    /**
     * Handles the change event for the mobile number input field.
     *
     * This function updates the mobile number state and validates it to ensure
     * it is exactly 10 digits long. If the mobile number is empty, it is considered valid.
     *
     * @param {string} mobileNumber - The new mobile number input by the user.
     *
     * @returns {void}
     *
     * @example
     * // Example usage in a React component
     * <input
     *   type="tel"
     *   value={mobileNumber}
     *   onChange={(e) => handleMobileNumberChange(e.target.value)}
     *   placeholder="Enter your mobile number"
     * />
     */
    const handleMobileNumberChange = (mobileNumber: string): void => {
        // Update the state with the new mobile number
        setMobileNumber(mobileNumber);

        // If the input is empty, consider it valid
        if (mobileNumber.length === 0) {
            setIsValidMobileNumber(true);
            return;
        }

        // Validate the mobile number using the validateMobileNumber function
        const valid: boolean = validateMobileNumber(mobileNumber);

        // Update the state with the validation result
        setIsValidMobileNumber(valid);
    }

    const handleGenerateOTP  = async (): Promise<void> => {

        setLoading(true);
        const otpRequestData: OTPRequestInterface = {
            "mobileNumber": `+91${mobileNumber}`
        }
        if(!isValidMobileNumber){
            setLoading(false);
            return;
        }

        try{
            const response: OTPResponseInterface = await invoke('request_otp_command', {mobileNumber});
            console.log(response);
        }
        catch (error: any){
            console.log("This is the error", error);
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col h-screen items-center justify-center">
            <div
                className=" relative z-[1] bg-white flex flex-col items-center justify-center p-6 h-[70vh] lg:h-[70vh] w-[50vw] lg:w-[25vw] border-[1px] border-black shadow-2xl radius rounded-3xl">
                <div
                    className="relative h-full w-full overflow-hidden flex flex-col items-center justify-between py-10 gap-8 border-[1px] border-black rounded-3xl shadow-2xl">
                    <h1 className="text-secondary-green font-bold text-[6vw] lg:text-[3vw] select-none">Welcome</h1>
                    <div className="flex flex-col items-center justify-center">
                        <div
                            className={`${showOtp ? 'translate-x-[1000%]' : 'translate-x-0'} flex items-center absolute text-green-300 transition duration-300`}>
                            <div className={`flex flex-col items-center mb-5 ml-3 font-bold`}>
                                <p className={`text-black`}>🇮🇳</p>
                                <p className={`text-black text-xl`}>+91</p>
                            </div>
                            <div className={`${isValidMobileNumber ? 'mb-2' : '-mb-3'} flex flex-col`}>
                                <input
                                    className={`w-[90%] border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-secondary-green font-bold text-[2.5vw] lg:text-[1.5vw] transition duration-300`}
                                    type="tel" pattern="[0-9]{10}" placeholder="Phone Number"
                                    value={mobileNumber} onChange={(e) => handleMobileNumberChange(e.target.value)}/>
                                {!isValidMobileNumber &&
                                    <p className={`text-red-600 text-sm`}>Please enter a valid phone number.</p>}
                            </div>
                        </div>

                        <input
                            className={`${showOtp ? 'translate-x-0' : 'translate-x-[1000%]'} border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-green-300 text-[1.5vw] lg:text-[1.2vw]`}
                            type="text" placeholder="OTP"/>

                    </div>
                    {/*<div className="flex flex-col items-center justify-center select-none">*/}
                    {/*    <button onClick={handleLogin} className="text-white rounded-xl bg-green-300 px-[4vw] py-[0.5vw]">Get OTP</button>*/}
                    {/*</div>*/}
                    {showOtp &&
                        <p
                            className="text-green-300 text-[1.5vw] lg:text-[1vw] font-bold !select-none cursor-pointer">Resend
                            OTP</p>

                    }

                    <div className="flex flex-col items-center justify-center select-none">
                        <button
                            className="font-bold text-white rounded-xl bg-secondary-green px-[4vw] py-[0.5vw]"
                        onClick={handleGenerateOTP}>{
                            loading ?
                                <div className="flex justify-center items-center">
                                    <div
                                        className="border-t-2 border-white border-solid rounded-full w-8 h-8 animate-spin"></div>
                                </div> :
                                showOtp ?
                                    'Login' :
                                    'Generate OTP'
                        }</button>
                        <div className={`${isRequestOtpFails ? 'block' : 'hidden'}`}>
                            <p className={`text-green-300 text-xs pt-6 mx-3 font-bold text-center`}>Sorry, But you are
                                not
                                connected with us
                                <span className={`text-blue-100 cursor-pointer`}> Become our partner</span> or <span
                                    className={`text-blue-100 cursor-pointer`}>Download our app</span>
                            </p>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginScreen;