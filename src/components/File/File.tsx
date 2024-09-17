import React, {useEffect} from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import {useNavigate} from "react-router-dom";
import {
    CommonErrorResponse,
    GetFilesResponseModel,
} from "../../utils/Types.ts";
import {getFilesById} from "../../services/storeService.tsx";
import {useAuth} from "../../hooks/useAuth.tsx";
import FileCard from "./FileCard.tsx";
import Shimmer from "../Order/Shimmer.tsx";


const File: React.FC = () => {

    const { isAuthenticated, isLoading } = useAuth()
    const [ files, setFiles ] = React.useState<GetFilesResponseModel | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !isAuthenticated) {
            navigate("/login");
        }
        else {
            getFiles();
        }
    }, [])
    const getFiles = async (): Promise<void> => {
        const fileIds: string[] = JSON.parse(localStorage.getItem('files')!) || [];
        if(fileIds.length === 0){
            return;
        }
        console.log("Well these are all the files Id that should be going", fileIds)
        try {
            const fetchFiles: GetFilesResponseModel | CommonErrorResponse = await getFilesById(fileIds)
            if ('files' in fetchFiles){
                console.log(fetchFiles);
                setFiles(fetchFiles as GetFilesResponseModel)
            }
            else {
                console.log("Error: ", (fetchFiles as CommonErrorResponse).message);
            }
        }
        catch (error){
            console.log("This is the error from files: ",  error)
        }
    }

    console.log(files)

    return (
        <>
            <nav className="flex shadow-md px-4 py-3">
                <button onClick={() => navigate('/content')} className="p-4 px-6 bg-gray-300 rounded-full">
                    <IoMdArrowRoundBack className="text-[1.5vw]"/>
                </button>
            </nav>
            <main className="flex flex-wrap justify-center m-20 gap-4">
                {
                    files?.files ?
                    files?.files.map((file, index) => {
                        return (
                            <FileCard fileName={file.fileName}
                                      key={index}
                                      color={file.color}
                                      endPage={Number(file.endPage)}
                                      startPage={Number(file.startPage)}
                                      totalCopies={Number(file.numberOfCopies)} />
                        )

                    }) :
                    <Shimmer total={4} type='file'/>
                }
            </main>
        </>

    )
}

export default File;