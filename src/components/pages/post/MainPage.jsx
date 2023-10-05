import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { getPopularCategorys, getPosts} from "../../../services/PostService";
import java from "../../../category_img/java.png";
import javascript from "../../../category_img/javascript.png";
import python from "../../../category_img/python.jpg";
import react from "../../../category_img/react.png";
import spring from "../../../category_img/spring.png";
import springboot from "../../../category_img/springBoot.png";
import {categoryState, postStatusState, checkedItemsState} from "../../../atom";
import PostList from "./PostList";
import { CHATTING, connect } from "../../../services/ChattingService";
import { useDispatch} from 'react-redux';
import { connectSocket } from "../../../modules/socket";
import SockJS from 'sockjs-client';
export const stomp = require('stompjs');

function MainPage() {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [postList, setpostList] = useState([]);
  let client;

  const [popularCategoryList, setPopularCategoryList] = useState([]);
  useEffect(() => {
    let socket=new SockJS('http://210.109.61.15:8081/stomp/chat');
    client=stomp.over(socket);
    client.connect({},function(){
      console.log("client1 ",client);
      dispatch(connectSocket(client));
    });

    if(postList.length === 0){
      getPosts().then((response) => {
        if(response.length ===0){console.log("아무것도 없으니 하지마라")
        }else{
        setpostList(response);
        }

      })
      .catch(()=>{
        console.log("게시글 없음");
      });
    }
  }, []);
  useEffect(() => {
    if(postList.length !== 0){
      getPopularCategorys().then((response) => {
        setPopularCategoryList(response);
      }).catch(()=>{
        console.log("인기있는 카테고리 없음");
      });
    }
  }, [postList]);

  const [category, setCatecory] = useRecoilState(categoryState);
  const [postStatus, setPostStatus] = useRecoilState(postStatusState);
  const [checkedItems, setCheckedItems] = useRecoilState(checkedItemsState);

  const categories = [
    {
      name: "전체",
      value: "all"
    },
    {
      name: "프론트엔드",
      value: "frontend"
    },
    {
      name: "백엔드",
      value: "backend"
    },
    {
      name: "기타",
      value: "etc"
    },
  ];

  const post_status = [
    {
      name: "모집중",
      value: "recruiting"
    },
    {
      name: "모집완료",
      value: "completed"
    }
  ]

  const tool = [
    {
      name: "Java",
      img: java,
      type: "backend"
    },
    {
      name: "Python",
      img: python,
      type: "backend"
    },
    {
      name: "React",
      img: react,
      type: "frontend"
    },
    {
      name: "JavaScript",
      img: javascript,
      type: "frontend"
    },
    {
      name: "Spring",
      img: spring,
      type: "backend"
    },
    {
      name: "SpringBoot",
      img: springboot,
      type: "backend"
    }
  ];

  const makePopularCategorys = () => {
    if (popularCategoryList.length === 0) return;
    return popularCategoryList.map((item, idx) => {
      for(let i=0; i<tool.length; i++){
        if(tool[i].name.toLowerCase() === item.category_name){
          item.img = tool[i].img;
          item.name = tool[i].name;
          break;
        }
      }
      return (
        <div key ={idx} className = "w-2/3 mx-auto my-5 flex">
          <p className="text-2xl font-bold my-auto mx-auto md:mr-4">{idx + 1}. </p>
          <div className="mx-auto w-2/3 md:w-10/12 flex border-2 border-white rounded-2xl">
            <img className="rounded-xl w-1/4 md:w-1/5" src={item.img} alt={item.name} />
            <p className="m-auto text-2xl lg:text-xl w-10/12 md:text-lg font-bold break-words">{item.name}</p>
          </div>
        </div>
      );
    });
  }

  const makeCategories = () => {
    if (categories.length === 0) return;
    return categories.map((item, idx) => (
      <div
        key={idx}
        className={item.value === category ? "ml-4 focus:text-black underline underline-offset-8 decoration-sky-300 decoration-4" : "ml-4 text-gray-500"}
        onClick={() => {
          setCheckedItems([]);
          setCatecory(item.value);
        }}>
        {item.name}
      </div>
    ));
  };

  const makePostStatus = () => {
    if (post_status.length === 0) return;
    return post_status.map((item, idx) => (
      <div
        key={idx}
        className={item.value === postStatus ? "ml-4 focus:text-black underline underline-offset-8 decoration-sky-300 decoration-4" : "ml-4 text-gray-500"}
        onClick={() => {
          setPostStatus(item.value);
        }}>
        {item.name}
      </div>
    ));
  };


  const checkedItemHandler = (name) => {
    if (checkedItems.includes(name)) {
      setCheckedItems(checkedItems.filter((el) => el !== name));
    } else {
      setCheckedItems([...checkedItems, name]);
    }
  }

  const makeToolfilter = () => {
    if (tool.length === 0) return;
    const filter = category === "all" ? [...tool] : tool.filter(value => value.type.includes(category))
    return filter.map((item, idx) => (
      <button
        key={idx}
        onClick={() => checkedItemHandler(item.name.toLowerCase())}
        className={`${checkedItems.includes(item.name.toLowerCase()) ? "ring ring-sky-300" : "bg-white"} min-w-max pt-4 pb-4 rounded-2xl border flex hover:scale-105 transition `}
      >
        <img className="m-auto w-10 h-10 md:w-12 md:h-12 " src={item.img} alt={item.name} />
        <span className="m-auto text-xl md:text-2xl font-weight-bold">{item.name}</span>
      </button>
    ))
  }

  return (
    <div className="mx-auto max-w-screen-xl my-6 px-4">
      <div className="grid-cols-1 grid md:grid-cols-2 gap-4 xl:gap-8">
        <div className="rounded-2xl flex-column bg-sky-100" >
          <h3 className="m-2 text-dark text-2xl lg:text-2xl md:text-xl font-bold text-center">😍 최다 조회수 모집 게시글 😍</h3>
          {postList.length !==0 && <PostList postList = {postList} type ={"maxView"}/>}
        </div>

        <div className="rounded-2xl flex-column bg-pink-100 ">
          <h3 className="m-2 text-dark text-2xl lg:text-2xl md:text-xl font-bold text-center">😍 인기있는 카테고리 😍</h3>
          <div className="my-10 text-center">
            {popularCategoryList.length !==0 && makePopularCategorys()}
          </div>
        </div>
      </div>

      <div>
        <div className="flex mt-6 mr-4 text-2xl md:text-4xl font-bold">
          {makeCategories()}
        </div>
        <hr className="h-px mt-4 mb-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>

        <div className="grid grid-cols-3 xl:grid-cols-6 lg:grid-cols-5 text-center gap-4 md:grid-cols-4">
          {makeToolfilter()}
        </div>
      </div>

      <div className="flex mt-40 mb-5 text-2xl md:text-4xl">
        <div className="font-bold flex">{makePostStatus()}</div>
        <button 
          onClick = {() => {navigate('/createpost')}}
          className="ml-auto mr-4 font-bold tracking-tight">새 글 쓰기</button>
      </div>
      <hr className="h-px mt-4 mb-5 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div> 
          {postList && <PostList postList = {postList} type ={"main"}/>} 
      </div>
    </div>
  )
}

export default MainPage;
