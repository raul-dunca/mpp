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
//import { currentPage } from './DogsShowAll';
import jwt_decode from 'jwt-decode';

export const DogsDetails = () => {
	const { dogId } = useParams();
    const [dog, setDogs] = useState<Dogs>();
	
	const token = localStorage.getItem('token');
	const refresh_token = localStorage.getItem('refres_token');
	useEffect(() => {
		const fetchDog = async () => {
			try {
                const response = await axios.get(`${BACKEND_API_URL}/dogs/${dogId}`,{
					headers: {
					'Authorization': `Bearer ${token}`
					}
				});
				
                const dog = response.data;
                setDogs(dog);
             } catch (error) {
                console.log(error);
             }
		};
		fetchDog();
	}, [dogId]);

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
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>Dogs Details</h1>
					<p>Dog Name: {dog?.name}</p>
					<p>Dog Breed: {dog?.breed}</p>
					<p>Dog Colour: {dog?.colour}</p>
					<p>Dog IsHealthy: {dog?.is_healthy.toString()}</p>
                    <p>Dog DateOfBirth: {dog?.date_of_birth.toString()}</p>
                    <p>Dogs toys:</p>
					<ul>
						{dog?.toys?.map((toy) => (
							<li key={toy.id}>{toy.name} {toy.colour} {toy.material} with price: {toy.price}</li>
						))}
					</ul>
                    <p>Dog owners:</p>
					<ul>
						{dog?.owners?.map((dog_owner) => (
							<li key={dog_owner.owner?.id}>{dog_owner.owner?.last_name} {dog_owner.owner?.first_name} from {dog_owner.owner?.city}</li>
						))}
					</ul>
					
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/${dogId}/edit`} onClick={handleBtnClick}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/${dogId}/delete`} onClick={handleBtnClick}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};