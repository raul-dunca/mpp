import { CssBaseline, Container, Typography, Card, CardContent, TextField, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Users } from "../models/User";
import jwt_decode from 'jwt-decode';
import { BACKEND_API_URL } from "../constants";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUsers] = useState<Users>();
	const token = localStorage.getItem('token');

    useEffect(() => {
		const fetchUser = async () => {
			try {
                const response = await axios.get(`${BACKEND_API_URL}/user/details/${userId}`,{
					headers: {
					  'Authorization': `Bearer ${token}`
					}
				  })
                console.log(response);
                const user = response.data;
                setUsers(user);
             } catch (error) {
                console.log(error);
             }
		};
		fetchUser();
	}, [userId]);



	return (
		
			
			<Container style={{ height:'100vh',marginTop:'100px'}}>
			<Card >
            <CardContent>
            <IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>{user?.username}'s Profile!</h1>
					<p>Email: {user?.email}</p>
					<p>Bio: {user?.bio}</p>
					<p>Birthday: {user?.birthday}</p>
					<p>Country: {user?.country}</p>
                    <p>Gender: <br/>{user?.gender}</p>
                    <p>Dogs Created: <br/>{user?.nr_of_dogs}</p>
					<p>Owners Created: <br/>{user?.nr_of_owners}</p>
					<p>Toys Created: <br/>{user?.nr_of_toys}</p>
					<p>DogOwners Created: <br/>{user?.nr_of_dogowners}</p>
					
				</CardContent>
		</Card>
			</Container>
		
	);
};





