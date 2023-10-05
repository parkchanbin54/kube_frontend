import { Button } from 'react-bootstrap';
import Fade from "react-reveal/Fade"; // Import reasct-reveal(Fade)
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from "styled-components";
import main from '../../promo_main.png';
import { KAKAO_AUTH_URL } from '../../OAuth';
import { userState } from '../../atom';


const IntroBlock = styled.div`
  margin: 0px 0px 100px 0px;
  text-align : center;  
  
  h1 {
	margin: 10px;
	text-align : center;
    font-weight: 330;
    font-size: 45px;
  }  

  h2 {
    margin: 10px;
	margin-top: 200px;
	text-align : center;
    font-weight: 300;
    font-size: 50px;
  }

  h3 {
	text-align : center;
    font-weight: 200;
    font-size: 25px;
  }

  h6 {
	text-align : center;
    font-weight: 200;
    font-size: 70px;
  }

  img {
	// display: block;
	margin-left:auto;
	margin-right:auto;
	padding: 5px;
  }

  @media (max-width: 768px) {
	margin: 0px 0px 100px 0px;
  
	main {
		margin-left: 20px;
		margin-right: 20px;		
		text-align : center;
		font-weight: 400;
		font-size: 60px;
	  }
	 
	sub-main {
		margin-left: 10px;
		margin-right: 10px;
		text-align : center;
		font-weight: 370;
		font-size: 30px;
	  }
	  
	h1 {
	  margin: 10;
	  margin-right: 20px;
	  margin-left: 20px;
	  text-align : center;
	  font-weight: 330;
	  font-size: 30px;
	}  
  
	h2 {
	  margin-top: 150px;
	  margin-right: 20px;
	  margin-left: 20px;
	  text-align : center;
	  font-weight: 300;
	  font-size: 25px;
	}
  
	h3 {
	  text-align : center;
	  margin-right: 20px;
	  margin-left: 20px;
	  font-weight: 200;
	  font-size: 15px;
	}
  
	h6 {
		text-align : center;
		font-weight: 200;
		font-size: 35px;
	}




  }
`
function AboutProduct() {

	let navigate = useNavigate();
	// 유저 상태관리

	const users = useRecoilValue(userState);
	const userHandler = useSetRecoilState(userState);

	const handleLogin = () => {
		window.location.href = KAKAO_AUTH_URL;
	};

	return (
		<div className="mx-auto max-w-screen-lg px-4 sm:px-6">
				<Fade big>
					<IntroBlock>
						<img src={main} style={{ width:'90%'}} />

						<br/>
						<div style={{ textAlign: 'center' }}>
							<btn><button className ="text-3xl hover:scale-110"
								size="lg" onClick={users.login ? () => navigate("/create") : handleLogin}>
								👉 시작하기
							</button></btn>
						</div>
						
					</IntroBlock>

				</Fade>

		</div >
	)
}

export { AboutProduct };
