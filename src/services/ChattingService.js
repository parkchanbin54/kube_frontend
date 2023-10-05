import axios from 'axios';
import SockJS from 'sockjs-client';

import { BACKEND_API_BASE_URL } from './PostService';
export const CHATTING = "http://210.109.61.15:8081";
// const CHATTING = "http://210.109.63.198:8081"; // nfs 테스트용 ip(bastion ip)


// 채팅방 리스트 조회
export async function getRooms(memberId){
    // var memberId=localStorage.getItem('memberId');
   
    const response=await axios.get(`/api/member/${memberId}/rooms`);
    // console.log('getRooms response: ',response);
    return response;
}

// 채팅 내역 가져오기
export async function getChattings(roomId){
    const response=await axios.get(`${CHATTING}/chat/${roomId}`);
    // console.log("[getChattings] ",response);
    return response;
}

// 참여자의 채팅방 나가기
export async function exitRoom(roomId,memberId){
    const response=await axios.delete(`/api/member/${memberId}/rooms/${roomId}/participant`);
    // console.log("[exitRoom]",response);
    return response;
}

// 개설자의 채팅방 삭제
export async function deleteRoom(roomId,memberId){
    // console.log("try to delete room");
    const response=await axios.delete(`/api/member/${memberId}/rooms/${roomId}`);
    // console.log("[deleteRoom]",response);
    return response;
}

// 개설자의 채팅방 종료
export async function endRoom(roomId,memberId){
    const response=await axios.patch(`/api/member/${memberId}/rooms/${roomId}`);

    return response;
}
// ChattingListItem에 넣기 위한 데이터 가져오기 - 채팅 이력에 의한 채팅 개수, 마지막 채팅
export async function getChattingListItemInfo(roomId){
    const response=await axios.get(`${CHATTING}/chat/chatting/${roomId}`);
    // const lastReadNum=await axios.get(`/api/member/${memberId}/`)
    return response;
}

// 제일 최근 읽은 채팅 메세지 idx 갱신
export async function updateLastRead(memberId,roomId,chattingIdx){
    const response=await axios.patch(`/api/member/${memberId}/rooms/${roomId}/${chattingIdx}`);
    // console.log("-------resposne",response);
    return response;
}

// 가장 최근에 읽은 메세지 인덱스 가져오기
export async function getLastRead(roomId,memberId){
    const response=await axios.get(`/api/member/${memberId}/rooms/${roomId}`);
    return response;
}


export const stomp = require('stompjs');
export let client;
// 소켓 연결
export async function connect(){ // 연결할 때
    
    let socket=new SockJS('/stomp/chat');
    // let socket=new SockJS('http://210.109.63.198:8081/stomp/chat');

    client=stomp.over(socket);
    
    client.connect({},function(){
        console.log("client1 ",client);
        // var rooms=[];
        // rooms=getRooms().result;
        // for(let i=0;i<rooms.length;i++){
        //     subscribe(rooms[i].roomId);
        // }
        // subscribe();
    });
    console.log("client2 ",client);
    return client;
};

// 채팅방 참여 - send message TODO: memberId, nickname 수정 필요
export function publish(socket,roomId,message,memberId,nickname,now,msgType){
    console.log("publish msgType: ",msgType);
    socket.send(`/pub/chat.message.${roomId}`,{}, JSON.stringify({
        msg: message,
        nickName: nickname,
        roomId: roomId,
        timestamp: now,
        memberId: memberId,
        msgType: msgType
    }));
};

// 채팅방 참여 - enter 
export function enter(socket,roomId,msg,memberId,nickname,now,msgType){
    console.log("now",now);
    socket.send(`/pub/chat.enter.${roomId}`,{},JSON.stringify({
        msg:msg,
        nickName:nickname,
        roomId:roomId,
        timestamp:now,
        memberId:memberId,
        msgType:"enter"
    }))
};

// 파일 전송
export async function submitFile(data){
    console.log("data",data);
    const config = {
        headers : {
            'Content-Type' : 'multipart/form-data'
        }
    }
    const response=await axios.post(`${CHATTING}/chat/file`,data,config);
    console.log("response",response);
    // const lastReadNum=await axios.get(`/api/member/${memberId}/`)
    return response;
} 
// 채팅방 참여 - receive message
export function subscribe(socket,roomId){
    var response;
    console.log('subscribe: ',socket);
    const res=socket.subscribe('/sub/chat/' + roomId,callback);
    return res;
};

export function callback(message){
    console.log("message",message);
    if(message!==undefined&&message!=='undefined'){
        const received=JSON.parse(message.body);
        const data={
            nickName:received.nickName,
            memberId:received.memberId,
            roomId:received.roomId,
            msg:received.msg,
            timestamp:received.timestamp
        }
        console.log("callback data",data);
        return data;
    }
    return null;
}


export function disconnect(client){ // 연결이 끊겼을 때 
    client.current.deactivate();
};

