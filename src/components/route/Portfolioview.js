// @mui
import { Container, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import React, { useCallback,useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
// components
import { Button } from 'react-bootstrap';
import { useRecoilValue, useSetRecoilState  } from 'recoil';
import { userState } from '../../atom';
import "./Portfolio.css";


// ----------------------------------------------------------------------
import Sidebar  from './Sidebar';
import { BACKEND_API_BASE_URL } from '../../services/PostService';
const StyledRoot = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex',
    },
}));
const fileTypes = ["PDF", "PPTX"];

const StyledSection = styled('div')(({ theme }) => ({
    width: '100%',
    maxWidth: 480,
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: theme.customShadows,
    backgroundColor: theme.palette.background.default,
}));

const StyledContent = styled('div')(({ theme }) => ({
    maxWidth: 480,
    margin: 'auto',
    // minHeight: '85vh',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    padding: theme.spacing(5, 0),
}));

function Portfolioview() {


    const [, updateState] = useState();
	let [school, setSchool] = useState(null);
    let [tech, setTech] = useState(null);
    const [show, setShow] = useState(false);
    const users = useRecoilValue(userState);

    let userDto = new Object();
    let userCategoryDto = new Object();

    userCategoryDto.spring = 0;
    userCategoryDto.java = 0;
    userCategoryDto.springboot = 0;
    userCategoryDto.javascript = 0;
    userCategoryDto.python = 0;
    userCategoryDto.react = 0;
    userCategoryDto.user_id = null;
    
    
    
    const forceUpdate = useCallback(() => updateState({}, []));
    const userHandler = useSetRecoilState(userState);
    let navigate = useNavigate();

    const mdUp = useResponsive('up', 'md');
    let history = useNavigate(); 
    const [imgBase64, setImgBase64] = useState([]); // 파일 base64
    const [imgFile, setImgFile] = useState(null);	//파일	
    const [tag, setTag] = useState([]);
    const [comment,setComment] = useState();
    var images = []
    var filename = "";
    
    
    const data = [
        {id: 0, title: 'Spring'},
        {id: 1, title: 'Springboot'},
        {id: 2, title: 'Python'},
        {id: 3, title: 'React'},
        {id: 4, title: 'JavaScript'},
        {id: 5, title: 'Java'}
      ];

      const [checkItems, setCheckItems] = useState([]);

      const handleSingleCheck = (checked, id) => {
        if (checked) {
          setCheckItems(prev => [...prev, id]);
        } else {
          setCheckItems(checkItems.filter((el) => el !== id));
        }
        console.log(checkItems);
      };
    
      const handleAllCheck = (checked) => {
        if(checked) {
          const idArray = [];
          data.forEach((el) => idArray.push(el.id));
          setCheckItems(idArray);
        }
        else {
          setCheckItems([]);
        }
        console.log(checkItems);
      }
    
      
    
    
    
    const [file, setFile] = useState(null);


    const userChange = (users) => {
        window.location.reload();
      };

    const handleChange = (file) => {
      setFile(file);
      filename = file.name;
      console.log(filename);
      console.log(file);
    };

    let refresh_check = false;



    
    const onClick = (event) => {
		const id = event.target.id;
		switch(id){
            case 'download':
                navigate('/portfolioview');
                console.log(users.portsave);    
                if ( window.location == 'http://teamchat.shop/portfolioview' ) {
                     window.location.href=`/api/user/attached/`+users.portsave;
                }
                
                navigate('/portfolioview');


                forceUpdate();
				break
        }
    
    }


    return (
        <div className ="mx-auto my-4 px-4 max-w-screen-xl">
            <Sidebar />
            <div className="my-5 flex mx-auto max-w-7xl sm:px-6" style={{marginRight : 40}}>
            

                {mdUp && (
                    <StyledSection>
                    
                        <div className="box" style={{ background: "#BDBDBD" ,marginBottom: 250 }}>
                            <img className="profile" src={users.profileImg} />
                        </div>
                    </StyledSection>
                )}

                <Container maxWidth="sm" >
                    <StyledContent>
                        <Typography variant="h4" gutterBottom style={{ marginTop: 30}}>
                            안녕하세요. <strong>{users.name}</strong>님
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            포트폴리오🤗
                        </Typography>

                        <hr style={{ marginBottom: 50 }}></hr>

                        <Stack spacing={3}>
                            <TextField label="이메일" defaultValue={users.email} inputProps={{ }} />
                            <TextField label="성별" defaultValue={users.gender} inputProps={{ }} />
                            <TextField label="연령대" defaultValue={users.age} inputProps={{ }} />
                            <TextField label="학교" defaultValue={users.school} inputProps={{ }} onChange={(e) => {
											setSchool(e.target.value);
										}}> </TextField> 
                            <TextField label="기술 스택" defaultValue={users.tech} inputProps={{ }} style={{marginBottm:20}} onChange={(e) => {
											setTech(e.target.value);
										}}></TextField>
                        </Stack>
                    <Typography variant="h6" gutterBottom style={{ marginTop: 50}}>
                            포트폴리오 파일
                        </Typography>
                    {users.portname != "" &&<Button id="download" onClick= {onClick} variant="h9" style={{ marginTop: 10}}>
                        {users.portname}
                    </Button>}

                    <a thhref="|/attached/${filename}|" thtext="dddd"/>
                    {users.portname == ""&&<Typography variant="h9" style={{ marginTop: 50}}>
                        {filename}
                    
                    </Typography>}
                
                    </StyledContent>
					
                    <div className="text-center">
									<button className="ml-auto border-2 rounded-md p-1 border-sky-200 my-4 text-2xl font-bold hover:bg-sky-200"
                                    
										onClick={() => {
											navigate('/portfolio')
										}}>수정하기</button>
                                        </div>
                </Container>
            </div>
            
         
        

           
        </div>
    );
}

export { Portfolioview };

