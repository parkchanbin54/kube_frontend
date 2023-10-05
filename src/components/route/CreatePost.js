/* eslint-disabled*/
import { useCallback, useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';

import { useNavigate } from 'react-router-dom';
import { useRecoilValue} from 'recoil';
import styled, { css } from 'styled-components';

import { useDispatch,useSelector } from 'react-redux';

import { DateRangeSelector } from '../route/DateRangeSelector';
import { userState } from '../../atom';

import './CreatePost.css';
import { savePost } from '../../services/PostService';
import { publish, enter, CHATTING } from '../../services/ChattingService';
import { getDate } from '../pages/chatting/Date';
import SockJS from 'sockjs-client';
import { connectSocket } from '../../modules/socket';
import Modal from "../pages/post/Modal";
export const stomp = require('stompjs');


const Main = styled.div`
  paddingLeft: 10px;
  paddingRight: 10px;
  paddingBottom: 10px;
`

const Remove = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0.0.0.0);
  font-size: 24px;
  cursor: pointer;
  &:hover {
    color: rgba(0.0.0.0);
  }
  display: none;
`;

const ItemBlock = styled.div`

  display: flex;
  align-items: center;
  padding-top: 12px;
  padding-bottom: 12px;
  &:hover {
	background-color: #535353;
    ${Remove} {
      display: initial;
    }
  }
`;

const Text = styled.div`
  flex: 1;
  font-size: 18px;
  color: white;
  margin-bottom: 1%;
  margin-left: 15px;
  ${(props) =>
		props.done &&
		css`
      color: #ced4da;
    `}
