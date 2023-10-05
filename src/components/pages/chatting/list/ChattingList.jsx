import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import ChattingListItem from "./ChattingListItem";
import {connect, getRooms, subscribe,client,getChattingListItemInfo} from '../../../../services/ChattingService';
import { connectSocket,saveSubscription } from "../../../../modules/socket";


function ChattingList(props) {
  
    const {items,seletedRoomTitle,onClickItem,selectRoom,memberId,newMsg}=props;

    // let subscriptions=useSelector(state=>state.socket.subscriptions);
    const [newChat,setNewChat]=useState(null); // 새로 도착한 채팅
    const [numberOfChattings,setNumberOfChattings]=useState();
    const [selected,setSelected]=useState();
    const [msgType,setMsgType]=useState();
    const selectedRoom=(item,itemTitle)=>{
        console.log('selected room',item);
        console.log('selected room title',itemTitle);
        // setSelected(selectedRoomNum);
        selectRoom(item,itemTitle);
    }
    const settingMsg=(msg,msgType)=>{
      setMsgType(msgType);
      newMsg(msg,msgType);
    }
    useEffect(()=>{
      console.log("selected",selected);
    },[selected])
    useEffect(()=>{
      if(msgType!==undefined&&msgType!=='undefined'&&msgType===2){
        
      }
    },[msgType])
    return (
      <div className="flex-col h-96 overflow-auto">
        {items && items.map((item,idx)=>{
          // console.log("CHATTING",item.chattingId);
          // getChattingListItemInfo(item.chattingId).then((response)=>{
          //     console.log("CHATTINGLISTITEM",response);
          //     // setNumberOfChattings(response.data.result.number);
          //     // setNewChat(response.data.result.last);
          // });
        // const s={
        //     id: res.id,
        //     des: "/sub/chat/"+roomId
        // }
        // subscriptions.push(s);
        // dispatch(saveSubscription(subscriptions));
            return(
              <ChattingListItem
                key={idx}
                item={item}
                memberId={memberId}
                selectedRoom={selectedRoom}
                newMsg={settingMsg}
                
                onClick={()=>{
                  onClickItem(item);
                }}/>
            );
          })}
       
          
        </div>
    );
    
}

export default ChattingList;