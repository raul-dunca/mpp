import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField, debounce } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Dogs } from "../../models/Dogs";
import { BACKEND_API_URL } from "../../constants";
import { Toys } from "../../models/Toys";
import jwt_decode from 'jwt-decode';


export const ToysAdd = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem('token');
	const refresh_token=localStorage.getItem('refres_token');

    const myDog: Dogs = {
        name: "Spike",
        breed: "Labrador",
        colour: "Golde",
        is_healthy: true,
        date_of_birth: "2020-05-05",
      };
	const [toy, setToy] = useState<Toys>({
		name: "",
		dog: myDog,
		material: "",
        colour: "",
        price:1,
        descriptions: "",
	});

	const addToy = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		if(token)
		{
			
		const decoded: any = jwt_decode(token);
		
		if (decoded.exp < Date.now() / 1000) {
			//console.log(refresh_token);
			axios.post(`${BACKEND_API_URL}/token/refresh`,{refresh:refresh_token}).then(response => {
			const newToken = response.data.access;
			//console.log(response.data.access);
			localStorage.setItem('token', newToken);
			window.location.reload();
			});
		}
		}

		try {
			const token = localStorage.getItem('token');
			
			if(token)
			{
			const decoded: any = jwt_decode(token);
			console.log(decoded);
			const user_id = decoded['user_id'];
			const newToy = { ...toy, users: user_id }
			await axios.post(`${BACKEND_API_URL}/toys/`, newToy,{
				headers: {
				'Authorization': `Bearer ${token}`
				}
			});
			navigate("/toys");
		}
		} catch (error) {
			console.log(error);
		}
	};

    const [dogs,setDogs]=useState<Dogs[]>([]);
    const fetchSuggestions= async(query: string) => {
		if(token)
      {
        
      const decoded: any = jwt_decode(token);
      
      if (decoded.exp < Date.now() / 1000) {
        //console.log(refresh_token);
        axios.post(`${BACKEND_API_URL}/token/refresh`,{refresh:refresh_token}).then(response => {
          const newToken = response.data.access;
          //console.log(response.data.access);
          localStorage.setItem('token', newToken);
          window.location.reload();
        });
      }
      }
        try {
            const response=await axios.get<Dogs[]>(
            
                `${BACKEND_API_URL}/dogs/autocomplete?query=${query}`
				,{
					headers: {
					'Authorization': `Bearer ${token}`
					}
				});
            const data= await response.data;
            setDogs(data);
        } catch (error) {
            console.log("Error fetching suggestions",error);
            
        }

    };

    const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions,300),[]);

    //  useEffect(()=>{
    //      return () => {
    //          debouncedFetchSuggestions.cancel();
    //      };
    //  },[debouncedFetchSuggestions]);

    const handleInputChange=(event:any,value:any,reason:any)=>
    {
        console.log("input",value,reason);
        if (reason=="input")
        {
            
            debouncedFetchSuggestions(value);
        }
    }

	const [priceError, setPriceError] = useState('');
	function handlePriceChange(event:any) {
		const input = event.target.value;
		const regex = /^-?[0-9\b]+$/;
		if (regex.test(input)) {
	
		const value = parseInt(event.target.value);
		
		if (value <= 0) {
		  setPriceError('Price must be greater than zero!');
		  setToy({ ...toy, price: value });
		} else {
		  setPriceError('');
		  setToy({ ...toy, price: value });
		}
	}
	else
	{
		setPriceError('Price must be a number!')
		setToy({ ...toy, price: input });
	}
	  }


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
					<form onSubmit={addToy}>
						<TextField
							id="name"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setToy({ ...toy, name: event.target.value })}
						/>
						<Autocomplete
                            sx={{ mb: 2 }}
                            id="dog"
                            options={dogs}
                            
                            getOptionLabel={(option)=> `${option.name} - ${option.breed} - ${option.colour}`}
                            renderInput={(params)=> <TextField {...params} label="Dog" />}
                            filterOptions={(x)=>x}
                            onInputChange={handleInputChange}
                            onChange={(event,value)=>
                            {

                                console.log("VALUE"
								,value);
                                if (value)
                                {
                                    console.log(value);
                                    setToy({...toy, dog: value.id! as any as Dogs})
                                }
                            }}
                        />
						<TextField
							id="material"
							label="Material"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setToy({ ...toy, material: event.target.value })}
						/>
						<TextField
							id="colour"
							label="Colour"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) =>setToy({...toy,colour: event.target.value})}
						/>
						<TextField
							id="price"
							label="Price"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={handlePriceChange}
        					error={!!priceError}
        					helperText={priceError}
						/>
                        <TextField
							id="descriptions"
							label="Descriptions"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setToy({ ...toy, descriptions: event.target.value })}
						/>


						<Button type="submit">Add Toy</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};