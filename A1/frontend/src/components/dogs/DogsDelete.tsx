import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";
import jwt_decode from 'jwt-decode';

export const DogsDelete = () => {
	const { dogId } = useParams();
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const refresh_token=localStorage.getItem('refres_token');

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
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
		try{
		await axios.delete(`${BACKEND_API_URL}/dogs/${dogId}`,{
			headers: {
			  'Authorization': `Bearer ${token}`
			}
		  });
		// go to dogs list
		navigate("/dogs");
		}catch(error)
		{
			console.log(error);
		}
	};

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

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
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
		// go to sogs list
		navigate("/dogs");
	};

	return (
		<Container style={{ height:'100vh',marginTop:'80px'}}>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogs`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this dog? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete it</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};