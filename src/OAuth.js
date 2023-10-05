import React from "react";

export const HOST = 'http://backend-service'
export const REST_API_KEY = "ed6abcf28cdeaed10f645ad69398b91c"
export const JAVASCRIPT_KEY = "d68edfa2b68ca4d75c9bf7d42f6ac748"
export const REDIRECT_URI = `${HOST}/kakaologin`
export const LOGOUT_REDIRECT_URI = `${HOST}/kakaologout`
export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

// export const HOST = process.env.REACT_APP_HOST;
// export const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
// export const JAVASCRIPT_KEY = process.env.REACT_APP_JAVASCRIPT_KEY;
// export const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
// export const LOGOUT_REDIRECT_URI = process.env.REACT_APP_LOGOUT_REDIRECT_URI;
// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
