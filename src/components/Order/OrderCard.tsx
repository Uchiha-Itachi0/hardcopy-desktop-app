import React from "react";

interface TextProps {
    label: string;
    isValue?: boolean;
}

interface OrderCardProps {
    totalFiles?: number;
    amount?: number;
    name?: string;
    mobileNumber?: string;
    dateTime?: string;
}

const Text: React.FC<TextProps> = ({label, isValue = false}) => (
    <h1 className={`${isValue ? 'text-[1.5vw] font-semibold' : 'text-[1.5vw]'}`}>{label}</h1>
)

const OrderCard: React.FC<OrderCardProps> = ({
    totalFiles = 1,
    amount = 20,
    name = "Radha",
    mobileNumber = "+919628511247",
    dateTime = "April 20, 2024 at 12:00AM"
                                             }) => {
    return (
        <>
        <div className="relative border border-black shadow-md w-[40vw] cursor-pointer p-6 rounded-xl">
            <div className="absolute -top-3 right-4 bg-white text-[1vw] mb-4"><span>{dateTime}</span></div>
            <div className="flex gap-4 justify-between">
                <div className="flex flex-col gap-6 justify-end">
                    <Text label="Total Files: "/>
                    <Text label="Amount: "/>
                    <Text label="Name: "/>
                    <Text label="Mobile Number"/>
                </div>
                <div className="flex flex-col gap-6 items-center">
                    <Text label={totalFiles.toString()} isValue={true}/>
                    <Text label={`$${amount}`} isValue={true}/>
                    <Text label={name} isValue={true}/>
                    <Text label={`${mobileNumber.replace("+91", "")}`} isValue={true}/>
                </div>
            </div>
        </div>
        </>
    )
}

export default OrderCard;