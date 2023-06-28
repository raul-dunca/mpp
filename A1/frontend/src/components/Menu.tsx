import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PetsIcon from "@mui/icons-material/Pets";
import BarChartIcon from '@mui/icons-material/BarChart';
import ToysIcon from '@mui/icons-material/Toys';
import PeopleIcon from '@mui/icons-material/People';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import jwt_decode from 'jwt-decode';
import axios from "axios";
import { BACKEND_API_URL } from "../constants";
import LogoutIcon from '@mui/icons-material/Logout';

export const AppMenu = () => {
	const location = useLocation();
	const path = location.pathname;
	const token = localStorage.getItem('token');
    const refresh_token=localStorage.getItem('refres_token');
	const navigate = useNavigate();
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
		else
		{
			window.location.href = `/login`;
		}
	};


	const handleLogout = () => {
			
		if (token) {
		  
			localStorage.removeItem('token');
			localStorage.removeItem('refres_token');
			localStorage.removeItem('page_nr');
			window.location.href = `/login`;
		
		
	  }
	  else
	  {
		  alert("You are not logged in!");
	  }
  };

	return (
		<div style={{marginTop:'0px'}}>
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginTop: "0px", marginBottom: "50px" }}>
				<Toolbar>
					

					<Button
						variant={path.startsWith("/") ? "outlined" : "text"}
						to="/"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						size="large"
						sx={{ mr: 5 }}
						startIcon={<HomeIcon />}>
						Home
					</Button>
					<Button
						variant={path.startsWith("/dogs") ? "outlined" : "text"}
						to="/dogs"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<PetsIcon />}>
						Dogs
					</Button>
					<Button
						variant={path.startsWith("/toys") ? "outlined" : "text"}
						to="/toys"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<ToysIcon />}>
						Toys
					</Button>
					<Button
						variant={path.startsWith("/owners") ? "outlined" : "text"}
						to="/owners"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<PeopleIcon />}>
						Owners
					</Button>
					<Button
						variant={path.startsWith("/dogowners") ? "outlined" : "text"}
						to="/dogowners"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<ContactPageIcon />}>
						DogOwners
					</Button>
                    <Button
						variant={path.startsWith("/dogs/avg-by-toy-price") ? "outlined" : "text"}
						to="/dogs/avg-by-toy-price"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<BarChartIcon />}>
						Statistic1
					</Button>

					<Button
						variant={path.startsWith("/dogs/nr-of-owners") ? "outlined" : "text"}
						to="/dogs/nr-of-owners"
						component={Link}
						onClick={handleBtnClick}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<BarChartIcon />}>
						Statistic2
					</Button>


					<Button
				
						variant={path.startsWith("/login") ? "outlined" : "text"}
						to="/login"
						component={Link}
						onClick={handleLogout}
						color="inherit"
						sx={{ mr: 5 ,marginLeft: "20%"}}
						startIcon={<LogoutIcon />}>
						Logout
					</Button>

				</Toolbar>
			</AppBar>
		</Box>
		</div>
	);
};