import React from "react";
import {useNavigate} from "react-router-dom";
import { FaPrint } from "react-icons/fa6";

interface TextProps {
    label: string;
    isValue?: boolean;
}

interface FileCardProps {
    fileName?: string;
    amount?: number;
    totalCopies?: number;
    color?: string;
    startPage?: number;
    endPage?: number;
    dateTime?: string;
}

const Text: React.FC<TextProps> = ({label, isValue = false}) => (
    <h1 className={`${isValue ? 'text-[1.5vw] font-semibold' : 'text-[1.5vw]'}`}>{label}</h1>
)

const FileCard: React.FC<FileCardProps> = ({
                                                 fileName = "Bhagwat Geeta As it is.pdf",
                                                 amount = 20,
                                                 totalCopies = 2,
                                                 color = '0',
                                                 startPage = 1,
                                                 endPage = 700,
                                                 dateTime = "April 20, 2024 at 12:00AM"
                                             }) => {


    const navigate = useNavigate();

    const convertIntoShortName = (fileName: string): string => {
        if(fileName.length <= 7){
            return fileName;
        }
        const shortFileName: string = fileName.slice(0, 7);
        const fileExtension: string = fileName.split('.').pop() || '';

        return `${shortFileName}...${fileExtension}`;
    }

    return (
        <>
            <div className="relative border border-black shadow-md w-[40vw] p-6 rounded-xl">
                <div className="absolute -top-3 right-4 bg-white text-[1vw] mb-4"><span>{dateTime}</span></div>
                <div className="flex gap-4 justify-between">
                    <div className="flex flex-col gap-6 justify-end">
                        <Text label="File Name: "/>
                        <Text label="Amount: "/>
                        <Text label="Total Copies: "/>
                        <Text label="Color: "/>
                        <Text label="Start Page: "/>
                        <Text label="End Page: "/>
                    </div>
                    <div className="flex flex-col gap-6 items-center">
                        <Text label={convertIntoShortName(fileName)} isValue={true}/>
                        <Text label={`$${amount}`} isValue={true}/>
                        <Text label={totalCopies.toString()} isValue={true}/>
                        <Text label={color.toString()} isValue={true}/>
                        <Text label={startPage.toString()} isValue={true}/>
                        <Text label={endPage.toString()} isValue={true}/>
                    </div>
                </div>
                <div className="flex justify-end mt-16">
                    <button className="flex items-center gap-4 px-8 py-2 border border-black rounded-lg text-[1.3vw] hover:text-white hover:bg-black ">
                        Print <FaPrint />
                    </button>
                </div>
            </div>
        </>
    )
}

export default FileCard;