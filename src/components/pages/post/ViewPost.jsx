import React, { useState, useEffect} from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useRecoilValue} from 'recoil';
import { getApplicant, deleteMyPost, updatePostView, updatePostStatus, getCurrentPostCategory, deleteAllApplicant, BACKEND_API_BASE_URL } from "../../../services/PostService";
import Modal from "./Modal";
import { userState } from '../../../atom';
import axios from 'axios';
function ViewPost() {
    const navigate = useNavigate();
    let userDto = new Object();
    const { state } = useLocation();
    const { postId } = useParams();
    const users = useRecoilValue(userState);
    const [myPost, setMyPost] = useState([]); // 자신이 쓴 글==true, 다른 사람이 쓴 글==false
    const [applicant, setApplicant] = useState([]);
    const [currentCategory, setCurrentCategory] = useState({});
    const [clickedCategory, setClickedCategory] = useState([]);
    const [completedCategory, setCompletedCategory] = useState([]);
    //지금은 각각 모달 state를 만들었지만 전역 모달로 바꿔서 해도 될듯
    const [registerModalOpen, setRegisterModalOpen] = useState(false);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    
    const openModal = (value) => {
        setClickedCategory(value.target.value)
        setRegisterModalOpen(true);
    };
    const approveModal = (value) => {
        setClickedCategory(value.target.value)
        setApproveModalOpen(true);
    };
    const rejectModal = (value) => {
        setClickedCategory(value.target.value)
        setRejectModalOpen(true);
    };

    const closeModal1 = () => {
        setRegisterModalOpen(false);
    };
    const closeModal2 = () => {
        setApproveModalOpen(false);
    };
    const closeModal3 = () => {
        setRejectModalOpen(false);
    };

    const updateApplicant = (applicantList) => {
        setApplicant(applicantList);
    }

    const getCurrentCategory = (current) => {
        setCurrentCategory(current);
    }

    // 조회수 증가
    useEffect(() => {
        if(state.name !== users.name){
            updatePostView(postId);
        }
    }, [])

    //자신이 쓴 글이면 수정하기 버튼 + 신청하기 x
    //다른 사람이 쓴 글이면 + 신청하기 버튼만 ㅇ
    useEffect(() => {
        // 자신이 쓴 글, 다른 사람이 쓴 글 구분
        if (state.name === users.name) {
            setMyPost(true);
            getApplicant(postId).then((response) => {
                setApplicant(response);
            })
        } else {
            setMyPost(false);
        }

        getCurrentPostCategory(postId).then((response) => {
            setCurrentCategory({
                react: response.react,
                java: response.java,
                javascript: response.javascript,
                spring: response.spring,
                springboot: response.springboot,
                python: response.python
            });
        })

    }, []);

    useEffect(()=> {
        if(state.postType === "recruiting"){
            checkFullRecruits();
            // 자동으로 모집완료로 상태 업데이트
            if(state.area.length === completedCategory.length){
                updatePostStatus(postId).then(()=>{
                    alert("해당 게시글의 모집이 완료되었습니다.")
                    navigate('/mainPage')
                })
            }
        }
    }, [currentCategory, completedCategory])

    // 모집현황이 가득찼을 경우 (신청자리스트에서 모두 제거)
    const checkFullRecruits = () => {
        state.area.map((item) => {
            if(!completedCategory.includes(item.name) && Number(item.value) === currentCategory[item.name.toLowerCase()]){
                setCompletedCategory([...completedCategory, item.name]);
                deleteAllApplicant(postId, item.name.toLowerCase()).then((res)=>{
                    alert(item.name + "모집이 마감되었습니다")
                    getApplicant(postId).then((response) => {
                        setApplicant(response);
                    })
                })
            }
        })
    }

    function getPortInfo(userId){
        axios.get(`/api/user/info/${userId}`)
            .then((response) => {
                userDto.name = response.data.user_name;
                userDto.profileImg = response.data.user_image;
                userDto.email = response.data.user_email;
                userDto.age = response.data.user_age;
                userDto.gender = response.data.user_gender;
                userDto.school = response.data.school;
                userDto.tech =  response.data.tech;
                userDto.portname = response.data.port;
                userDto.portsave = response.data.portsave_name;
                navigate(`/portfolioviewer/${userId}`, {state : userDto})
        })}
        
    return (
        <div className="mx-auto max-w-screen-lg px-4 mb-7 ">
            <div className='my-7 border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold text-2xl'>
                <div className ="flex ">
                    <p>프로젝트 제목: {state.post_name}</p>
                    <div className ="hidden md:flex md:ml-auto">
                    {state.postType === "recruiting" && myPost && <button className = "ml-auto text-sky-500" onClick={() => {
                        updatePostStatus(postId).then(()=>{
                            console.log("모집완료")
                            navigate('/mainPage');
                        })
                    }}>완료하기</button>}
                    
                    {state.postType === "recruiting" && myPost && <button className = "ml-5 text-violet-500 " onClick={() => {
                        navigate('/PostUpdate',{state:{id: postId}});
                    }}>수정하기</button>
                    }

                    {myPost && <button className = {state.postType === "recruiting" ? "ml-5 text-red-500" : "ml-auto text-red-500"} onClick={() => {
                        deleteMyPost(postId, users.id).then(()=>{
                            console.log("삭제완료")
                            navigate('/mainPage');
                        })
                    }}>삭제하기</button>}
                    </div>
                </div>
                <div className="mt-5 grid md:grid-rows-2 grid-cols-1 md:grid-cols-2 gap-y-4">
                    <p>작성자: {state.name}</p>
                    <p>작성일자: {state.start_time}</p>
                    <p>진행기간: {state.duration}개월</p>
                    <p>모집기한: {state.end_time}</p>
                </div>
            </div>

            <div className='border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold text-2xl'>
                모집분야
                <hr className="h-px mt-4 border-2 border-indigo-100"></hr>
                <div className='mt-4 flex-column'>
                    {state.area.map((k, key) => {
                        let cate = 0;
                        Object.keys(currentCategory).map(item => {
                            if(item === k.name.toLowerCase()){
                                cate = currentCategory[item];
                            }});
                        return (
                            <div key={key} className="flex mb-1">
                                <div className="flex">
                                    <img className="mr-1 rounded-2xl w-10 h-11" src={k.img} alt={k.name} />
                                    <p className="m-auto">{k.name}</p>
                                </div>
                                <div className = "hidden sm:flex ml-auto my-auto">
                                    <p> {cate} / {k.value} 명</p>
                                    {state.postType === "recruiting" && !myPost &&  cate !== Number(k.value) && <button
                                        key={key}
                                        onClick={openModal}
                                        value={k.name}
                                        className="ml-4 border rounded-md w-24 bg-sky-100 outline-none hover:bg-sky-200">신청하기</button>}
                                    {registerModalOpen && <Modal open={registerModalOpen} close={closeModal1} header="모집분야"  postId ={postId} category={clickedCategory}>
                                        해당 모집분야에 신청하시겠습니까?
                                    </Modal>}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className='mt-7 border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold text-2xl'>
                <p>프로젝트 세부내용</p>
                <hr className="h-px my-4 border-2 border-indigo-100"></hr>
                <div className ="break-words">
                    {state.contents}
                </div>
            </div>

            {applicant.length !== 0 && state.postType === "recruiting" && myPost && <div className='mt-7 mb-4 border-4 border-sky-200 rounded-2xl p-5 flex-column font-bold max-h-96'>
                <p className = "">신청자 리스트</p>

                <hr className="h-px my-4 border-2 border-indigo-100 "></hr>
           
                <div className="flex-column overflow-y-auto scrollbar-hide">
                    {applicant.map((item, idx) => {

                        return (
                            <div key={idx} className="text-2xl flex my-2 pb-1 border-b border-b-cyan-100">
                                
                                <p className="ml-1" >이름: {item.name}</p>
                                <p className="ml-4">신청: {item.requested}</p>

                                <div className ="hidden md:flex md:text-2xl ml-auto">
                                    <button
                                        onClick = {approveModal}
                                        value={item.userId}
                                        className="px-1 border rounded-md bg-sky-100 outline-none hover:bg-sky-200">승인</button>
                                       
                                    {approveModalOpen && <Modal open={approveModalOpen} close={closeModal2} header="승인하기" postId ={postId} category={clickedCategory} updateApplicant={updateApplicant} getCurrentCategory ={getCurrentCategory}>
                                        해당 인원을 승인시키겠습니까?
                                    </Modal>}

                                    <button
                                        onClick ={()=>getPortInfo(item.userId)}
                                        value={item.userId}
                                        className="ml-4 border rounded-md w-24 bg-sky-100 outline-none hover:bg-sky-200">포트폴리오</button>
                                        
                                    <button
                                        onClick = {rejectModal}
                                        value={item.userId}
                                        className="px-1 ml-4 border rounded-md  bg-sky-100 outline-none hover:bg-sky-200">거절</button>
                                        
                                    {rejectModalOpen&&<Modal open={rejectModalOpen} close={closeModal3} header="거절하기" postId ={postId} category={clickedCategory} updateApplicant={updateApplicant}>
                                        해당 신청을 거절하시겠습니까?
                                    </Modal>}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>}
        </div>
    );

}
export default ViewPost;
