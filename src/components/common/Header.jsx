import React, { Fragment, useEffect, useState } from 'react'
import { Popover, Transition, Dialog } from '@headlessui/react'
import { KAKAO_AUTH_URL } from '../../OAuth'
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import { useDispatch} from 'react-redux';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton} from '@mui/material';
import {
    Bars3Icon, 
    BookmarkSquareIcon,
    Cog8ToothIcon,
    CursorArrowRaysIcon,
    PhoneIcon,
    PlayIcon,
    Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../atom'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import logo from '../../img/forCloud_logo.png'
import menu from '../../menu.png';
import {BrowserRouter as Router} from 'react-router-dom';
import {MyPage} from '../route/MyPage'
// import GoogleLoginB from '../GoogleLoginB'
import SockJS from 'sockjs-client';
import { connectSocket } from '../../modules/socket';
export const stomp = require('stompjs');


const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
};

function Header() {
    const users = useRecoilValue(userState);
    let [isOpen, setIsOpen] = useState(false);
    let [isLogin, setIsLogin] = useState([false]);
    const [logoutAlert,setLogoutAlert]=useState([false]);
    let navigate = useNavigate();
    const dispatch=useDispatch();

    let client;
    // localStorage.setItem("memberId", 2);
    // localStorage.setItem("name", "bbb")

    useEffect(()=>{
        if(!localStorage.getItem('memberId')) {
            setIsLogin(false);
            setLogoutAlert(true);
        }
        else {
            setIsLogin(true);
            setLogoutAlert(false);
        }
    },[localStorage.getItem('memberId')]);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const [open, setOpen] = useState(null);

    return (
            <div className="mx-auto max-w-screen-xl px-4 ">
                <div className=" p-2 flex items-center justify-between border-b-4 border-sky-200">
                    <div className="md:flex-1 justify-start">
                        {/* 로고 */}
                        <a href="/">
                            <span className="sr-only">Your Company</span>
                            <img
                                className="py-2 max-h-24 w-28"
                                src={logo}
                                alt=""
                            />
                        </a>
                    </div>

                    {users.login && 
                        <div className ="hidden justify-center md:flex md:space-x-10 md:ml-5">
                            {/* <a href="/mainPage" className="text-2xl font-bold text-gray-500 hover:text-gray-900">
                                팀 모집
                            </a> */}
                            <div className="text-2xl font-bold text-gray-500 hover:text-gray-900" onClick={()=>{
                                navigate("/mainPage");
                            }}>팀 모집</div>
                            {/* <a href="/rooms" className="text-2xl font-bold text-gray-500 hover:text-gray-900">
                                채팅
                            </a> */}
                            <div className="text-2xl font-bold text-gray-500 hover:text-gray-900" onClick={()=>{
                                navigate("/rooms");
                            }}>채팅</div>

                            {/* <a href="/mypage" className="text-2xl font-bold text-gray-500 hover:text-gray-900">
                                마이 페이지
                            </a> */}
                            <div className="text-2xl font-bold text-gray-500 hover:text-gray-900" onClick={()=>{
                                navigate("/mypage");
                            }}>마이 페이지</div>
                    </div>}
                    

                    {/* 로그인 */}
                    {/* 로그인 상태에 따라서 버튼 내용 바뀜 */}
                    {/* 로그아웃 alert */}
                    <>
                    
                    </>
                    
                    <>
                    
                        {users.login ?
                            // 로그인 되어 있을 때

                            <div className="hidden items-center justify-end md:flex md:flex-1">
                                <button
                                    onClick={() => {navigate('/kakaologout')}}
                                    className="hover:text-gray-500 px-4 py-2 text-2xl font-bold text-black"
                                >
                                    로그아웃
                                </button>
                            </div>
                            :
                            // 로그인 안되어 있을 때
                            <div className="items-center justify-end md:flex md:flex-1">
                                <button
                                    // type="button"
                                    onClick={handleLogin}
                                    className="hover:text-gray-500 px-4 py-2 text-2xl font-bold text-black"
                                >
                                    로그인
                                </button>
                            </div>
                        }
                    </>
                    <div>
        
        
    </div>
                    {users.login &&
                        <IconButton
                        onClick={() => {navigate('/mypage')}}
                        sx={{
                          p: 0,
                          ...(open && {
                            '&:before': {
                              zIndex: 1,
                              content: "''",
                              width: '100%',
                              height: '100%',
                              borderRadius: '50%',
                              position: 'absolute',
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                            },
                          }),
                        }}
                      >
                        { (users.login) && <Avatar src={users.profileImg} alt="photoURL" /> }
                        { (users.login===false) && <Avatar alt="photoURL" /> }
                
                      </IconButton>
                    }
                </div>
            </div>


    )
}

export default Header
