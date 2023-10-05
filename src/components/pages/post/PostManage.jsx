import React from 'react'
import { useState, useEffect } from 'react';
import { getMyPost, getRequestedPost } from '../../../services/PostService';
import Sidebar from '../../route/Sidebar';
import PostList from './PostList';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../../atom';
function PostManage() {


    const users = useRecoilValue(userState);
    const [myPost, setMyPost] = useState([]);
    const [requestedPost, setRequestedPost] = useState([]);

    useEffect(()=> {
      getMyPost(users.id).then((response) => {
        setMyPost(response);
      })

      getRequestedPost(users.id).then((response) => {
        setRequestedPost(response);
      })
    }, [])

  return (
    <div className ="mx-auto my-4 px-4 max-w-screen-xl">
      <Sidebar />
      <div className="border-4 border-sky-200 rounded-2xl">
          <p className="text-2xl font-bold text-gray-900 m-4">내가 작성한 게시물</p>
          <div className="w-full overflow-auto"> {myPost && <PostList postList ={myPost} type = {"my"} /> } </div>
          <hr className="h-px my-4 border-2 border-indigo-100"></hr>

          <p className="text-2xl font-bold text-gray-900 m-4">신청한 게시물</p>
          <div className="w-full mb-4 overflow-auto"> {requestedPost && <PostList postList ={requestedPost} type = {"requested"}/> } </div>
      </div>
    </div>
  )
}

export default PostManage