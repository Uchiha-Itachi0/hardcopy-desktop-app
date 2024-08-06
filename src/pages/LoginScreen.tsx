import React, {useState} from "react";

const LoginScreen: React.FC = () => {

    const [showOtp, setShowOtp] = useState(false);
    const [isRequestOtpFails, setIsRequestOtpFails] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isValidPhone, setIsValidPhone] = useState(true);

    return (
        <div
            className=" relative z-[1] bg-white flex flex-col items-center justify-center p-6 h-[60vh] lg:h-[70vh] w-[30vw] lg:w-[25vw] border-[1px] border-black shadow-2xl radius rounded-3xl">
            <div
                className="relative h-full w-full overflow-hidden flex flex-col items-center justify-between py-10 gap-8 border-[1px] border-black rounded-3xl shadow-2xl">
                <h1 className="text-green-300 font-bold text-[4vw] lg:text-[3vw] select-none">Welcome</h1>
                <div className="flex flex-col items-center justify-center">
                    <div
                        className={`${showOtp ? 'translate-x-[1000%]' : 'translate-x-0'} flex items-center absolute text-green-300 transition duration-300`}>
                        <div className={`flex flex-col items-center mb-5 ml-3`}>
                            <p className={`text-black`}>🇮🇳</p>
                            <p className={`text-black text-xl`}>+91</p>
                        </div>
                        <div className={`${isValidPhone ? 'mb-2' : '-mb-3'} flex flex-col`}>
                            <input
                                className={`w-[90%] border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-green-300 text-[1.5vw] lg:text-[1.5vw] transition duration-300`}
                                type="text" placeholder="Phone Number"
                                onChange={(e) => handlePhoneChange(e.target.value)}/>
                            {!isValidPhone &&
                                <p className={`text-red-600 text-sm`}>Please enter a valid phone number.</p>}
                        </div>
                    </div>

                    <input
                        className={`${showOtp ? 'translate-x-0' : 'translate-x-[1000%]'} border-b-[1px] border-black focus:border-b-[1px] focus:outline-none  p-2 m-2 bg-white text-green-300 text-[1.5vw] lg:text-[1.2vw]`}
                        type="text" placeholder="OTP" onChange={(e) => setOtp(e.target.value)}/>

                </div>
                {/*<div className="flex flex-col items-center justify-center select-none">*/}
                {/*    <button onClick={handleLogin} className="text-white rounded-xl bg-green-300 px-[4vw] py-[0.5vw]">Get OTP</button>*/}
                {/*</div>*/}
                {showOtp &&
                    <p onClick={handleGenerateOtp}
                       className="text-green-300 text-[1.5vw] lg:text-[1vw] font-bold !select-none cursor-pointer">Resend
                        OTP</p>

                }

                <div className="flex flex-col items-center justify-center select-none">
                    <button onClick={showOtp ? handleLogin : handleGenerateOtp}
                            className="text-white rounded-xl bg-green-300 px-[4vw] py-[0.5vw]">{
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
                        <p className={`text-green-300 text-xs pt-6 mx-3 font-bold text-center`}>Sorry, But you are not
                            connected with us
                            <span className={`text-blue-100 cursor-pointer`}> Become our partner</span> or <span
                                className={`text-blue-100 cursor-pointer`}>Download our app</span>
                        </p>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default LoginScreen;