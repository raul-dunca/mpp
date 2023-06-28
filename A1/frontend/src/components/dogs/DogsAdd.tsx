import { Button, Card, CardActions, CardContent, IconButton, TextField } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Dogs } from "../../models/Dogs";
import { BACKEND_API_URL } from "../../constants";
import jwt_decode from 'jwt-decode';

export const DogsAdd = () => {
	const navigate = useNavigate();

	const token = localStorage.getItem('token');
	const refresh_token=localStorage.getItem('refres_token');
	const [dog, setDog] = useState<Dogs>({
		name: "",
		breed: "",
		colour: "",
        is_healthy: true,
        date_of_birth: "",
	});

	const addDog = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			const token = localStorage.getItem('token');
			
			if(token)
			{
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
			//console.log(decoded);
			const user_id = decoded['user_id'];
			const newDog = { ...dog, users: user_id }
			await axios.post(`${BACKEND_API_URL}/dogs/`, newDog,{
				headers: {
				  'Authorization': `Bearer ${token}`
				}
			  });
			navigate("/dogs");
			}
		} catch (error) {
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

	const [DateError, setDateError] = useState('');
	function handleDateChange(event:any) {
		const input = event.target.value;
		const regex= /^\d{4}-\d{1,2}-\d{1,2}$/;
		const min_date="2010-01-01"
		console.log(input);
		if (regex.test(input))
		{	
			if (input <min_date) {
	
				setDateError('Date must be greater than '+ min_date);
		  setDog({ ...dog, date_of_birth: input });
		} else {
		  setDateError('');
		  setDog({ ...dog, date_of_birth: input });
		}
	}
		else
		{
			setDateError('Invalid date!');
			setDog({ ...dog, date_of_birth: input });
		}
	}

	
	const [NameError, setNameError] = useState('');
	function handleNameChange(event:any) {
		const input = event.target.value;
		if (input.length<=2)
		{	
			
			setNameError('Name must have at least 3 charachters!');
			setDog({ ...dog, name: input });
			
		} else {
			setNameError('');
		  setDog({ ...dog, name: input });
		}
	}
	
	
	return (
		<Container style={{ height:'100vh',marginTop:'100px'}}>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogs`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addDog}>
						<TextField
							id="name"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={handleNameChange}
        					error={!!NameError}
        					helperText={NameError}
						/>
						<TextField
							id="breed"
							label="Breed"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setDog({ ...dog, breed: event.target.value })}
						/>
						<TextField
							id="colour"
							label="Colour"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setDog({ ...dog, colour: event.target.value })}
						/>
						<TextField
							id="is_healthy"
							label="IsHealthy"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) =>setDog({...dog,is_healthy: event.target.value === "true",})}
						/>
						<TextField
							id="date_of_birth"
							label="DateOfBirth"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={handleDateChange}
        					error={!!DateError}
        					helperText={DateError}
						/>

						<Button type="submit">Add Dog</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};