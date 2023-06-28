import { Card, CardActions, CardContent, IconButton, Toolbar, Tooltip } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dogs } from "../../models/Dogs";
import { BACKEND_API_URL } from "../../constants";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from "axios";
import { Toys } from "../../models/Toys";
import jwt_decode from 'jwt-decode';

export const ToysDetails = () => {
	const { toyId } = useParams();
    const [toy, setToys] = useState<Toys>();
	const token = localStorage.getItem('token');
	const refresh_token=localStorage.getItem('refres_token');

	useEffect(() => {
		const fetchToy = async () => {
			try {
                const response = await axios.get(`${BACKEND_API_URL}/toys/${toyId}`,{
					headers: {
					'Authorization': `Bearer ${token}`
					}
				});
                const toy = response.data;
                setToys(toy);
             } catch (error) {
                console.log(error);
             }
		};
		fetchToy();
	}, [toyId]);


   
	const handleBtnClick = () => {
			
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
		
	  }
  };


	return (
		<Container style={{ height:'100vh',marginTop:'100px'}}>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/toys`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Toy Details</h1>
					<p>Toy Name: {toy?.name}</p>
					<p>Toy Material: {toy?.material}</p>
					<p>Toy Colour: {toy?.colour}</p>
					<p>Toy Price: {toy?.price}</p>
                    <p>Toy Description: <br/>
                          {toy?.descriptions}</p>
                    <p>Toy dog:</p>
					<ul>
						
						<li key={toy?.dog.id}>{toy?.dog.name} {toy?.dog.breed} of colour {toy?.dog.colour} with date of birth: {toy?.dog.date_of_birth.toString()}</li>
						
					</ul>
                    
					
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/toys/${toyId}/edit`} onClick={handleBtnClick}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/toys/${toyId}/delete`} onClick={handleBtnClick}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};