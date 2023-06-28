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
import jwt_decode from 'jwt-decode';

export const ToysUpdate = () => {
const navigate = useNavigate();
const { toyId } = useParams();
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

useEffect(() => {
   const fetchToys = async () => {
      try {
         
         const response = await fetch(`${BACKEND_API_URL}/toys/${toyId}`,{
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
         const toy = await response.json();
         setToy(toy);
         setToy({...toy, dog: toy.dog.id as any as Dogs})
         console.log(toy.dog);
      } catch (error) {
         console.log(error);
      }
   };
   fetchToys();
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

const updateToy = async (event: { preventDefault: () => void }) => {
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
   await axios.put(`${BACKEND_API_URL}/toys/${toyId}`, toy,{
    headers: {
    'Authorization': `Bearer ${token}`
    }
});
   navigate("/toys");
   } catch (error) {
   console.log(error);
   }
};

const [dogs,setDogs]=useState<Dogs[]>([]);
    const fetchSuggestions= async(query: string) => {
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
				});
            const data= await response.data;
            setDogs(data);
            console.log(data);
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
        const value = parseInt(input);
		//const value = parseInt(event.target.value);
		
		if (value <= 0) {
		  setPriceError('Price must be greater than zero');
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
   return (
      <Container style={{ height:'100vh',marginTop:'100px'}}>
         <Card>
         <CardContent>
            <IconButton component={Link} sx={{ mr: 3 }} to={`/toys/${toyId}/details`} onClick={handleBtnClick}>
               <ArrowBackIcon />
            </IconButton>{" "}
            <form onSubmit={updateToy}>
            <TextField
				id="name"
				label="Name"
				variant="outlined"
				fullWidth
				sx={{ mb: 2 }}
                value={toy.name}
				onChange={(event) => setToy({ ...toy, name: event.target.value })}
			/>
			<Autocomplete
               
                sx={{ mb: 2 }}
                id="dog"
                options={dogs}    
                
                value={toy.dog}
                //defaultValue={toy.dog.id as any as Dogs}   
                //getOptionLabel={(option)=> option.name+" - "+option.breed+" - "+option.colour}
                getOptionLabel={(option) => {
                    if (option.hasOwnProperty('name')) {
                      return option.name+" - "+option.breed+" - "+option.colour;
                    }
                    return option.toString();
                  }}
                renderInput={(params)=> <TextField {...params} label="Dog" />}
                filterOptions={(x)=>x}
                onInputChange={handleInputChange}
                onChange={(event,value)=>
                {              
                    if (value)
                    {
                        
                        
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
                    value={toy.material}
					onChange={(event) => setToy({ ...toy, material: event.target.value })}
				/>
				<TextField
				    id="colour"
					label="Colour"
					variant="outlined"
					fullWidth
					sx={{ mb: 2 }}
                    value={toy.colour}
					onChange={(event) =>setToy({...toy,colour: event.target.value})}
				/>
				<TextField
					id="price"
					label="Price"
					variant="outlined"
					fullWidth
					sx={{ mb: 2 }}
                    value={toy.price}
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
                    value={toy.descriptions}
					onChange={(event) => setToy({ ...toy, descriptions: event.target.value })}
				/>

            <Button type="submit">Update</Button>
            </form>
   </CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
      
	);
};