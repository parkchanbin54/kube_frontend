import React, { useState,useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { useRef } from "react";
import {connect, getRooms, subscribe,publish,getChattings,client,updateLastRead,submitFile, CHATTING} from '../../../services/ChattingService';
import { useParams } from 'react-router-dom';
import MessageList from "./list/MsgList";
import { useDispatch,useSelector } from 'react-redux';
import { connectSocket,saveSubscription,saveRoomId } from "../../../modules/socket";
import { getDate } from "./Date";
import styled from "styled-components";
import SockJS from 'sockjs-client';
export const stomp = require('stompjs');

const FileUpload=styled.label.attrs({type:"file"})`
    width: 65px;
    height: 35px;
    background-color: #FF6600;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    float: right;
    margin-right:5px;
    margin-top: 2px;
    margin-bottom: 4px;
    border: 2px;
    padding: 5px 23px;
`;
export default function ChattingRoom(props) {
    const dispatch=useDispatch();
    let socket=useSelector(state=>state.socket.socket);
    // console.log("[ChattingRoom]",socket);
    let destinations=useSelector(state=>state.socket.subscriptions);
    let beforeRoomId=useSelector(state=>state.socket.roomId);

    const {memberId,room,nickname,message,msgType}=props; // TODO: memberId,nickname props로 안넘길거 지금은 걍 테스트
    const [msg,setMsg]=useState("");
    const {roomId}=useParams();
    const [newChat,setNewChat]=useState(null); // 새로 도착한 채팅
    const [chatList, setChatList] = useState([]); // 화면에 표시될 채팅 기록
    const [checkChatList,setCheckChatList]=useState(false);
    const [firstMsg,setFirstMsg]=useState();
    // const info=memberId.split(" ");
    const [file,setFile]=useState(null);
    // 메세지 전송
    const handleOnChange = (e) => {
        setMsg(e.target.value);
    };
    const handleSubmit = async (e) => {
        const now=getDate();
        if(msg==="") {
            alert("메세지를 입력해주세요.");
        }
        else {
            publish(socket,roomId,msg,memberId,nickname,now,"msg");
        }
        setMsg("");
    };

    // 파일 선택
    const selectFile=(e)=>{
        setFile(e.target.files[0]);
        console.log(e.target.files[0]);
        
    };
    // 파일 전송
    const sendFile=()=>{
        console.log("file",file);
        console.log("memberId",memberId);
        const formData=new FormData();
        formData.append("file",file);
        formData.append("memberId",memberId);
        formData.append("roomId",roomId);
        formData.append("timestamp",getDate());
        formData.append("nickName",nickname);
        submitFile(formData).then((response)=>{
            console.log("submit file response",response);
            const msg=response.data.result.fileId;
            console.log("msg",msg);
            const sendTime=response.data.result.timestamp;
            publish(socket,roomId,msg,memberId,nickname,sendTime,"file");
        })
        setFile(null);
    }

    useEffect(() => {
        console.log("roomId",roomId);
        if(socket===null){
            socket=new SockJS('http://210.109.61.15:8081/stomp/chat');
    		let client=stomp.over(socket);
    		client.connect({},function(){
      		    console.log("client1 ",client);
      		    dispatch(connectSocket(client));
            });
        }
        // 채팅 내역 불러오기
        getChattings(roomId).then((response)=>{
            if(response.data.code!==1000) console.log("SERVER ERROR");
            else{
                const data=response.data.result;
                if(data.length===0) console.log("no chats");
                else{
                    console.log("채팅 내역",data);
                    setChatList(data);
                    setCheckChatList(true);
                    setFirstMsg(data[0]);
                }
            }
        })
    }, [roomId]);

    useEffect(()=>{
        console.log("message",message);
        if(message!==undefined&&message!=='undefined'&&Number(message.roomId)===Number(roomId))
        setChatList(chatList=>[...chatList,message]);
    },[message]);


    // useEffect(() => {
    //     if(newChat!==null&&Number(newChat.roomId)===Number(roomId)){
    //         console.log("set new chat",newChat);
    //         setChatList(chatList=>[...chatList,newChat]);
    //     }
    // }, [newChat]);

   

    return (
        <div className="md:w-full max-w-full rounded-lg bg-blue-100 mt-6 pb-0">
            {checkChatList&&<MessageList items={chatList} firstMsg={firstMsg} memberId={memberId} roomId={roomId}/>}
            
            <div className="md:w-full flex-row">
                <input type="text" id="default-input" className="md:w-11/12 ml-auto bg-white w-full border-2 rounded-lg py-1 pl-2" value={msg} onChange={handleOnChange}
                    onKeyPress={(e)=>{
                        if(e.key==="Enter") {
                            console.log("ENTER");
                            handleSubmit(e);
                        }
                    }}/>
                {file===null&&
                    <div className="float-right md:w-1/12 border-2">
                        <label  htmlFor="input-file">
                            <p className="bg-orange-200 text-black rounded-sm pb-1 text-center pt-1">업로드</p>
                        </label>
                        <input type="file" id="input-file" style={{display:"none"}} onChange={selectFile}/>
                    </div>
                }
                {file!==null&&
                    <button className="bg-orange-200 text-black rounded-sm float-right w-1/12 border-2 pt-1 pb-1 text-center" onClick={sendFile}>전송</button>
                }
               
            </div>
                
                
                
            
            
        </div>
    )
}