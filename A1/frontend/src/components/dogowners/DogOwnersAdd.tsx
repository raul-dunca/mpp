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
import { DogOwners } from "../../models/DogOwner";
import { Owners } from "../../models/Owners";
import jwt_decode from 'jwt-decode';

export const DogOwnersAdd = () => {
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

      const myOwner: Owners = {
		first_name: "Raul",
		last_name: "Dunca",
		email: "dunca.raul@example.io",
        city:"Cluj",
        date_of_birth: "2003-05-05",
	};
	const [dogowner, setDogOwner] = useState<DogOwners>({
		dog: myDog,
		owner: myOwner,
		adoption_date: "",
        adoption_fee: 1,
        
	});

    
	const addDogOwner = async (event: { preventDefault: () => void }) => {
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
		try {
            const token = localStorage.getItem('token');
			
			if(token)
			{
			const decoded: any = jwt_decode(token);
			console.log(decoded);
			const user_id = decoded['user_id'];
			const newDogOwner = { ...dogowner, users: user_id }
			await axios.post(`${BACKEND_API_URL}/dogowners/`, newDogOwner,{
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })
			navigate("/dogowners");
            }
		} catch (error) {
			console.log(error);
		}
	};

    const [dogs,setDogs]=useState<Dogs[]>([]);
    const fetchSuggestionsdogs= async(query: string) => {
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
        try {
            const response=await axios.get<Dogs[]>(
            
                `${BACKEND_API_URL}/dogs/autocomplete?query=${query}`,{
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  })
            const data= await response.data;
            setDogs(data);
        } catch (error) {
            console.log("Error fetching suggestions",error);
            
        }

    };


    const [owners,setOwners]=useState<Owners[]>([]);
    const fetchSuggestionsowners= async(query: string) => {
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
        try {
            const response=await axios.get<Owners[]>(
            
                `${BACKEND_API_URL}/owners/autocomplete?query=${query}`,{
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  })
            const data= await response.data;
            setOwners(data);
        } catch (error) {
            console.log("Error fetching suggestions",error);
            
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

    const debouncedFetchSuggestionsdog = useCallback(debounce(fetchSuggestionsdogs,300),[]);

    //  useEffect(()=>{
    //      return () => {
    //          debouncedFetchSuggestions.cancel();
    //      };
    //  },[debouncedFetchSuggestions]);

    const handleInputChangedog=(event:any,value:any,reason:any)=>
    {
        console.log("input",value,reason);
        if (reason=="input")
        {
            
            debouncedFetchSuggestionsdog(value);
        }
    }



    const debouncedFetchSuggestionsowner = useCallback(debounce(fetchSuggestionsowners,300),[]);

    //  useEffect(()=>{
    //      return () => {
    //          debouncedFetchSuggestions.cancel();
    //      };
    //  },[debouncedFetchSuggestions]);

    const handleInputChangeowner=(event:any,value:any,reason:any)=>
    {
        console.log("input",value,reason);
        if (reason=="input")
        {
            
            debouncedFetchSuggestionsowner(value);
        }
    }
	return (
		<Container style={{ height:'100vh',marginTop:'100px'}}>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners`} onClick={handleBtnClick}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={addDogOwner}>
                    <Autocomplete
                            sx={{ mb: 2 }}
                            id="dog"
                            options={dogs}
                            
                            getOptionLabel={(option)=> `${option.name} - ${option.breed} - ${option.colour}`}
                            renderInput={(params)=> <TextField {...params} label="Dog" />}
                            filterOptions={(x)=>x}
                            onInputChange={handleInputChangedog}
                            onChange={(event,value)=>
                            {

                                
                                if (value)
                                {
                                    console.log(value);
                                    setDogOwner({...dogowner, dog: value.id! as any as Dogs})
                                }
                            }}
                        />
						

                        <Autocomplete
                            sx={{ mb: 2 }}
                            id="owner"
                            options={owners}
                            
                            getOptionLabel={(option)=> `${option.first_name} - ${option.last_name} - ${option.email}`}
                            renderInput={(params)=> <TextField {...params} label="Owner" />}
                            filterOptions={(x)=>x}
                            onInputChange={handleInputChangeowner}
                            onChange={(event,value)=>
                            {

                                
                                if (value)
                                {
                                    console.log(value);
                                    setDogOwner({...dogowner, owner: value.id! as any as Owners})
                                }
                            }}
                        />
						<TextField
							id="adoption_date"
							label="Adoption Date"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setDogOwner({ ...dogowner, adoption_date: new Date(event.target.value).toISOString().substr(0, 10) })}
						/>

                        <TextField
							id="adoption_fee"
							label="Adoption Fee"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) =>setDogOwner({...dogowner,adoption_fee: parseInt(event.target.value)})}
						/>
						<Button type="submit">Add DogOwner</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};