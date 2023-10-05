import React, { useEffect } from 'react'
import { useState, Fragment } from 'react'
import { useNavigate} from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ForwardIcon, TrashIcon,ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { useSelector,useDispatch } from 'react-redux';
import { ms } from 'date-fns/locale';
import { useRef } from 'react';
import { saveBeforeMsg } from '../../../../modules/socket';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../../../atom';

function MessageListItem(props) {
    const {item,memberId,idx,beforeMsg,roomId}=props;
    console.log("MessageListItem",item);
    const time=item.timestamp.substr(8,2)+":"+item.timestamp.substr(10,2);
    const [checkType,setCheckType]=useState(false);
    const [dateChanged,setDateChanged]=useState(false);
    const [msgType,setMsgType]=useState();
    const [my,setMy]=useState(true);
    const [base64,setBase64]=useState(null);
    const users = useRecoilValue(userState);

    function downloadPDF(item) {
        let linkSource;
        if(item.msgType==="file") linkSource = `data:application/pdf;base64,${item.msg}`;
        else if(item.msgType==="img") linkSource=`data:application/pdf;base64,${item.msg.split(',')[1]}`;
        console.log("linkSource",linkSource);
        const downloadLink = document.createElement('a');
        const fileName = item.originalFileName;
    
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    }

    useEffect(() => {
        // console.log("message item",item);
        // console.log("MessageListItem roomId",roomId);
        if(idx===0) {
            setDateChanged(true);
        }
        else{
            if(beforeMsg.timestamp.substr(0,8)!==item.timestamp.substr(0,8)) setDateChanged(true);
        }

        if(item.msg==="remove") setMsgType(2);
        else if(item.msg==="exit") setMsgType(1);
        else setMsgType(3);
        
        if(Number(users.id)===item.memberId) setMy(true);
        else setMy(false);

        if(item.msgType==="img"){
            console.log("img",item.msg);
            setBase64(item.msg);
        }
        if(item.msgType==="file"){
            console.log("file name",item.originalFileName);
        }
    }, [item])
   
    return (
        <div>
            {dateChanged&&<div className="rounded-lg text-center bg-slate-500 text-white text-sm font-medium">{item.timestamp.substr(0,4)+"년 "+item.timestamp.substr(4,2)+"월 "+item.timestamp.substr(6,2)+"일"}</div>}
            {/* 입장 메세지 */}
            {item.msgType==="enter"&&
                <div className="rounded-sm text-center mt-3 bg-teal-400 text-white text-sm font-medium md:w-2/5 m-auto">{item.msg}</div>
            }
            {/* 퇴장 메세지 */}
            {item.msgType==="exit"&&
                <div className="rounded-sm text-center mt-3 bg-teal-400 text-white text-sm font-medium md:w-2/5 m-auto">{item.nickName+"님이 퇴장하셨습니다."}</div>
            }
            {/* 채팅 내용 메세지이며 발신자 닉네임 */}
            {(item.msgType==="msg"||item.msgType==="file"||item.msgType==="img")&&
                <div className={"font-normal w-20 " + (Number(users.id)!==item.memberId ? "ml-2":"ml-auto text-end mr-2") }>
                    {item.nickName}
                </div>
            }
            {/* 채팅 내용 메세지이며 내가 보낸 메세지 */}
            {item.msgType==="msg"&&Number(users.id)===item.memberId&&
                <div className='flex ml-auto'>
                    <div className={"text-xs font-thin text-gray-600 pt-4 ml-auto pr-1 mt-auto"}>
                        {time}
                    </div>
                    <div className='rounded-sm w-fit h-full break-all text-sm font-bold bg-sky-200 text-black mr-2 py-1 px-2'>
                        {item.msg}
                    </div>
                </div>
            }
            {/* 채팅 내용 메세지이며 남이 보낸 메세지 */}
            {item.msgType==="msg"&&Number(users.id)!==item.memberId&&
                <div className='flex'>
                    <div className='rounded-sm w-fit break-all h-full text-sm font-bold bg-blue-300 text-black ml-2 py-1 px-2'>
                        {item.msg}
                    </div>
                    <div className={"text-xs font-thin text-gray-600 pt-4 pl-1 mt-auto"}>
                        {time}
                    </div>
                </div>
            }
            {/* 이미지이며 남이 보낸 메세지 */}
            {item.msgType==="img"&&Number(users.id)!==item.memberId&&
                <div className='flex'>
                    <img className="ml-2 w-32 h-32" src={base64} onClick={()=>{downloadPDF(item)}}></img>
                    <div className={"text-xs font-thin text-gray-600 pt-28 pl-1"}>
                        {time}
                    </div>
                </div>
            }
            {/* 이미지이며 내가 보낸 메세지 */}
            {item.msgType==="img"&&Number(users.id)===item.memberId&&
                <div className='flex ml-auto'>
                    <div className={"text-xs font-thin text-gray-600 pt-28 ml-auto pr-1"}>
                        {time}
                    </div>
                    <img className="mr-2 w-32 h-32"src={base64} onClick={()=>{downloadPDF(item)}}/>
                </div>
            }
            {/* 이미지가 아닌 파일이며 남이 보낸 메세지 */}
            {item.msgType==="file"&&Number(users.id)!==item.memberId&&
                <div className='flex'>
                    <div className='rounded-sm w-fit min-w-fit h-full text-sm font-bold bg-blue-300 text-black ml-2 py-1 px-2'  onClick={()=>{downloadPDF(item)}}>
                        {/* {item.nickName+"님이 파일을 업로드했습니다. 프로젝트 관리 페이지에서 확인해보세요!"} */}
                        {"[FILE] "+item.originalFileName}
                    </div>
                    <div className={"text-xs font-thin text-gray-600 pt-4 pl-1"}>
                        {time}
                    </div>
                </div>
            }
            {/* 이미지가 아닌 파일이며 내가 보낸 메세지 */}
            {item.msgType==="file"&&Number(users.id)===item.memberId&&
                <div className='flex ml-auto'>
                    <div className={"text-xs font-thin text-gray-600 pt-4 ml-auto pr-1"}>
                        {time}
                    </div>
                    <div className='rounded-sm w-fit h-full text-sm font-bold bg-sky-200 text-black mr-2 py-1 px-2' onClick={()=>{downloadPDF(item)}}>
                        {"[FILE] "+item.originalFileName}
                    </div>
                </div>
            }
            
        </div>
    )
}

export default MessageListItem;