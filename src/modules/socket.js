const CONNECT_SOCKET='socket/CONNECT_SOCKET';
const SAVE_SUBSCRIPTION="socket/SAVE_SUBSCRIPTION";
const SAVE_BEFOREMSG="socket/SAVE_BEFOREMSG";
const SAVE_ROOMID="socket/SAVE_ROOMID";


// 액션 생성 함수

// 소켓 저장 - socket==client
export function connectSocket(socket){
    console.log("[creating connectSocket action]");
    return{
        type:CONNECT_SOCKET,
        payload:{
            socket: socket
        }
    }
}

// subscriptions 저장
export function saveSubscription(subscription){
    console.log("[creating saveSubscription action]- subscription",subscription);
    return{
        type:SAVE_SUBSCRIPTION,
        payload:{
            subscriptions: subscription
        }
    }
}

// 날짜가 변하는 순간 날짜를 보여주기 위한 beforeMsg 저장
export function saveBeforeMsg(msg){
    console.log("[creating saveBeforeMsg action]");
    return{
        type:SAVE_BEFOREMSG,
        payload:{
            beforeMsg:msg
        }
    }
}
export function saveRoomId(roomId){
    return{
        type:SAVE_ROOMID,
        payload:{
            roomId:roomId
        }
    }
}
// 모듈 초기 상태
const initialState = {
    socket: null,
    subscriptions:[],
    beforeMsg:null,
    roomId:null
}

// 리듀서
export default function socket(state=initialState,action){
    switch(action.type){
        case CONNECT_SOCKET:
            console.log("[CONNECT_SOCKET] - client(socket)",action.payload.socket);
            return{
                ...state,
                socket: action.payload.socket
            }

        case SAVE_SUBSCRIPTION:
            console.log('socket: ',state.socket);
            return{
                ...state,
                subscriptions: action.payload.subscriptions
            }
        case SAVE_BEFOREMSG:
            return{
                ...state,
                beforeMsg: action.payload.beforeMsg
            }
        case SAVE_ROOMID:
            return{
                ...state,
                roomId:action.payload.roomId
            }
        default:
            return state;
    }
}