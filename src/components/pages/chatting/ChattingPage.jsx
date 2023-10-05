import React, { useState,useEffect } from "react";
import {connect, getRooms, subscribe,getClient,deleteRoom,exitRoom, publish, endRoom, CHATTING} from '../../../services/ChattingService';
import ChattingRoom from "./ChattingRoom";
import ChattingList from "./list/ChattingList";
import { useRef } from "react";
import { useDispatch,useSelector } from 'react-redux';
import { connectSocket, saveSubscription } from "../../../modules/socket";
import { useNavigate,useLocation } from "react-router-dom";
import {BrowserRouter, Link, Route, Routes,Router} from "react-router-dom";
import { getDate } from "./Date";
import { userState } from '../../../atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import SockJS from 'sockjs-client';
export const stomp = require('stompjs');

export default function ChattingPage() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    let client;
    let socket=useSelector(state=>state.socket.socket);
    let subscriptions=useSelector(state=>state.socket.subscriptions);
    const location=useLocation().pathname;
    const users = useRecoilValue(userState);

    const [roomList, setRoomList] = useState([]);
    const [room,setRoom]=useState(0);
    // const [room,setRoom]=useState(false);
    const [roomTitle,setRoomTitle]=useState();
    const [address, setAddress] = useState();
    const [boss,setBoss]=useState(0);
    const [btn,setBtn]=useState(false);
    const [text,setText]=useState("");
    const [roomId,setRoomId]=useState();
    const [msg,setMsg]=useState();
    const [msgType,setMsgType]=useState();
    const [btnType,setBtnType]=useState(0);
    let bi=0;

    ///////////////////////////////////// 테스트용 코드
    // const [memberId,setMemberId]=useState();
    // const handleOnChange = (e) => {
    //     setMemberId(e.target.value);
    // };
    // const handleSubmit = async (e) => {
    //     const input=e.target.value;
    //     // console.log("input",input);
    //     const infos=input.split(" ");
    //     setMemberId(infos[0]);
    //     setNickname(infos[1]);
    //     console.log("memberId",memberId);
    //     console.log("nickname",nickname);
    //     // setNickname(infos[1]);
    //     // setMemberId(e.target.value);
    //     // e.preventDefault();
    //     // handleSubmit(msg);
    //     // setMemberId("");
    // };
    

    // const [nickname,setNickname]=useState();
    // const handleOnChangeNN = (e) => {
    //     setNickname(e.target.value);
    // };
    // const handleSubmitNN = async (e) => {
    //     setNickname(e.target.value);
    //     // e.preventDefault();
    //     // handleSubmit(msg);
    //     // setMemberId("");
    // };
    //////////////////////////////////////////////////////////////////

    // 채팅방 삭제에 대한 메세지 발행
    const remove= (roomId,msg) => {
        publish(socket,roomId,msg,users.id,users.name,getDate(),"remove");
    }
    // 채팅방 나가기에 대한 메세지 발행
    const exit= (roomId,msg) => {
        publish(socket,roomId,msg,users.id,users.name,getDate(),"exit");
    }
    // 채팅방 종료 대한 메세지 발행
    const end= (roomId,msg) => {
        publish(socket,roomId,msg,users.id,users.name,getDate(),"end");
    }
    // 채팅방 선택 시 우측 화면 상단에 채팅방 제목을 보여줌
    const selectRoom=(item,itemTitle)=>{
        setRoom(item);
        setRoomTitle(itemTitle);
        setRoomId(item.chattingId);

        item.participantList.map((p)=>{
            console.log("p",p);
            if(p.type==="팀장") {
                console.log("memberIIIIDDDD",p.userId);
                bi=p.userId;
                console.log("boss Id",bi);
            }
        });
        setBtn(true);

        if(bi===Number(users.id)) setBtnType(1);
        else setBtnType(2);
    }
    const newMsg=(msg,msgType)=>{
        setMsg(msg);
        setMsgType(msgType);
    }
    useEffect(()=>{

        if(socket===null){
    		socket=new SockJS('http://210.109.61.15:8081/stomp/chat');
    		let client=stomp.over(socket);
    		client.connect({},function(){
      		    console.log("client1 ",client);
      		    dispatch(connectSocket(client));
            });
        }
        getRooms(Number(users.id)).then((response)=>{

            if(response.data.code!==1000) console.log("SERVER ERROR");
            else{
                const data=response.data.result;
                if(data.length===0) console.log("no rooms");
                else{
                    console.log("$$response",response);
                    setRoomList(data);
                    console.log("chatting page",roomList);

                }
            }
        });
    },[]); // TODO: memberId 지워야행

    useEffect(()=>{
        console.log("new Msg",msg);
        if(msg!==undefined&&msg!=='undefined'&&msg.msg==='remove'){
            let newRoomList=roomList.filter(
                roomItem=>roomItem.chattingId!=msg.roomId
            )
            setRoomList(newRoomList);
            console.log('roomList',roomList);
          navigate("/rooms");
        }
    },[msg]);
    
    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-full">
            {/* TODO: input 지우기
            <input type="text" id="memberId" value={memberId}
                        onKeyDown={(e)=>{
                            if(e.key==="Enter") {
                                // console.log("ENTER");
                                handleSubmit(e);
                            }
                        }}
                        class="bg-gray-50 border md:w-48 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/> */}
            <div className="flex flex-row pt-5 md:h-full">
                <div className='md:h-full md:w-1/3'>
                    <p className="text-2xl font-bold text-gray-900">채팅방 리스트</p>
                    {roomList&&<ChattingList items={roomList} selectRoom={selectRoom} memberId={users.id} newMsg={newMsg}/>}
                </div>

                <div className='md:h-fit pl-10 md:w-full'>
                    {room.chattingId===0 ?
                        <div>
                            <p className="text-2xl font-bold text-gray-900">원하는 채팅방을 선택하세요!</p>
                        </div>
                        :
                        <div className="md:w-full md:h-full">
                            <div className="flex">
                                    <p className="text-2xl font-bold text-gray-900">{roomTitle}</p>
                                    {btnType===1&&location.slice(-1)!=="s"&&
                                        <button className="ml-auto" onClick={()=>{
                                            deleteRoom(room.chattingId,users.id).then((response)=>{
                                                const des="/sub/chat/"+room.chattingId;
                                                const removeMsg="remove";
                                                remove(roomId,removeMsg);
                                                subscriptions.map((sub)=>{
                                                    if(sub.des===des) socket.unsubscribe(sub.id);
                                                })
                                                subscriptions=subscriptions.filter(
                                                    subsrciption=>subsrciption.des!=des
                                                )
                                                dispatch(saveSubscription(subscriptions));
                                                let newRooms=roomList.filter(
                                                    roomItem=>roomItem.chattingId!=room.chattingId
                                                )
                                                setRoomList(newRooms);
                                            });
                                            navigate("/rooms");
                                            setRoomTitle("원하는 채팅방을 선택하세요!");
                                        }}>삭제</button>
                                    }
                                    {btnType===1&&location.slice(-1)!=="s"&&
                                        <button className="ml-3" onClick={()=>{
                                            endRoom(room.chattingId,users.id).then((response)=>{
                                                if(response.data.code===1000){
                                                    const des="/sub/chat/"+room.chattingId;
                                                    const endMsg="end";
                                                    end(roomId,endMsg);
                                                    subscriptions.map((sub)=>{
                                                        if(sub.des===des) socket.unsubscribe(sub.id);
                                                    })
                                                    subscriptions=subscriptions.filter(
                                                        subsrciption=>subsrciption.des!=des
                                                    )
                                                    dispatch(saveSubscription(subscriptions));
                                                    let newRooms=roomList.filter(
                                                        roomItem=>roomItem.chattingId!=room.chattingId
                                                    )
                                                    setRoomList(newRooms);
                                                }
                                            });
                                            navigate("/rooms");
                                            setRoomTitle("원하는 채팅방을 선택하세요!");
                                        }}>종료</button>
                                    }
                                     {btnType===2&&location.slice(-1)!=="s"&&
                                        <button className="ml-auto" onClick={()=>{
                                            
                                            exitRoom(room.chattingId,users.id).then((response)=>{
                                                const des="/sub/chat/"+room.chattingId;
                                                const existMsg="exit";
                                                exit(roomId,existMsg);
                                                subscriptions.map((sub)=>{
                                                    if(sub.des===des) socket.unsubscribe(sub.id);
                                                })
                                                subscriptions=subscriptions.filter(
                                                    subsrciption=>subsrciption.des!=des
                                                )
                                                dispatch(saveSubscription(subscriptions));
                                                let newRoomList=roomList.filter(
                                                    roomItem=>roomItem.chattingId!=room.chattingId
                                                )
                                                setRoomList(newRoomList);
                                            });
                                            navigate('/rooms');
                                            setRoomTitle("원하는 채팅방을 선택하세요!");
                                        }}>나가기</button>
                                    }
                            </div> 
                            
                            <Routes>
                                <Route path="/:roomId" element={<ChattingRoom room={room} memberId={users.id} nickname={users.name} message={msg} msgType={msgType}/>}/>
                            </Routes>
                        </div>
                    }
            </div>
            
            </div>
        </div>
    )
}