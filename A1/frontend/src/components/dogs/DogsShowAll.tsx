
  import {
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    CircularProgress,
    Container,
    IconButton,
    Tooltip,
    Toolbar,
    Button,
  } from "@mui/material";
  import React from "react";
  import { useEffect, useState } from "react";
  import { Link } from "react-router-dom";
  import ReadMoreIcon from "@mui/icons-material/ReadMore";
  import EditIcon from "@mui/icons-material/Edit";
  import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
  import AddIcon from "@mui/icons-material/Add";
import { Dogs } from "../../models/Dogs";
import { BACKEND_API_URL } from "../../constants";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Label } from "@mui/icons-material";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import jwt_decode from 'jwt-decode';
import axios from "axios";
  //export let currentPage = 1;
  export const DogsShowAll = () => {
    const [loading, setLoading] = useState(false);
    const [dogs, setDogs] = useState<Dogs[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const page_size = localStorage.getItem('page_nr');
    const token = localStorage.getItem('token');
    const refresh_token=localStorage.getItem('refres_token');
    const totalPages = page_size ? Math.ceil(1000000 / parseInt(page_size)) : 100000;
    
    
    useEffect(() => {
      setLoading(true);
      if (token) {
        const decoded: any = jwt_decode(token);
      
        if (decoded.exp < Date.now() / 1000) {
          axios.post(`${BACKEND_API_URL}/token/refresh`, { refresh: refresh_token })
          .then(response => {
            const newToken = response.data.access;
            //console.log(newToken);
            localStorage.setItem('token', newToken);
            window.location.reload();
          });
        }
        
      }
     
      fetch(`${BACKEND_API_URL}/dogs/?p=${currentPage}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => response.json())
      .then(async (data) => {
        const dogsWithUsernames = await Promise.all(data.results.map(async (dog: any) => {
          const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${dog.users}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const user = await userResponse.json();
          return { ...dog, username: user.username };
        }));
        setDogs(dogsWithUsernames);
        
        setLoading(false);
      });
  }, []);
    
    const orderByDateOfBirth = () => {
      if (token) {
        const decoded: any = jwt_decode(token);
      
        if (decoded.exp < Date.now() / 1000) {
          axios.post(`${BACKEND_API_URL}/token/refresh`, { refresh: refresh_token })
          .then(response => {
            const newToken = response.data.access;
            //console.log(newToken);
            localStorage.setItem('token', newToken);
            window.location.reload();
          });
        }
      }
      const sorted = [...dogs].sort((a, b) => {
        const dateA = new Date(a.date_of_birth).getTime();
        const dateB = new Date(b.date_of_birth).getTime();
        return dateA - dateB;
      });
      setDogs(sorted);
    }

    

    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
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
      setLoading(true);
      fetch(`${BACKEND_API_URL}/dogs/?p=${newPage}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => response.json())
      .then(async (data) => {
        const dogsWithUsernames = await Promise.all(data.results.map(async (dog: any) => {
          
          const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${dog.users}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const user = await userResponse.json();
          return { ...dog, username: user.username };
        }));
        setDogs(dogsWithUsernames);
        
        setLoading(false);
      });
    }
  
    const pageNumbers = [];
    for (
      let i = Math.max(1, currentPage - 5);
      i <= Math.min(totalPages, currentPage + 5);
      i++
    ) {
      pageNumbers.push(i);
    }

    const handleBtnClick = () => {
			
		  if (token) {
			const decoded: any = jwt_decode(token);
	  
			if (decoded.exp < Date.now() / 1000) {
				axios.post(`${BACKEND_API_URL}/token/refresh`, { refresh: refresh_token })
				.then(response => {
				  const newToken = response.data.access;
				  //console.log(newToken);
				  localStorage.setItem('token', newToken);
				  window.location.reload();
				});
		  }
		  
		}
	};

    const [open, setOpen] = React.useState(false);
    const numbers = Array.from({length: 100}, (_, index) => index + 1);
  const handleOpen = () => {
    setOpen(!open);
  };
    return (
      <Container style={{ height:'120vh'}}>
        <h1 style={{color:"white"}}>All dogs</h1>
        <label style={{color:"white"}}>Current Page: {currentPage}</label> 
       
        {loading && <CircularProgress />}
        {!loading && dogs.length === 0 && <p style={{color:"white"}}>No dogs found</p>}
        {!loading && (
          
          <Toolbar>

          <div style={{width:"1200px"}}>
            {currentPage > 1 && (
              <button style={{margin:"3px"}} onClick={() => handlePageChange(currentPage - 1)}>
                Previous
              </button>
            )}
            {pageNumbers[0] > 1 && (
              <>
                <button style={{margin:"3px"}} onClick={() => handlePageChange(1)}>1</button>
                {pageNumbers[0] > 2 && <span style={{margin:"3px"}} >...</span>}
              </>
            )}
            {pageNumbers.map((pageNumber) => (
              <button
              style={{
                margin: "3px",
                backgroundColor: currentPage === pageNumber ? "grey" : "",
                pointerEvents: currentPage === pageNumber ? "none" : "auto"
              }}
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
            {pageNumbers[pageNumbers.length - 1] <= totalPages - 1 && (
              <>
                {pageNumbers[pageNumbers.length - 1] <= totalPages - 2 && (
                  <span style={{margin:"3px"}}>...</span>
                )}
                <button style={{margin:"3px"}} onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </button>
              </>
            )}
            {currentPage < totalPages && (
              <button style={{margin:"3px"}} onClick={() => handlePageChange(currentPage + 1)}>
                Next
              </button>
            )}
          </div>
          <div style={{ marginLeft:"20px",width:"400px"}}>
          <IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/add`} onClick={handleBtnClick}>
            <Tooltip title="Add a new dog" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
          <Button
          
          onClick={orderByDateOfBirth}
          >Order ByDateOfBirth
        </Button>
       
        </div>
        <p></p>
       <div style={{width:"10px"}}>
        {/* <IconButton onClick={handlePrevPage} style={{marginLeft:"150px" ,marginRight:'50px'}} component={Link} sx={{ mr: 3 }} to={`/dogs/?p=${currentPage}`} disabled={currentPage === 1}>
            <Tooltip title="Previous">
             <ArrowBackIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton>

        

        <IconButton style={{ marginLeft:'50px'}} onClick={handleNextPage} component={Link} sx={{ mr: 3 }}  to={`/dogs/?p=${currentPage }`} disabled={currentPage === totalPages}>
            <Tooltip title="Next">
             <ArrowForwardIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton> */}

          
          {/* <Dropdown style={{margin:"0px"}}>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select a Number
      </Dropdown.Toggle>

      <Dropdown.Menu
        style={{
          minWidth: '200px', // Use minWidth instead of maxWidth to ensure the menu is at least 200px wide
          width: 'auto', // Use width: auto to allow the menu to expand beyond 200px
          overflowY: 'auto', // Add a scrollbar for vertical overflow
          maxHeight: '300px', // Limit the maximum height of the menu to 300px
          backgroundColor: 'white',
        }}
      >
        {numbers.map((number) => (
          <React.Fragment key={number}>
            <Dropdown.Item eventKey={number}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  textAlign: 'center',
                }}
              >
                {number}
              </div>
            </Dropdown.Item>
            {number !== 100 && <Dropdown.Divider style={{ marginLeft: '-1rem', marginRight: '-1rem' }} />}
          </React.Fragment>
        ))}
      </Dropdown.Menu>
    </Dropdown> */}
    
        </div>
        </Toolbar>

        
        )}
        {!loading && dogs.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="left">Name</TableCell>
                  <TableCell align="right">Breed</TableCell>
                  <TableCell align="right">Colour</TableCell>
                  <TableCell align="right">IsHealthy</TableCell>
                  <TableCell align="right">DateOfBirth</TableCell>
                  <TableCell align="right">NrOfOwners</TableCell>
                  <TableCell align="center">User</TableCell>
                  <TableCell align="center">Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dogs.map((dog, index) => (
                  <TableRow key={dog.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/dogs/${dog.id}/details`} title="View dog details" onClick={handleBtnClick}>
                        {dog.name}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{dog.breed}</TableCell>
                    <TableCell align="right">{dog.colour}</TableCell>
                    <TableCell align="right">{dog.is_healthy.toString()}</TableCell>
                    <TableCell align="right">{dog.date_of_birth}</TableCell>
                    <TableCell align="right">{dog.nr_of_owners}</TableCell>
                    <TableCell align="right">
                    <Link to={`/user/details/${dog.users}`} title="View user details" onClick={handleBtnClick}>
                        {dog.username?.toString()}
                      </Link>
                      </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        sx={{ mr: 3 }}
                        to={`/dogs/${dog.id}/details`}
                        onClick={handleBtnClick}>
                          
                        <Tooltip title="View dog details" arrow>
                          <ReadMoreIcon color="primary" />
                        </Tooltip>
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/${dog.id}/edit`} onClick={handleBtnClick}>
                        <EditIcon />
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/dogs/${dog.id}/delete`} onClick={handleBtnClick}>
                        <DeleteForeverIcon sx={{ color: "red" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

      
      </Container>
      
    );
  };
  