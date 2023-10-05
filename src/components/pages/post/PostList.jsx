import React , {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { postStatusState, checkedItemsState } from '../../../atom';
import java from "../../../category_img/java.png";
import javascript from "../../../category_img/javascript.png";
import python from "../../../category_img/python.jpg";
import react from "../../../category_img/react.png";
import spring from "../../../category_img/spring.png";
import springboot from "../../../category_img/springBoot.png";

function PostList(props) {
    const {postList, type} = props;
    const navigate = useNavigate();
    const postStatus = useRecoilValue(postStatusState);
    const checkedItems = useRecoilValue(checkedItemsState);
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
    const area = postList.map(data => {
        if (!data.area) {
          return {
            ...data, area: [
  
            ]
          }
        }
      })
  
      const modifiedPostList = area.map((data) => {
        let tempCate;
        for(let i=0; i<2; i++){
          if(data.post_category[i].type.includes("recruits")){
              tempCate = data.post_category[i];
              break;
          }
        }
          const abc = [];
          for (const [key, value] of Object.entries(tempCate).filter(([, count]) => count > 0)) {
            if(key !== 'id'){
              const area_detail = {
                img: `${key}`,
                name: `${key}`,
                value: `${value}`,
              };
              abc.push(area_detail);
            }
          }
          delete data.post_category;
          return {
            ...data,
            area: data.area.concat(abc)
          };
      })

    let post = [];
    if(type === 'main'){
        const filter = postStatus === "recruiting" ? modifiedPostList.filter(value => value.postType.includes("recruiting"))
        : modifiedPostList.filter(value => value.postType.includes("completed"))
        const fff = [];
        for(let i=0; i<filter.length; i++){
            const p = filter[i]
            for(let k=0; k<p.area.length; k++){
                for(let t=0; t<checkedItems.length; t++){
                if(p.area[k].name === checkedItems[t] && !fff.includes(p)){
                    fff.push(p)
                }
                }
            }
        }
        const filteredPost = checkedItems.length === 0 ? filter : fff;
        post = [...filteredPost];
    }else if(type === 'my' || type === 'requested'){
        post = [...modifiedPostList];
    }else if(type ==='ongoing' || type === 'completed') {
        const filteredPost = type === 'ongoing' ? modifiedPostList.filter(el => el.projectType.includes("onGoing")) : 
        modifiedPostList.filter(el => el.projectType.includes("completed"));
        post = [...filteredPost];
    }else{

        let maxView = -1;
        let maxViewPost;
        modifiedPostList.map(item => {
            if(item.views > maxView){
                maxView = item.views;
                maxViewPost = item;
            }
        })
        post.push(maxViewPost)
    }
    
    return (
    <div className = {type === "main" ? "grid grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-4 md:grid-cols-2"
        : type === "my" || type === "requested" || type === "ongoing" || type === "completed" ? "grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-y-4"
        : " w-full"} >
     {post && post.map((item, idx) => (

      <div key={idx} className = {type === "main" ? "rounded-2xl border py-5 flex-column hover:scale-105 transition cursor-pointer text-2xl"
        : type === 'my' || type === 'requested' || type === "ongoing" || type === "completed" ? "rounded-2xl mx-3 border flex-column hover:bg-sky-50 transition cursor-pointer text-2xl"
        : "text-left rounded-2xl border-4 border-white hover:border-black flex-column cursor-pointer text-2xl"}
        onClick={type === 'ongoing' || type === 'completed' ? () => { navigate(`/viewProject/${item.id}`, {state: item})} :
        () => { navigate(`/viewPost/${item.id}`, {state: item})}}>

     
        <h3 className="mx-5 my-2 font-weight-bold">프로젝트 제목: {item.post_name}</h3>
        <h3 className="mx-5 my-2 font-weight-bold">모집기한: {item.end_time}</h3>
        <h3 className="mx-5 my-2 font-weight-bold">진행기간: {item.duration}개월</h3>
        <hr className= {type ==="maxView" ? "h-px mx-4 my-2 first-line:mt-4 border border-white"
        :"h-px mx-4 my-2 first-line:mt-4 bg-gray-200 border-0 dark:bg-gray-700"}></hr>

        <h3 className="mx-5 my-2 font-weight-bold text-center">모집분야</h3>
        <div className= {type === 'my' || type === 'requested' || type === "ongoing" || type === "completed" ? "md:text-xl lg:text-lg xl:text-base mx-2 grid grid-rows-3 grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2" 
          : type ==="maxView" ? "text-xl mx-2 grid grid-rows-2 grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-2"
          : "text-xl mx-2 grid grid-rows-2 grid-cols-3 lg:grid-cols-3 md:grid-cols-2 gap-2"}>
          {item.area.map((k, key) => {
            for(let i=0; i<tool.length; i++){
              if(tool[i].name.toLowerCase() === k.img.toLowerCase()){
                k.img = tool[i].img;
                k.name = tool[i].name;
                break;
              }
            }
            return (
              <div key={key} className={ type ==="maxView" ?" flex border-2 border-white rounded-2xl" 
                : "flex border rounded-2xl"}>
                <img className="rounded-2xl w-9 h-10" src={k.img} alt={k.name} />
                <p className="m-auto">{k.name}</p>
              </div>
            );
          })}
        </div>
        <hr className= {type ==="maxView" ? "h-px mx-4 my-2 first-line:mt-4 border border-white"
        :"h-px mx-4 my-2 first-line:mt-4 bg-gray-200 border-0 dark:bg-gray-700"}></hr>
        <div className="flex my-2">
          <h3 className="mx-auto font-weight-bold">작성자: {item.name}</h3>
          <h3 className="mx-auto font-weight-bold">조회수: {item.views}회</h3>
        </div>
      </div>

    ))}
    </div>
  )
}

export default PostList;