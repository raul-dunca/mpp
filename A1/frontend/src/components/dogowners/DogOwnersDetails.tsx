import { Card, CardActions, CardContent, IconButton, Toolbar, Tooltip } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import jwt_decode from 'jwt-decode';
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Dogs } from "../../models/Dogs";
import { BACKEND_API_URL } from "../../constants";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import axios from "axios";
import { DogOwners } from "../../models/DogOwner";

export const DogOwnersDetails = () => {
	const { dogId,ownerId } = useParams();
    const [dogowner, setDogOwners] = useState<DogOwners>();
	const token = localStorage.getItem('token');
	const refresh_token=localStorage.getItem('refres_token');

	useEffect(() => {
		const fetchDogOwner = async () => {
			try {
                
                const response = await axios.get(`${BACKEND_API_URL}/dogowners/${dogId}/${ownerId}`,{
					headers: {
					  'Authorization': `Bearer ${token}`
					}
				  })
                const dogowner = response.data;
                setDogOwners(dogowner);
             } catch (error) {
                console.log(error);
             }
		};
		fetchDogOwner();
	}, [dogId,ownerId]);

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
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<h1>DogOwner Details</h1>
					<p>Adoption Date: {dogowner?.adoption_date.toString()}</p>
					<p>Adoption Fee: {dogowner?.adoption_fee}</p>
                    <p>Dog:</p>
					<ul>
                        <li key={dogowner?.dog.id}>{dogowner?.dog.name} {dogowner?.dog.breed} of colour {dogowner?.dog.colour} with date of birth: {dogowner?.dog.date_of_birth.toString()}</li>
					</ul>
                    <p>Owners:</p>
					<ul>
                    <li key={dogowner?.owner.id}>{dogowner?.owner.last_name} {dogowner?.owner.first_name} from {dogowner?.owner.city}</li>
					</ul>
					
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners/${dogId}/${ownerId}/edit`} onClick={handleBtnClick}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners/${dogId}/${ownerId}/delete`} onClick={handleBtnClick}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};