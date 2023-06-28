import { Button, Card, CardContent, Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from '../constants';

export const LoginForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const token = localStorage.getItem('token');
			
         if(token)
         {
         alert("You are already logged in!");
         }
         else{
        try {
            const data = {
                username: formData.username,
                password: formData.password
            }
            const response = await axios.post(`${BACKEND_API_URL}/user/login`, data);
            const access_token = response.data['access'];
            const refresh_token = response.data['refresh'];
            console.log(access_token);
            localStorage.setItem('token', access_token);
            localStorage.setItem('refres_token', refresh_token);
            navigate(`/`);
        }
    
        catch (error: any) {
            if (error.response.status === 401) {
                alert("Incorrect username or password");
            }
            else {
                alert("An error occurred. Please try again later.");
            }
        }
    }
    };

    return (
        <Container style={{ height:'100vh',marginTop:'100px'}}>
            <Card >
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            id="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={(event) => setFormData({ ...formData, username: event.target.value })}
                        />

                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            
                            type="password"
                            onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                        />

                        <Button sx={{margin:'10px',marginRight:'20px' }}type="submit">Login</Button>    
                        <br></br>
                        <Button sx={{margin:'10px',marginLeft:'920px' }} component={Link} to="/register" variant="contained"  color="primary" >
  Sign up!
</Button>
                    </form>

                </CardContent>
            </Card>
        </Container>
    );
};