import React,{ useCallback, useEffect, useRef, useState } from 'react';
import { Card,Form} from 'react-bootstrap';
// import { Helmet } from 'react-helmet';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue} from 'recoil';
import axios from 'axios';
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { userState } from '../../atom';
import './UpdatePost.css';
import { BACKEND_API_BASE_URL } from '../../services/PostService';
/* eslint-disable */
function UpdatePost() {

	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({}, []));


	let [curSelectedType] = useState('Type');
	let [makeQsSwitch] = useState(false);

	//post에 사용
	let [postName, setpostName] = useState(null);
	let [postContents, setpostContents] = useState(null);
	let [endtime, setendtime] = useState("");
	let [starttime, setstarttime] = useState("");
	let postState = useRef(-1);
	window.localStorage.setItem("count", 1);

	//저장시 모달 보여주기에서 사용
	const [show, setShow] = useState(false);
	const [showCreate, setShowCreate] = useState(false);

	let navigate = useNavigate();


	let postDto = new Object();
	let postCatDto = new Object();


	const location = useLocation();
	let post_id = location.state.id;

	// surveyDto
	postDto.status = null;
	postDto.end_time = '12:12:12 12:12:00';
	postDto.end_time = '12:12:12 12:12:00';
	postDto.post_name = "";
	postDto.contents = "";
	postDto.views= 0;

	const users = useRecoilValue(userState);
	useEffect(() => {
		setTimeout(function () {
			getPostInfo();
        }, 500);
	}, [curSelectedType, makeQsSwitch, showCreate])

    const [selectedDateRange, setSelectedDateRange] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection"
    });


    const orientation = window.matchMedia("(max-width: 500px)").matches
        ? "vertical"
        : "horizontal";

    function formatDateDisplay(date, defaultText) {
        if (!date) return defaultText;
        return format(date, "yyyy-MM-dd");
    }

    const handleSelect = (ranges) => {
        setSelectedDateRange(ranges.selection);
        console.log(ranges.selection);
    };

    const onClickClear = () => {
        setSelectedDateRange({
            startDate: new Date(),
            endDate: new Date(),
            key: "selection"
        });

    };

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



	postDto.starTime = timeString;
	postDto.endTime = timeString;

	let start_time_temp = dateString + ' ' + timeString + ':00';
	let end_time_temp = nextDateString + ' ' + timeString + ':00';

	const [startDate] = useState(dateString);
	const [startTime, setStartTime] = useState(timeString);
	const [endDate] = useState(nextDateString);
	const [endTime, setEndTime] = useState(timeString);
	
	const [springbootCount, setspringbootCount] = useState(0);
	const [pythonCount, setpythonCount] = useState(0);
	const [springCount, setspringCount] = useState(0);
	const [reactCount, setreactCount] = useState(0);
	const [javaCount, setjavaCount] = useState(0);
	const [javascriptCount, setjavascriptCount] = useState(0);

	const [projectLengthCount, setprojectLengthCount] = useState(0);

	const onClick = (event) => {
		const id = event.target.id;
		switch(id){
			case 'springPlus':
				setspringCount(springCount+1)
				break
			case 'pythonPlus':
				setpythonCount(pythonCount+1)
				break
			case 'springMinus':
				setspringCount(springCount-1)
				break
			case 'pythonMinus':
				setpythonCount(pythonCount-1)
				break
			case 'springbootPlus':
				setspringbootCount(springbootCount+1)
				break
			case 'reactPlus':
				setreactCount(reactCount+1)
				break
			case 'springbootMinus':
				setspringbootCount(springbootCount-1)
				break
			case 'reactMinus':
				setreactCount(reactCount-1)
				break
			case 'javaPlus':
				setjavaCount(javaCount+1)
				break
			case 'javascriptPlus':
				setjavascriptCount(javascriptCount+1)
				break
			case 'javaMinus':
				setjavaCount(javaCount-1)
				break
			case 'javascriptMinus':
				setjavascriptCount(javascriptCount-1)
				break
			case 'projectMemPlus':
				setprojectLengthCount(projectLengthCount+1)
				break
			case 'projectMemMinus':
				setprojectLengthCount(projectLengthCount-1)
				break
			default:
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


	function getPostInfo(){
		console.log("stateId"+location.state.id);
		post_id = location.state.id;
       		axios.get(`${BACKEND_API_BASE_URL}/api/post/info/${post_id}`)
			.then((response) => {
                console.log('get data.data.token', "-", response, "-");
				postDto.post_name = response.data.post_name;
				postDto.contents = response.data.contents;
				postDto.start_time = response.data.start_time;
				postDto.end_time = response.data.end_time;
				const stimes = postDto.start_time.split(' ');
				const etimes = postDto.end_time.split(' ');
				postDto.startDate = stimes[0];
				postDto.startTime = stimes[1];
				postDto.id = response.data.id;
				postDto.endDate =  etimes[0];
				postDto.endTime = etimes[1];
				postCatDto.id = response.data.post_category[1].id;
				setSelectedDateRange({
					startDate: new Date(postDto.startDate),
					endDate: new Date(postDto.endDate),
					key: "selection"
				});

				
				setprojectLengthCount(response.data.duration);
				setspringCount(response.data.post_category[1].spring);
				setspringbootCount(response.data.post_category[1].springboot);
				setpythonCount(response.data.post_category[1].python);
				setreactCount(response.data.post_category[1].react);
				setjavaCount(response.data.post_category[1].java);
				setjavascriptCount(response.data.post_category[1].javascript);

            })
            .catch((error) => {
                console.log(error);
                console.log('실패');
                return "error";
            })
			.finally(() => {
				setpostName(postDto.post_name);
				setpostContents(postDto.contents);
				setstarttime(postDto.startTime.slice(0,5));
				setendtime(postDto.endTime.slice(0,5));
				console.log("ㅔㅐㄴㅇ"+postDto.id);
				console.log(postDto);
			});
        }
	

	function handlePostCreateButton() {

		postDto.status = null;
		postDto.post_name = "";
		postDto.contents = "";
		postDto.views= 0;
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

		} else {
			if (start_time <= current_time && current_time <= end_time) {
				postState.current = 0;

			} else if (start_time > current_time) {
				// 배포 전
				postState.current = 1;
			} else if (end_time < current_time) {
				postState.current = 2;
			} else {
			}
		}

		postDto.status = postState.current;

	


		if (postState.current != -1) {

			

			
			postDto.post_name = postName;
			postDto.contents = postContents;

			postCatDto.spring = springCount;
			postCatDto.java = javaCount;
			postCatDto.springboot = springbootCount;
			postCatDto.javascript = javascriptCount;
			postCatDto.python = pythonCount;
			postCatDto.react = reactCount;

			postDto.spring = springCount;
			postDto.java = javaCount;
			postDto.springboot = springbootCount;
			postDto.javascript = javascriptCount;
			postDto.python = pythonCount;
			postDto.react = reactCount;
			postDto.postCategoryDto = postCatDto;
			postDto.id = location.state.id;

			console.log(users);
			console.log("postDto",postDto)
			axios.post(`/${BACKEND_API_BASE_URL}/api/post/save/${users.id}`, postDto)
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			})

			console.log(postDto)

			forceUpdate();
		
		}
	}

	return (
		<>
					
					<>
						<div className="mx-auto max-w-screen-lg my-4 px-4">
							<div className="mx-8 my-5">
								<h6 className ="font-bold my-2 text-2xl">프로젝트 명</h6>
								<Form.Control className="w-full border contents-area my-2" size="lg" as="textarea"
									cols= "120"
									defaultValue={postName}
									onChange={(e) => {
										setpostName(e.target.value);
									}}></Form.Control>
								<h6 className ="font-bold my-2 text-2xl">프로젝트 기간 설정</h6>
								<table className="w-full my-5 text-base border">
									<td>프로젝트 기간 설정</td>
									<td>{projectLengthCount} 개월</td>
									<td><button id = 'projectMemPlus' onClick= {onClick}>+</button></td>
									<td><button id = 'projectMemMinus' onClick= {onClick}>-</button></td>
								</table>
								<h6 className ="font-bold my-2 text-2xl">프로젝트 인원 지정</h6>
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
											<td><button id = 'reactPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'reactMinus' onClick= {onClick}>-</button></td>
										</tr>
										<tr>
											<td>Java</td>
											<td>{javaCount} 명</td>
											<td><button id = 'javaPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'javaMinus' onClick= {onClick}>-</button></td>
										</tr>
										<tr>
											<td>Javascript</td>
											<td>{javascriptCount} 명</td>
											<td><button id = 'javascriptPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'javascriptMinus' onClick= {onClick}>-</button></td>
										</tr>
										<tr>
											<td>Spring</td>
											<td>{springCount} 명</td>
											<td><button id = 'springPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'springMinus' onClick= {onClick}>-</button></td>
										</tr>
										<tr>
											<td>Springboot</td>
											<td>{springbootCount} 명</td>
											<td><button id = 'springbootPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'springbootMinus' onClick= {onClick}>-</button></td>
										</tr>
										<tr>
											<td>Python</td>
											<td>{pythonCount} 명</td>
											<td><button id = 'pythonPlus' onClick= {onClick}>+</button></td>
											<td><button id = 'pythonMinus' onClick= {onClick}>-</button></td>
										</tr>
									</tbody>
								</table>
								</div>
								<h6 className ="font-bold mb-5 text-2xl">프로젝트 기간 설정</h6>
								<h6 className ="font-bold mb-5 text-xl text-center">날짜를 드래그하거나 클릭하세요! 😉</h6>
								<div className="text-center p-4" >
								<React.Fragment style={{ width: "80%" }}>
            <div className="shadow d-inline-block" style={{marginBottom:'20px'}}>
                <DateRange
                    onChange={handleSelect}
                    defaultValue = {"Wed Feb 02 2023 00:00:00 GMT+0900"}
                    showSelectionPreview={true}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    color='#0d6efd'
                    rangeColors={['#0d6efd', 'red']}
                    ranges={[selectedDateRange]}
                    direction={orientation}
                    // orientation="horizontal"
                    autoFocus/>
                <div className="text-right position-relative rdr-buttons-position mt-2 mr-3" style={{ bottom: "0.3rem" }}>
                    <button
                        className="btn btn-transparent text-primary rounded-0 px-4 mr-2"
                        onClick={() => setShow(true)}
                    >
                        확인
                    </button>
                    <button
                        className="btn btn-transparent text-danger rounded-0 px-4"
                        onClick={onClickClear}
                    >
                        초기화
                    </button>
                </div>
            </div>

            
                <div className=" h-100 mt-3 alert alert-transparent" direction={orientation}>
                    <h6 className ="font-bold mb-5 text-2xl"><strong>⏰ 를 눌러서 시간을 조정할 수 있어요!</strong></h6>

                    <Card className='basicCard' key={"key"} style={{ display: "inline-block", margin: "2%", marginBottom: "3%", padding: "4%", border: "none", borderRadius: "20px", boxShadow: "1px 1px 4px 0px gray" }}>
                        <h5>
                            시작 일시
                        </h5>
                        <div style={{ fontWeight: "bold", marginTop: "2%", float: "left" }}>
                            
                            {formatDateDisplay(selectedDateRange.startDate)}
                            <Form.Control type="time"
                                style={{ marginBottom: "1%", background: "rgba(0,0,0,0)", color: "black", border: "none", boxShadow: "none", display: "inline-block" }}
                                defaultValue={starttime} onChange={(e) => setStartTime(e.target.value)}  />
                        </div>
                    </Card>
                    <Card className='basicCard' key={"key"} style={{ display: "inline-block", margin: "2%", marginBottom: "3%", padding: "4%", border: "none", borderRadius: "20px", boxShadow: "1px 1px 4px 0px gray" }}>
                        <h5>
                            마감 일시
                        </h5>
                        <div style={{ fontWeight: "bold", marginTop: "2%", float: "left" }}>
                        
                            {formatDateDisplay(selectedDateRange.endDate)}
                            <Form.Control type="time"
                                style={{ marginBottom: "1%", background: "rgba(0,0,0,0)", color: "black", border: "none", boxShadow: "none", display: "inline-block" }}
                                onChange={(e) => setEndTime(e.target.value)} defaultValue={endtime} />
                        </div>
                    </Card>
                </div>

            
        </React.Fragment>

								<h6 className ="font-bold mb-5 text-2xl text-left">프로젝트 소개! 😉</h6>
									<Form.Group>
								<Form.Control className="border contents-area w-full" size="lg" as="textarea" placeholder="프로젝트 소개를 입력해주세요"
									rows = "5"
									cols= "120"
									defaultValue={postContents}	
									onChange={(e) => {
										setpostContents(e.target.value);
									}}></Form.Control>
	                            
                            <div className="auth__contentCount">
                                <span>{`${inputs.content.length} / 300`}</span>
                            </div>
                        </Form.Group>
								<div className='text-right'>
									<button className="font-bold my-5 text-2xl border-2 border-sky-200 hover:bg-sky-100 rounded-md p-1"
										onClick={() => {
											handlePostCreateButton()
										}}>게시글 게시</button>

										<button className="ml-2 font-bold my-5 text-2xl border-2 border-red-200 hover:bg-red-100 rounded-md p-1"
										onClick={() => {
											navigate('/mainPage')
										}}>작성 취소</button>
								</div>
								


							</div>

						</div>

						</div>

						
					</>
		</>

	);
}

export { UpdatePost };

