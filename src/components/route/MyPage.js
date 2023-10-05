/* eslint-disable */
// @mui
import { Container, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
// hooks
import React, { useCallback,useEffect, useState } from "react";
import useResponsive from '../../hooks/useResponsive';
import { useSelector } from 'react-redux';

import { useRecoilValue, useSetRecoilState  } from 'recoil';
import { userState } from '../../atom';
import "./MyPage.css";

// ----------------------------------------------------------------------
import Sidebar  from './Sidebar';



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


function MyPage() {
    const users = useRecoilValue(userState);
    let socket=useSelector(state=>state.socket.socket);
	console.log('redux test - socket',socket);
    let userDto = new Object();
    let userCategoryDto = new Object();

    userCategoryDto.spring = 0;
    userCategoryDto.java = 0;
    userCategoryDto.springboot = 0;
    userCategoryDto.javascript = 0;
    userCategoryDto.python = 0;
    userCategoryDto.react = 0;
    userCategoryDto.user_id = null;

    const mdUp = useResponsive('up', 'md');

    return (
        <div className ="mx-auto my-4 px-4 max-w-screen-xl">
            <Sidebar />
            <div className="my-5 flex mx-auto max-w-7xl sm:px-6" style={{marginRight : 40}}>

                

                {mdUp && (
                    <StyledSection>
                       
                        <div className="box" style={{ background: "#BDBDBD" ,marginTop: 40 }}>
                            {/* <img className="profile" src='https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/944/eabb97e854d5e5927a69d311701cc211_res.jpeg' /> */}
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
                            마이페이지🤗
                        </Typography>

                        <hr style={{ marginBottom: 50 }}></hr>

                        <Stack spacing={3}>
                            <TextField label="이메일" defaultValue={users.email} inputProps={{ }} />
                            <TextField label="성별" defaultValue={users.gender} inputProps={{ }} />
                            <TextField label="연령대" defaultValue={users.age} inputProps={{ }} />
                            
                        </Stack>
                        
                   
                    </StyledContent>
					
                </Container>
            </div>
            
         
        

           
            </div>
    );
}

export { MyPage };





