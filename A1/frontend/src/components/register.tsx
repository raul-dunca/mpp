import { Button, Card, CardContent, Container, TextField } from '@mui/material';
import React, { useState } from 'react';
import axios from 'axios';
import countries from 'country-list';
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_API_URL } from '../constants';

export const RegisterForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email:'',
        bio: '',
        birthday: '',
        country: '',
        gender: '',

    });
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [birthday, setBirthday] = useState("");
    const [country, setCountry] = useState("");
    const [gender, setGender] = useState("");

    const handleUsernameChange = (event:any) => {
        setUsername(event.target.value);
        setFormData({ ...formData, username: event.target.value });
      };

    const handleCountryChange = (event:any) => {
        setCountry(event.target.value);
        setFormData({ ...formData, country: event.target.value });
      };

    const handleGenderChange = (event:any) => {
        setGender(event.target.value);
        setFormData({ ...formData, gender: event.target.value });
      };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        if (username.length==0 || password.length==0 || email.length==0 || birthday.length==0 || bio.length==0 || country.length==0 || gender.length==0)
        {
            alert("Please fill in all the fields !");
        }
        else
        {
        if (username.length<4)
        {
            alert("Username needs to have at least 4 characters !");
        }
        else
        {
        const response = await axios.post(`${BACKEND_API_URL}/check-username/`,{username: username});
        
        if (response.data.message=="Username is unique") {
        try {
            const data = {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                bio: formData.bio,
                birthday: formData.birthday,
                country: formData.country,
                gender: formData.gender
            }
            console.log(data);
            const response = await axios.post(`${BACKEND_API_URL}/user/register`, data);
            const confirmation_code = response.data['Confirmation Code'];
            
            navigate(`/activate/${confirmation_code}`);
        }
        catch (error: any) {
            const errors = error.response.data.user;
        for (const key in errors) {
            alert(`${key}: ${errors[key]}`);
            }
        }
      }
      else
      {
        alert("Username is already taken !");
      }
    }
}
    };

    const [EmailError, setEmailError] = useState('');
	function handleEmailChange(event:any) {
        setEmail(event.target.value);
		const input = event.target.value;
		const regex= /^.+@.+\..+$/;
		if ( ! regex.test(input))
		{	
			
			setEmailError('Invalid email !');
			setFormData({ ...formData, email: input });
			
		} else {
		    setEmailError('');
		    setFormData({ ...formData, email: input });
		}
	}


    const [BioError, setBioError] = useState('');
	function handleBioChange(event:any) {
        setBio(event.target.value);
		const input = event.target.value;
		
		if (input.length > 160) {
            setBioError('Bio must be less than or equal to 160 characters!');
            setFormData({ ...formData, bio: input });
        } else {
            setBioError('');
            setFormData({ ...formData, bio: input });
	}
}
    
const [DateError, setDateError] = useState('');
function handleDateChange(event:any) {
    setBirthday(event.target.value);
    const input = event.target.value;
    const regex= /^\d{4}-\d{1,2}-\d{1,2}$/;
    const max_date="2016-01-01"
    if (regex.test(input))
    {	
        if (input >max_date) {

      setDateError('Date must be smaller than '+max_date);
      setFormData({ ...formData, birthday: input });
    } else {
      setDateError('');
      setFormData({ ...formData, birthday: input });
    }
}
    else
    {
        setDateError('Invalid date!');
        setFormData({ ...formData, birthday: input });
    }
}


const [PasswordError, setPasswordError] = useState('');
function handlePasswordChange(event:any) {
    setPassword(event.target.value);
    const input = event.target.value;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^-_+=?/])[A-Za-z\d@$!%*?&#^-_+=?/]{8,}$/;
    if (!passwordRegex.test(input)) {
        setPasswordError('Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, and one special character (@$!%*?&#^-_+=?/)');
        setFormData({ ...formData, password: input });
      } else if (!/\d/.test(input)) {
        setPasswordError('Password must contain at least one number');
        setFormData({ ...formData, password: input });
      } else {
        setPasswordError('');
        setFormData({ ...formData, password: input });
      }
}
 



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
                            value={username}
                            onChange={handleUsernameChange}
                        />

                        <TextField
                            id="password"
                            label="Password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            //type="password"
                            onChange={handlePasswordChange}
        					error={!!PasswordError}
        					helperText={PasswordError}
                        />

                        <TextField
                            id="email"
                            label="Email"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleEmailChange}
        					error={!!EmailError}
        					helperText={EmailError}
                        />

                        <TextField
                            id="birthday"
                            label="Birthday"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleDateChange}
        					error={!!DateError}
        					helperText={DateError}
                        />

                        <TextField
                            id="bio"
                            label="Bio"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleBioChange}
        					error={!!BioError}
        					helperText={BioError}
                        />

                        <TextField
                            id="country"
                            label="Country"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleCountryChange}
                        />

                        <TextField
                            id="gender"
                            label="Gender"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleGenderChange}
                        />

                        <Button sx={{margin:'10px',marginRight:'20px' }} type="submit">Register</Button>
                        <br></br>
                        <Button sx={{margin:'10px',marginLeft:'920px' }} component={Link} to="/login" variant="contained"  color="primary" >
  Login
</Button>
                    </form>

                </CardContent>
            </Card>
        </Container>
    );
};