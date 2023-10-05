import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../atom'
import { REDIRECT_URI, REST_API_KEY } from '../../OAuth';
import { BACKEND_API_BASE_URL } from '../../services/PostService';

function KakaoLogin() {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const users = useRecoilValue(userState);
    const userHandler = useSetRecoilState(userState);

    const location = useLocation();
    const navigate = useNavigate();
    const KAKAO_CODE = location.search.split('=')[1];
    const grant_type = "authorization_code";
    let ACCESS_TOKEN = '';
    let REFRESH_TOKEN = '';
    let ID = '';
    let JWT_TOKEN = '';
    let age;

    const getKakaoToken = () => {
        fetch('https://kauth.kakao.com/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `grant_type=${grant_type}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${KAKAO_CODE}`,
        })
            .then(res => res.json())
            .then(data => {
                if (data.access_token) {
                    console.log('kakaologin data', data);
                    ACCESS_TOKEN = data.access_token;
                    REFRESH_TOKEN = data.refresh_token;
                    // data.refresh_token_expires_in;
                    //localStorage.setItem('token', ACCESS_TOKEN);
                    getUserInfo();
                } else {
                    console.log("로그인 실패");
                    navigate('/');
                }

            })
            // 에러처리
            .catch(() => {
                console.log('에러')
            });

    };


    const getUserInfo = () => {
        // console.log('get 시작', UserInfo);
        fetch('https://kapi.kakao.com/v2/user/me', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` },
            body: `grant_type=${grant_type}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${KAKAO_CODE}`,
        })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    if (data.kakao_account.age_range == "0~9" || data.kakao_account.age_range == "10~19") {
                        age = "10대 이하"
                    }
                    else if (data.kakao_account.age_range == "20~29") {
                        age = "20대"
                    }
                    else if (data.kakao_account.age_range == "30~39") {
                        age = "30대"
                    }
                    else if (data.kakao_account.age_range == "40~49") {
                        age = "40대"
                    }
                    else if (data.kakao_account.age_range == "50~59") {
                        age = "50대"
                    }
                    else {
                        age = "60대 이상"
                    }

                    userHandler(
                        {

                            token: '',
                            kakaoToken: ACCESS_TOKEN,
                            kakaoRefreshToken: REFRESH_TOKEN,
                            id: 0,
                            name: data.kakao_account.profile.nickname,
                            profileImg: data.kakao_account.profile.profile_image_url,
                            email: data.kakao_account.email,
                            age: age,
                            gender: data.kakao_account.gender,
                            isFirst: users.isFirst,
                            school: "",
                            tech: "",
                            refresh: true,
                            push: false,
                            login: true,
                        }
                    )


                    console.log('ACCESS_TOKEN', ACCESS_TOKEN);
                    console.log("in");
                    
                    
                    axios.post(`/api/user/register/${ACCESS_TOKEN}`)
                        .then((response) => {
                            console.log("response:"+response);
                            console.log('response.data.token', "-", response.data.id, "-");
                            userHandler(
                                {
                                    token: response.data.token,
                                    kakaoToken: ACCESS_TOKEN,
                                    kakaoRefreshToken: REFRESH_TOKEN,
                                    id: response.data.id,
                                    name: data.kakao_account.profile.nickname,
                                    profileImg: data.kakao_account.profile.profile_image_url,
                                    email: data.kakao_account.email,
                                    age: age,
                                    gender: data.kakao_account.gender,
                                    isFirst: users.isFirst,
                                    school: response.data.school,
                                    tech: response.data.tech,
                                    portname: response.data.port,
                                    portsave: response.data.portsave_name,
                                    refresh: true,
                                    push: false,
                                    login: true,
                                }
                            )
                        })
                        .catch((error) => {
                            console.log(error);
                            console.log('실패');
                            return "error";
                        })
                        .finally(() => {
                        console.log(users);
                    });

                } else {
                    console.log("유저 정보 가져오기 실패");
                }

                })
            .finally(() => {
                navigate('/');
            });
    };

    useEffect(() => {
        handleShow();
        setTimeout(function () {
            getKakaoToken();
        }, 1000);
    }, []);

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
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
                        <div className="m-auto text-3xl sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                            {<h5>😎 로그인하는중 😎</h5>}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );

}


export { KakaoLogin };

