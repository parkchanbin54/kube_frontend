import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import {LOGOUT_REDIRECT_URI, REST_API_KEY } from '../../OAuth';
import { userState } from '../../atom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import axios from 'axios';
function KakaoLogout() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const users = useRecoilValue(userState);
    const userHandler = useSetRecoilState(userState);
    // let ACCESS_TOKEN = localStorage.getItem('token')
    let ACCESS_TOKEN = users.kakaoToken;

    console.log("token", ACCESS_TOKEN);

    const navigate = useNavigate();

    const resetUser = () => {
        userHandler(
            {
                token: users.token,
                kakaoToken: '',
                kakaoRefreshToken: '',
                id: users.id,
                name: users.name,
                profileImg: users.profileImg,
                email: users.email,
                age: users.age,
                gender: users.gender,
                isFirst: users.isFirst,
                push: users.push,
                login: false,
            }
        )
    }

    const expireToken = () => {
        // 토큰 만료시키기
        fetch('https://kapi.kakao.com/v1/user/unlink', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${users.kakaoToken}` },
        })
            .then(res => {
                console.log(res);
                if(res.status==401) {
                    console.log('이미만료');
                    resetUser();
                    navigate('/');
                    // kakaoLogout();
                } else if (res.status==200) {
                    //토큰이 이미 만료된경우,,
                    console.log('만료성공');
                    resetUser();
                    navigate('/');
                }
            });
    }

    const kakaoLogout = () => {
        

        const response = axios.get(`https://kauth.kakao.com/oauth/logout?client_id=${REST_API_KEY}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`)
            .then((response) => {
                console.log('success');
                console.log(response);
            })
            .catch((error) => {
                console.log('에러');
                console.log(error)
            })
            .finally(() => {
                console.log(REST_API_KEY);
                console.log(LOGOUT_REDIRECT_URI);
                console.log('완료')
            })

    }

    const refreshAndExpire = () => {

        fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `grant_type=refresh_token&client_id=${REST_API_KEY}&refresh_token=${users.kakaoRefreshToken}`,
    })
        .then(res => res.json())
        .then(data => {
            userHandler(
                {
                    token:users.token,
                    kakaoToken:data.access_token,
                    kakaoRefreshToken: users.kakaoRefreshToken,
                    id: users.id,
                    name: users.name,
                    profileImg: users.profileImg,
                    email: users.email,
                    age: users.age,
                    gender: users.gender,
                    isFirst: users.isFirst,
                    push: users.push,
                    login: users.login,
                }
            )
            // PostUserToken(users.token, users.kakaoRefreshToken, users, userHandler);
        });
        return true;

       
    }


    useEffect(() => {
        handleShow()
    });

    useEffect(() => {
        setTimeout(function () {
            expireToken();
        }, 500);
    }, []);

    return (
        <div className="mx-auto w-10/12 my-4 px-4">
        {/* Illustration behind hero content */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none" aria-hidden="true">
          <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
                <stop stopColor="#FFF" offset="0%" />
                <stop stopColor="#EAEAEA" offset="77.402%" />
                <stop stopColor="#DFDFDF" offset="100%" />
              </linearGradient>
            </defs>
            <g fill="url(#illustration-01)" fillRule="evenodd">
              <circle cx="1232" cy="128" r="128" />
              <circle cx="155" cy="443" r="64" />
            </g>
          </svg>
        </div>
        {/* hero content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-32 pb-12 md:pt-40 md:pb-20">
            <div className="text-center pb-12 md:pb-16">
               <div className="text-3xl mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                  {<h1>😂 로그아웃하는중 😂</h1>}
                </div>
              </div>
            </div>
          </div>
        </div>
    )

}


export { KakaoLogout };
