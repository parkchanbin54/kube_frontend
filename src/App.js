import NotFound from './components/common/NotFound';
import { KakaoLogin } from '../src/components/route/KakaoLogin'
import { KakaoLogout } from './components/route/KakaoLogout'
import { userState } from '../src/atom'
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { RecoilRoot } from "recoil";
import { LandingPage } from '../src/components/route/LandingPage'
import {MyPage} from '../src/components/route/MyPage'
import {Portfolio} from '../src/components/route/Portfolio'
import { Portfolioview } from './components/route/Portfolioview';
import { Provider } from "react-redux";
import ChattingPage from "../src/components/pages/chatting/ChattingPage";
import ChattingRoom from "../src/components/pages/chatting/ChattingRoom";
import MainPage from "../src/components/pages/post/MainPage";
import ViewPost from "../src/components/pages/post/ViewPost";
import ProjectManage from "../src/components/pages/post/ProjectManage";
import PostManage from "../src/components/pages/post/PostManage";
import ViewProject from "../src/components/pages/post/ViewProject";
import {UpdatePost} from "../src/components/route/UpdatePost";
import { Portfolioviewer } from './components/route/Portfolioviewer';
import React from 'react';
import { styled } from '@mui/material/styles';

import Header from './components/common/Header';
import Footer from './components/common/Footer';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import { CreatePost } from './components/route/CreatePost';
const StyledRoot = styled('div')({
  display: 'flex',
  minHeight: '100%',
  overflow: 'hidden',
});

const Main = styled('div')(({ theme }) => ({
  flexGrow: 1,
  overflowX: 'hidden',
  minHeight: '100%',
}));


function App() {
  const users = useRecoilValue(userState);
  return (
     <>
      
      
      <div className='min-h-screen'>
        <RecoilRoot>
        <BrowserRouter>
        <Header />
                <Routes>
                      
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/main" element={<LandingPage />} />
                      <Route path="/home" element={<LandingPage />} />
                      <Route path="/kakaologin" element={<KakaoLogin />} />
                      <Route path="/kakaologout" element={<KakaoLogout />} />
                      <Route path="/mypage" element={<MyPage />} />
                      <Route path="/portfolio" element = {<Portfolio/>}/>
                      <Route path="/createpost" element= {<CreatePost/>}/>
                      <Route path="/portfolioview" element = {<Portfolioview/>}/>
                      <Route path="/portfolioviewer/:userId" element = {<Portfolioviewer/>}/>
                      <Route path="/postUpdate" element = {<UpdatePost/>}/>
                    
                      <Route path="/user/attached/*" />
                      
                    
                      <Route path="/rooms/*" element={<ChattingPage/>}/>
                      <Route path="member/:memberId/rooms/:roomId" element={<ChattingRoom />} />
                      <Route path="/mainPage" element={<MainPage />} />
                      <Route path="/viewPost/:postId" element={<ViewPost />} />
                      <Route path="/projectManage" element={<ProjectManage />} />
                      <Route path="/postManage" element={<PostManage />} />
                      <Route path="/viewProject/:postId" element={<ViewProject />} />
                      <Route path="*" element={<NotFound />}></Route>
                  </Routes>
            
        </BrowserRouter>
        </RecoilRoot>
      </div>
      <Footer />
     </>
  );
}

export default App;
