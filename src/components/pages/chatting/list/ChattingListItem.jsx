import React, { useEffect } from 'react'
import { useState, Fragment } from 'react'
import { useNavigate, useParams,useLocation} from 'react-router-dom';
import { Dialog, Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon, ForwardIcon, TrashIcon,ClipboardDocumentIcon } from '@heroicons/react/20/solid'
import { useSelector,useDispatch } from 'react-redux';
import { connectSocket,saveSubscription,saveRoomId } from "../../../../modules/socket";
import {connect, getRooms, subscribe,getChattingListItemInfo,updateLastRead,getLastRead,client, CHATTING} from '../../../../services/ChattingService';
import { set } from 'date-fns';
import SockJS from 'sockjs-client';
export const stomp = require('stompjs');

function ChattingListItem(props) {
    const dispatch=useDispatch();
    const {item,selectedRoom,memberId,newMsg}=props;
    const navigate=useNavigate();
    let socket=useSelector(state=>state.socket.socket);
    let destinations=useSelector(state=>state.socket.subscriptions);
    const [newChat,setNewChat]=useState(null); // 새로 도착한 채팅
    const [chatCnt,setChatCnt]=useState(0); // 해당 채팅방의 메세지 개수
    const [numberOfChattings,setNumberOfChattings]=useState(); // 안읽은 메세지 개수 보이기 위한 state
    const [check,setCheck]=useState(false);
    const [numDiv,setNumDiv]=useState(true);
    const [unRead,setUnRead]=useState(true);
    const [lastRead,setLastRead]=useState();
    const location=useLocation().pathname;
    const [msgType,setMsgType]=useState(0);
    const [participants,setParticipants]=useState();
    
    // 채팅방 리스트에서 클릭 시 채팅방으로 이동, 안읽은 메세지 개수 0으로 갱신(안읽은 메세지 개수 div 안보이게)
    const updateRoom=()=>{
        // 최근 읽은 채팅 메세지 갱신
        // setUnRead(false);
        setNumDiv(false);
        // dispatch(saveRoomId(item.chattingId));
        setNumberOfChattings(0);
        // updateLastRead(memberId,item.chattingId,chatCnt);
        selectedRoom(item,item.title);
        // setNumDiv(false);
        navigate(`/rooms/${item.chattingId}`);
    }
    
    useEffect(() => {
        if(socket===null){
            socket=new SockJS('http://210.109.61.15:8081/stomp/chat');
    		let client=stomp.over(socket);
    		client.connect({},function(){
      		    console.log("client1 ",client);
      		    dispatch(connectSocket(client));
            });
        }
        getChattingListItemInfo(item.chattingId).then((response)=>{
            console.log("====response",response);
            // console.log("item.last",item.last);
            // setNumberOfChattings(response.data.result.number-1-item.last); // 안읽은 메세지 개수 = 전체 메세지 개수 - 1 - 참여자가 마지막으로 읽은 메세지 인덱스
            // setChatCnt(response.data.result.number);
            console.log("last",response.data.result.last);
            if(response.data.result.last.msg==="exit") {
                console.log("exit roomId",response.data.result.last.roomId);
                setMsgType(1);
            }
            else setMsgType(3);
            // console.log("msgType",msgType);

            setNewChat(response.data.result.last);
            // console.log("newChat",newChat);
            setCheck(true);
            setParticipants(item.participantList.length);
            if(numberOfChattings-1-item.last===0) {
                // console.log("It's ZERO");
                setUnRead(false);
            }
        })
        // getLastRead(item.chattingId,memberId).then((response)=>{
        //     setLastRead(response.data.result.last);
        // })
        const des="/sub/chat/"+item.chattingId;
        let exist=false;
        // let subscriptions=socket.subscriptions;
        let subId;
        const callback=function(message){
            if(message!==undefined&&message!=='undefined'){
                const received=JSON.parse(message.body);
                console.log("received",received);
                const data={
                    nickName:received.nickName,
                    memberId:received.memberId,
                    roomId:received.roomId,
                    msg:received.msg,
                    timestamp:received.timestamp,
                    msgType:received.msgType,
                    originalFileName:received.originalFileName
                }
                console.log("data",data);
                setNewChat(data);
                console.log("newchat---",newChat);
                if(data.msg==="exit") setMsgType(1);
                else if(data.msg==="remove") setMsgType(2);
                else setMsgType(3);
                newMsg(data,msgType);      
            }
        }
        // console.log("subscriptions",subscriptions);
        for(let i=0;i<destinations.length;i++){
            if(destinations[i].des===des){
                subId=destinations.id;
                exist=true;
                break;
            }
        }
        if(exist) {
            // const testcallback=subscriptions[subId];
            // console.log("testcallback",testcallback);
            // setCallback(subscriptions[subId]);
        }
        else{
            // const res=subscribe(socket,item.chattingId);
            // subscriptions=socket.subscriptions;
            // destinations.push({id:res.id,des:"/sub/chat/"+item.chattingId});
            // dispatch(saveSubscription(destinations));
            // const testcallback=subscriptions[subId];
            // console.log("testcallback",testcallback);
            // setCallback(subscriptions[res.id]);
           
            const res=socket.subscribe(des,callback);
            destinations.push({id:res.id,des:"/sub/chat/"+item.chattingId});
            dispatch(saveSubscription(destinations));
        } 
    }, []);

    useEffect(() => {
       if(newChat!==null&&newChat.memberId!==Number(memberId)){
        console.log("newChat",newChat);
        // console.log("path",location.slice(-1));
        
        // console.log("numberOfChattings-1",numberOfChattings-1);
        // console.log("item.last",item.last);
        if(newChat.msgType==="exit") {
            console.log("exit");
            setParticipants(participants=>participants-1); // 참여자 나가기 메세지
            console.log("participants",participants);
            // console.log("msgType",msgType);
            
        }
        else if(newChat.msgType==="enter"){
            console.log("enter");
            setParticipants(participants=>participants+1); // 참여자 입장 메세지

        }
        if(newChat.roomId!==Number(location.slice(-1))){
            setNumDiv(true);
        }
        // setNumDiv(true);
        setNumberOfChattings(numberOfChattings=>numberOfChattings+1);
        setChatCnt(chatCnt=>chatCnt+1);
        console.log("chatCnt",chatCnt);
        console.log("msgType",msgType);
       }
    }, [newChat]);
    
    return (
            <div className='grid-rows-2 border-4 rounded-xl mb-2 hover:bg-blue-100' onClick={()=>{
                updateRoom();
            }}>
                <div className='flex'>
                    <div className='flex grow'>
                        <p className={"text-lg pl-4 pt-2 font-black "+((numDiv&&numberOfChattings>0)? "text-rose-500":"text-black")}>{item.title}</p>
                        <p className="text-lg text-gray-700 font-thin pl-2 pt-2">{participants}</p>
                    </div>
                    {check&&<p className='mr-4 pt-2 text-sm text-gray-500'>{newChat.timestamp.substr(0,4)+"/"+newChat.timestamp.substr(4,2)+"/"+newChat.timestamp.substr(6,2)+" "+newChat.timestamp.substr(8,2)+":"+newChat.timestamp.substr(10,2)}</p>}
                </div>
                <div className='flex'>
                    {newChat!==null&&newChat.msgType==="msg"&&check&&<p className="text-sm font-extralight pl-6 grow mt-4 mb-2 truncate"> {newChat.msg} </p>}
                    {newChat!==null&&newChat.msgType==="enter"&&check&&<p className="text-sm font-extralight pl-6 grow mt-4 mb-2"> {newChat.msg} </p>}
                    {newChat!==null&&(newChat.msgType==="file"||newChat.msgType==="img")&&check&&<p className="text-sm font-extralight pl-6 grow mt-4 mb-2"> {newChat.nickName+"님이 파일을 업로드했습니다."} </p>}
                    {newChat!==null&&newChat.msgType==="exit"&&check&&<p className="text-sm font-extralight pl-6 grow mt-4 mb-2"> {newChat.nickName+"님이 퇴장하셨습니다."} </p>}
                    {/* {numDiv&&numberOfChattings>0?
                        <div className='flex justify-center content-center text-sm font-bold rounded-full md:w-6 md:h-6 mr-4 mt-4 text-center bg-indigo-300 text-white'>
                            <div className='m-auto'>{numberOfChattings}</div>
                        </div>
                        :
                        <div></div>
                    } */}
                </div>
            </div>
       
       
    )
}

export default ChattingListItem