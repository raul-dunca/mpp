import { CssBaseline, Container, Typography, Card, CardContent, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Users } from "../models/User";
import jwt_decode from 'jwt-decode';
import { BACKEND_API_URL } from "../constants";
import axios from "axios";

export const Home = () => {

	const [user, setUser] = useState<Users>({
        username: '',
        email: '',
        birthday: '',
        bio: '',
        gender: '',
        country: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
		const refresh_token=localStorage.getItem('refres_token');
        if (token) {
        const decoded: any = jwt_decode(token);
		if (decoded.exp < Date.now() / 1000) {
			axios.post(`${BACKEND_API_URL}/token/refresh`, { refresh: refresh_token })
			.then(response => {
			  const newToken = response.data.access;
			  console.log(newToken);
			  localStorage.setItem('token', newToken);
			  window.location.reload();
			});
	  }
		console.log(decoded);
        const user_id = decoded['user_id'];
		//console.log(user_id)
        fetch(`${BACKEND_API_URL}/user/details/${user_id}`, {
			headers: {
			  Authorization: `Bearer ${token}`,
			},
		  })
			.then((response) => response.json())
			.then((data) => {
			  //console.log(data);
			  setUser(data);
			})
			.catch((error) => {
			  console.log(error);
			});
        }
		else
		{
			window.location.href = `/login`;
		}
    }, []);



	return (
		<div style={{ color:'white', marginTop:'5%' }}>
		<React.Fragment>
			<CssBaseline />
			<h1>Welcome back, {user.username}!</h1>
			<TextField
			id="page_sizes"
			label="Page Size"
			variant="outlined"
			fullWidth
			sx={{ mb: 2, color: "whitesmoke !important" }}
			value={user.page_size}
			type="number"
			onChange={(event) => {
				const size = Number(event.target.value);
				if (size <= 0 || size > 100) {
					alert("The value needs to be between 1 and 100!");
					return;
				}
				
				localStorage.setItem('page_nr',size.toString());
			}}
			/>
			<Container style={{ height:'100vh',marginTop:'100px'}}>
			<Card >
				<CardContent>
				<TextField
					id="username"
					label="Username"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.username}
					InputProps={{
						readOnly: true,
					}}
				/>

				<TextField
					id="email"
					label="Email"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.email}
					InputProps={{
						readOnly: true,
					}}
				/>

				<TextField
					id="birthday"
					label="Birthday"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.birthday}
					InputProps={{
						readOnly: true,
					}}
				/>

				<TextField
					id="bio"
					label="Bio"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.bio}
					InputProps={{
						readOnly: true,
					}}
				/>

				<TextField
					id="country"
					label="Country"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.country}
					InputProps={{
						readOnly: true,
					}}
				/>

				<TextField
					id="gender"
					label="Gender"
					variant="outlined"
					fullWidth
					sx={{ mb: 2}}
					value={user.gender}
					InputProps={{
						readOnly: true,
					}}
				/>

			</CardContent>
		</Card>
			</Container>
		</React.Fragment>
		</div>
	);
};





