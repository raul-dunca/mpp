import { Autocomplete, Button, Card, CardActions, CardContent, IconButton, TextField, debounce } from "@mui/material";
import { Container } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { Dogs } from "../../models/Dogs";
import { Toys } from "../../models/Toys";
import { Owners } from "../../models/Owners";
import { DogOwners } from "../../models/DogOwner";
import jwt_decode from 'jwt-decode';

export const DogOwnerUpdate = () => {
const navigate = useNavigate();
const { dogId,ownerId } = useParams();
const token = localStorage.getItem('token');
const refresh_token=localStorage.getItem('refres_token');

const myDog: Dogs = {
    name: "Spike",
    breed: "Labrador",
    colour: "Gold",
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

useEffect(() => {
   const fetchDogOwners = async () => {
      try {
         
         const response = await fetch(`${BACKEND_API_URL}/dogowners/${dogId}/${ownerId}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
         const dogowner = await response.json();
         setDogOwner(dogowner);
         setDogOwner({
            ...dogowner,
            dog: dogId as any as Dogs,
            owner: ownerId as any as Owners,
          });
         console.log("BAA",dogowner.dog);
         console.log("Owner",dogowner.owner);
      } catch (error) {
         console.log(error);
      }
   };
   fetchDogOwners();
}, [dogId,ownerId]);

const updateDogOwner = async (event: { preventDefault: () => void }) => {
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
   await axios.put(`${BACKEND_API_URL}/dogowners/${dogId}/${ownerId}`, dogowner,{
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
   navigate("/dogowners");
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
            
                `${BACKEND_API_URL}/dogs/autocomplete?query=${query}`
                ,{
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
            
                `${BACKEND_API_URL}/owners/autocomplete?query=${query}`
                ,{
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


    const debouncedFetchSuggestionsdog = useCallback(debounce(fetchSuggestionsdogs,300),[]);

    //  useEffect(()=>{
    //      return () => {
    //          debouncedFetchSuggestions.cancel();
    //      };
    //  },[debouncedFetchSuggestions]);

    const handleInputChangedog=(event:any,value:any,reason:any)=>
    {
        
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
        
        if (reason=="input")
        {
            
            debouncedFetchSuggestionsowner(value);
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
            <IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners/${dogId}/${ownerId}/details`} onClick={handleBtnClick}>
               <ArrowBackIcon />
            </IconButton>{" "}
            <form onSubmit={updateDogOwner}>
            <Autocomplete
                sx={{ mb: 2 }}
                id="dog"
                options={dogs}
               value={dogowner.dog}
               getOptionLabel={(option) => {
                
                if (option.hasOwnProperty('name')) {
                  return option.name+" - "+option.breed+" - "+option.colour;
                }
                return option.toString();
              }}
                renderInput={(params)=> <TextField {...params} label="Dog" />}
                filterOptions={(x)=>x}
                onInputChange={handleInputChangedog}
                onChange={(event,value)=>
                {

                                
                    if (value)
                    {
                        
                        setDogOwner({...dogowner, dog: value.id! as any as Dogs});
                    }
                }}
            />
						

            <Autocomplete
                sx={{ mb: 2 }}
                id="owner"
                options={owners}
                value={dogowner.owner}
                //getOptionLabel={(option)=> `${option.first_name} - ${option.last_name} - ${option.email}`}
                getOptionLabel={(option) => {
                    if (option.hasOwnProperty('first_name')) {
                      return option.first_name+" - "+option.last_name+" - "+option.email;
                    }
                    return option.toString();
                  }}
                renderInput={(params)=> <TextField {...params} label="Owner" />}
                filterOptions={(x)=>x}
                onInputChange={handleInputChangeowner}
                onChange={(event,value)=>
                {

                                
                    if (value)
                    {
                        
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
                value={dogowner.adoption_date}
				onChange={(event) => setDogOwner({ ...dogowner, adoption_date: new Date(event.target.value).toISOString().substr(0, 10) })}
			/>

            <TextField
				id="adoption_fee"
				label="Adoption Fee"
				variant="outlined"
				fullWidth
				sx={{ mb: 2 }}
                value={dogowner.adoption_fee}
				onChange={(event) =>setDogOwner({...dogowner,adoption_fee: parseInt(event.target.value)})}
			/>
            <Button type="submit">Update</Button>
            </form>
   </CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
      
	);
};