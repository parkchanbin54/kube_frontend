import React, { useState,useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { getAllFiles } from "../../../services/ProjectService";
import FileList
 from "./FileList";
function ViewOngoingProject(){
    const { state } = useLocation();

    const { postId } = useParams();
    const [minutes,setMinutes]=useState([]); // 회의록
    const [files,setFiles]=useState([]); // 파일

    function downloadPDF(pdf) {
        const linkSource = `data:application/pdf;base64,${pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "file.pdf";
    
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    useEffect(()=>{
        getAllFiles(postId).then((response)=>{
            console.log("getAllFiles response: ",response);
            if(response.data.code!==1000) console.log("ERROR");
            else{
                setMinutes(response.data.result.minutesList);
                setFiles(response.data.result.filesList);
            }
        })
    },[])

    return (
        <div className="mx-auto max-w-screen-lg px-4 mb-7 ">  
            <div className='my-7 border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold text-2xl'>
                <p>프로젝트 제목: {state.post_name}</p>
                <div className="mt-5 grid md:grid-rows-2 grid-cols-1 md:grid-cols-2 gap-y-4">
                    <p>작성자: {state.name}</p>
                    <p>작성일자: {state.start_time}</p>
                    <p>진행기간: {state.duration}개월</p>
                    <p>모집기한: {state.end_time}</p>
                </div>
            </div>

            <div className='mt-7 border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold text-2xl'>
                <p>프로젝트 세부내용</p>
                <hr className="h-px my-4 border-2 border-indigo-100"></hr>
                <div className="break-words">
                    <p>{state.contents}</p>
                </div>
            </div>

            <div className='my-7 flex-column border-4 border-sky-200  rounded-2xl p-5 font-bold text-2xl'>
                <p>프로젝트 파일관리</p>
                <hr className="h-px my-2 border-2 border-indigo-100 "></hr>
                <div className="my-2 grid grid-cols-1 md:grid-cols-2 gap-x-10">
                    <div className="flex-column">
                        <p className="mx-2">데일리 회의록</p>

                        {minutes&&<FileList items={minutes}/>}

                    </div>
                    <div className="flex-column">
                        <p className="mx-2">업로드된 파일</p>
                        {files&&<FileList items={files}/>}
                       
                    </div>
                </div>
            </div>
        </div>
    );

}
export default ViewOngoingProject;