`;



function CreatePost() {
	const dispatch=useDispatch();
	const childRef = useRef();
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}, []));
    let socket=useSelector(state=>state.socket.socket);
	let [savedQsList, setSavedQsList] = useState([]);
	let [curQs, setCurQs] = useState('');
	let [curQsItemList, setCurQsItemList] = useState([]);
	let [curSelectedType, setCurSelectedType] = useState('Type');
	let [makeQsSwitch, setMakeQsSwitch] = useState(false);
	let [qsType, setQsType] = useState('');
	let [survey, setSurvey] = useState([]);
	let [viewSwitch, setViewSwitch] = useState('create');

	const [shareWay, setShareWay] = useState('null');
	let count = window.localStorage.getItem("count");
	console.warn = console.error = () => {};
	//post에 사용
	let [postName, setpostName] = useState("");
	let [postContents, setpostContents] = useState("");
	let [postId, setPostId] = useState(0);
	let postState = useRef(-1);
	window.localStorage.setItem("count", 1);

	//저장시 모달 보여주기에서 사용
	const [show, setShow] = useState(false);
	const [showCreate, setShowCreate] = useState(false);

	let navigate = useNavigate();
	let postJson = new Object();
	let postDto = new Object();
	let postCatDto = new Object();


	postDto.status = null;
	postDto.end_time = '12:12:12 12:12:00';
	postDto.end_time = '12:12:12 12:12:00';
	postDto.post_name = null;
	postDto.contents = null;
	postDto.views = 0;


	const myRef = useRef({});
	const users = useRecoilValue(userState);

	useEffect(() => {
		if (socket===null) {
    		socket=new SockJS('http://210.109.61.15:8081/stomp/chat');
    		let client=stomp.over(socket);
    		client.connect({},function(){
      			console.log("client1 ",client);
      			dispatch(connectSocket(client));
    		});
		}
	}, [])

	useEffect(() => {
		setCurQs('');
		setCurQsItemList([]);
	}, [curSelectedType, makeQsSwitch, showCreate])

	//체크박스 하나만 선택
	const checkOnlyOne = (checkThis) => {
		const checkboxes = document.getElementsByName('shareWay')
		for (let i = 0; i < checkboxes.length; i++) {
			if (checkboxes[i] !== checkThis) {
				checkboxes[i].checked = false
			}
		}
	}

	//체크박스 체크 여부 확인
	//체크여부에 따라서 setShareWay()
	function is_checked() {

		const linkCheckbox = document.getElementById('linkCheckBox');
		const qrCheckBox = document.getElementById('qrCheckBox');

		const link_checked = true;
		const qr_checked = qrCheckBox.checked;

		if (qr_checked === true) {
			setShareWay("QR");
		} else {
			setShareWay("writer");
		}
	}

	let today = new Date();
	let year = today.getFullYear();
	let month = ('0' + (today.getMonth() + 1)).slice(-2);
	let nextMonth = ('0' + (today.getMonth() + 2)).slice(-2);
	let day = ('0' + today.getDate()).slice(-2);
	let hours = ('0' + today.getHours()).slice(-2);
	let minutes = ('0' + today.getMinutes()).slice(-2);
	let seconds = ('0' + today.getSeconds()).slice(-2);

	let dateString = year + '-' + month + '-' + day;
	let timeString = hours + ':' + minutes;
	let nextDateString = year + '-' + nextMonth + '-' + day;
	let current_time_temp = dateString + ' ' + timeString + ':' + seconds;

	// 설문 공유때 사용되는 시작 시간 및 종료 시간
	// start_time: 배포 시작 날짜 및 시간, 예시 "2022-12-11 12:00:00"
	let start_time_temp = dateString + ' ' + timeString + ':00';
	// 배포 마감 날짜 및 시간
	let end_time_temp = nextDateString + ' ' + timeString + ':00';

	const [startDate, setStartDate] = useState(dateString);
	const [startTime, setStartTime] = useState(timeString);
	const [endDate, setEndDate] = useState(nextDateString);
	const [endTime, setEndTime] = useState(timeString);
	let [modalname, setModalname] = useState("");
	const [springbootCount, setspringbootCount] = useState(0);
	const [pythonCount, setpythonCount] = useState(0);
	const [springCount, setspringCount] = useState(0);
	const [reactCount, setreactCount] = useState(0);
	const [javaCount, setjavaCount] = useState(0);
	const [javascriptCount, setjavascriptCount] = useState(0);

	const [projectLengthCount, setprojectLengthCount] = useState(0);
	// const [javascriptCount, setjavascriptCount] = useState(0);
	// const [javascriptCount, setjavascriptCount] = useState(0);

	const [ModalOpen, setModalOpen] = useState(false);

	const openModal = () => {
		console.log("dddd");
        setModalOpen(true);
    };

	const closeModal = () => {
        setModalOpen(false);
    };

	const onClick = (event) => {
		const id = event.target.id;
		switch (id) {
			case 'springPlus':
				setspringCount(springCount + 1)
				break
			case 'pythonPlus':
				setpythonCount(pythonCount + 1)
				break
			case 'springMinus':
				setspringCount(springCount - 1)
				break
			case 'pythonMinus':
				setpythonCount(pythonCount - 1)
				break
			case 'springbootPlus':
				setspringbootCount(springbootCount + 1)
				break
			case 'reactPlus':
				setreactCount(reactCount + 1)
				break
			case 'springbootMinus':
				setspringbootCount(springbootCount - 1)
				break
			case 'reactMinus':
				setreactCount(reactCount - 1)
				break
			case 'javaPlus':
				setjavaCount(javaCount + 1)
				break
			case 'javascriptPlus':
				setjavascriptCount(javascriptCount + 1)
				break
			case 'javaMinus':
				setjavaCount(javaCount - 1)
				break
			case 'javascriptMinus':
				setjavascriptCount(javascriptCount - 1)
				break
			case 'projectMemPlus':
				setprojectLengthCount(projectLengthCount + 1)
				break
			case 'projectMemMinus':
				setprojectLengthCount(projectLengthCount - 1)
				break

		}
	}
	const [inputs, setInputs] = useState({
		userId: "",
		password: "",
		passwordConfirm: "",
		gender: "woman",
		year: 2022,
		month: 1,
		day: "",
		checkbox: {},
		content: "",
		errors: {},
	});


	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;

		if (type === "checkbox") {
			setInputs((state) => ({
				...state,
				checkbox: {
					...state.checkbox,
					[name]: checked,
				},
			}));
		} else {
			setInputs((state) => ({
				...state,
				[name]: value,
			}));
		}
	};


	// 설문 저장하기 버튼을 누를 때
	function handleSurveySaveButton() {
		// setShow(true);
		setViewSwitch('공유');
	}


	// 설문 제작 완료 버튼을 누를때 (공유탭))
	function handlePostCreateButton() {

		postDto.status = null;
		postDto.end_time = '12:12:12 12:12:00';
		postDto.end_time = '12:12:12 12:12:00';
		postDto.post_name = null;
		postDto.contents = null;
		postDto.views = 0;
		postDto.durations = projectLengthCount;
		start_time_temp = startDate + ' ' + startTime + ':00'
		end_time_temp = endDate + ' ' + endTime + ':00';

		postDto.start_time = start_time_temp;
		console.log('postdto의 시작시간', postDto.start_time);
		postDto.end_time = end_time_temp;

	
		let start_time = new Date(start_time_temp);
		let end_time = new Date(end_time_temp);
		let current_time = new Date(current_time_temp);


		if (start_time > end_time) {
			alert("설문 종료 시간은 설문 시작 시간 이전일 수 없습니다.");
		} else {
			if (start_time <= current_time && current_time <= end_time) {
				postState.current = 0;

			} else if (start_time > current_time) {
				// 배포 전
				postState.current = 1;
			} else if (end_time < current_time) {
				// 종료된 설문
				postState.current = 2;
			} else {
			}
		}

		postDto.status = postState.current;



		if (postState.current != -1) {



			// questionHandler(copy);
			postDto.post_name = postName;
			postDto.contents = postContents;

			postCatDto.spring = springCount;
			postCatDto.java = javaCount;
			postCatDto.springboot = springbootCount;
			postCatDto.javascript = javascriptCount;
			postCatDto.python = pythonCount;
			postCatDto.react = reactCount;
			postCatDto.post_id = null;

			postDto.spring = springCount;
			postDto.java = javaCount;
			postDto.springboot = springbootCount;
			postDto.javascript = javascriptCount;
			postDto.python = pythonCount;
			postDto.react = reactCount;
			postDto.postCategoryDto = postCatDto;

			console.log(users);

			
			savePost(users.id,postDto).then((response)=>{
				if(response.data.code!==1000){
					console.log("FAIL - savePost");
				}
				else{
					const chattingId=response.data.result;
					const msg=users.name+"님이 입장하셨습니다.";
					enter(socket,chattingId,msg,users.id,users.name,getDate(),"msg");
					navigate('/mainPage');
				}
			})


			console.log(postDto)

			forceUpdate();

		}
	}

	//자압구니



	return (
		

			
				<div className="mx-auto max-w-screen-lg my-4 px-4">
					<div className="mx-8 my-5">
						<h6 className="font-bold my-2 text-2xl">프로젝트 명</h6>
						<Form.Control className="w-full border contents-area my-2" size="lg" as="textarea" placeholder="프로젝트 명을 입력해주세요"
							cols="120"
							onChange={(e) => {
								setpostName(e.target.value);
							}}>{postName}</Form.Control>
						<h6 className="font-bold my-2 text-2xl">프로젝트 기간 설정</h6>
						<table className="w-full my-5 text-base border">
							<td>프로젝트 기간 설정</td>
							<td>{projectLengthCount} 개월</td>
							<td><button id='projectMemPlus' onClick={onClick}>+</button></td>
							<td><button id='projectMemMinus' onClick={onClick}>-</button></td>
						</table>
						<h6 className="font-bold my-2 text-2xl">프로젝트 인원 지정</h6>
						<div>
							<table className="w-full my-5 text-base text-left border rounded-sm">
								<thead>
									<th>분야</th>
									<th>인원 수</th>
									<th colSpan={1}></th>
								</thead>
								<tbody>
									<tr>
										<td >React</td>
										<td>{reactCount} 명</td>
										<td><button id='reactPlus' onClick={onClick}>+</button></td>
										<td><button id='reactMinus' onClick={onClick}>-</button></td>
									</tr>
									<tr>
										<td>Java</td>
										<td>{javaCount} 명</td>
										<td><button id='javaPlus' onClick={onClick}>+</button></td>
										<td><button id='javaMinus' onClick={onClick}>-</button></td>
									</tr>
									<tr>
										<td>Javascript</td>
										<td>{javascriptCount} 명</td>
										<td><button id='javascriptPlus' onClick={onClick}>+</button></td>
										<td><button id='javascriptMinus' onClick={onClick}>-</button></td>
									</tr>
									<tr>
										<td>Spring</td>
										<td>{springCount} 명</td>
										<td><button id='springPlus' onClick={onClick}>+</button></td>
										<td><button id='springMinus' onClick={onClick}>-</button></td>
									</tr>
									<tr>
										<td>Springboot</td>
										<td>{springbootCount} 명</td>
										<td><button id='springbootPlus' onClick={onClick}>+</button></td>
										<td><button id='springbootMinus' onClick={onClick}>-</button></td>
									</tr>
									<tr>
										<td>Python</td>
										<td>{pythonCount} 명</td>
										<td><button id='pythonPlus' onClick={onClick}>+</button></td>
										<td><button id='pythonMinus' onClick={onClick}>-</button></td>
									</tr>
								</tbody>
							</table>
						</div>
						<h6 className="font-bold mb-5 text-2xl">프로젝트 기간 설정</h6>
						<h6 className="font-bold mb-5 text-xl text-center">날짜를 드래그하거나 클릭하세요! 😉</h6>
						<div className="text-center p-4" >
							<DateRangeSelector startDateHandler={setStartDate} endDateHandler={setEndDate} startTimeHandler={setStartTime} endTimeHandler={setEndTime} />
							
							<h6 className="font-bold mb-5 text-2xl text-left">프로젝트 소개! 😉</h6>
							<Form.Group>
								<Form.Control className="border contents-area w-full" size="lg" as="textarea" placeholder="프로젝트 소개를 입력해주세요"
									rows="5"
									cols="120"
									onChange={(e) => {
										setpostContents(e.target.value);
									}}
									maxLength = "300"
									>{postContents}</Form.Control>

								<div className="auth__contentCount" style={postContents.length == 300 ? {color: 'red'} : {color : 'black'}}>
									<span>{`${postContents.length} / 300`}</span>
								</div>
							</Form.Group>
							<div className='text-right'>
								<button className="font-bold my-5 text-2xl border-2 border-sky-200 hover:bg-sky-100 rounded-md p-1"
									onClick={() => {
										let flag = false;
										let tmp = ""
										if (postName == ""){
											console.log("왔다");
											tmp += "제목, "
											flag = true
										}

										if (postContents == ""){
											console.log("왔다");
											tmp += "프로젝트 소개, "
											flag = true
										}
										if (flag){
											console.log(tmp)
											setModalname(tmp.substring(0,tmp.length-2))
											openModal();
										}
										else{
											handlePostCreateButton()
										}
									}}>게시글 게시</button>
								{ModalOpen && <Modal open={ModalOpen} close={closeModal}  header = "필수항목 미입력">
                                        {modalname} 을(를) 입력해주세요
                                    </Modal>
									}
								<button className="ml-2 font-bold my-5 text-2xl border-2 border-red-200 hover:bg-red-100 rounded-md p-1"
									onClick={() => {
										navigate('/mainPage')
									}}>작성 취소</button>
							</div>



						</div>

					</div>

				</div>


			

	);
}

export { CreatePost };

