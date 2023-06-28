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
import { DogOwners } from "../../models/DogOwner";
import jwt_decode from 'jwt-decode';
import axios from "axios";

  export const DogOwnersShowAll = () => {
    const [loading, setLoading] = useState(false);
    const [dogowners, setDogOwners] = useState<DogOwners[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const page_size = localStorage.getItem('page_nr');
    const token = localStorage.getItem('token');
    const refresh_token=localStorage.getItem('refres_token');
    const totalPages = page_size ? Math.ceil(1000000 / parseInt(page_size)) : 10;

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
      //console.log(currentPage);
      fetch(`${BACKEND_API_URL}/dogowners/?p=${currentPage}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then(async (data) => {
        const dogownersWithUsernames = await Promise.all(data.results.map(async (dogowner: any) => {
          const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${dogowner.users}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const user = await userResponse.json();
          return { ...dogowner, username: user.username };
        }));
        setDogOwners(dogownersWithUsernames);
        setLoading(false);
      });
    }, []);
    

   


    const handlePageChange = (newPage: number) => {
      setCurrentPage(newPage);
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
      setLoading(true);
      fetch(`${BACKEND_API_URL}/dogowners/?p=${newPage}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then(async (data) => {
          const dogownersWithUsernames = await Promise.all(data.results.map(async (dogowner: any) => {
            const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${dogowner.users}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const user = await userResponse.json();
            return { ...dogowner, username: user.username };
          }));
          setDogOwners(dogownersWithUsernames);
          setLoading(false);
        });
    };
  
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
    return (
      <Container style={{ height:'120vh'}}>
        <h1 style={{ color:'white'}}>All dogowners</h1>
        <label style={{ color:'white'}}>Current Page: {currentPage}</label> 
        {loading && <CircularProgress />}
        {!loading && dogowners.length === 0 && <p style={{ color:'white'}}>No dogowners found</p>}
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
          {/* <IconButton onClick={handlePrevPage} style={{ marginRight:'370px'}} component={Link} sx={{ mr: 3 }} to={`/dogowners/?p=${currentPage}`} disabled={currentPage === 1}>
            <Tooltip title="Previous">
             <ArrowBackIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton> */}
          <IconButton component={Link} sx={{ marginRight:'65px',marginLeft:'300px'  }} to={`/dogowners/add`} onClick={handleBtnClick}>
            <Tooltip title="Add a new dogowner" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
        {/* <IconButton style={{ marginLeft:'370px'}} onClick={handleNextPage} component={Link} sx={{ mr: 3 }}  to={`/dogowners/?p=${currentPage }`} disabled={currentPage === totalPages}>
            <Tooltip title="Next">
             <ArrowForwardIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
        )}
        {!loading && dogowners.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="left">Dog</TableCell>
                  <TableCell align="left">Owner</TableCell>
                  <TableCell align="right">Adoption Date</TableCell>
                  <TableCell align="right">Adoption Fee</TableCell>
                  <TableCell align="center">User</TableCell>
                  <TableCell align="center">Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dogowners.map((dogowner, index) => (
                  <TableRow key={dogowner.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/dogs/${dogowner.dog}/details`} title="View dog details" onClick={handleBtnClick}>
                        {dogowner.dog.toString()}
                      </Link>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/owners/${dogowner.owner}/details`} title="View owner details" onClick={handleBtnClick}>
                        {dogowner.owner.toString()}
                      </Link>
                    </TableCell>
                    <TableCell align="right">{dogowner.adoption_date.toString()}</TableCell>
                    <TableCell align="right">{dogowner.adoption_fee}</TableCell>
                    <TableCell align="center">
                    <Link to={`/user/details/${dogowner.users}`} title="View user details" onClick={handleBtnClick}>
                        {dogowner.username?.toString()}
                      </Link>
                      </TableCell>
                    <TableCell align="right">
                      <IconButton
                        component={Link}
                        sx={{ mr: 3 }}
                        to={`/dogowners/${dogowner.dog}/${dogowner.owner}/details`}
                        onClick={handleBtnClick}>
                        <Tooltip title="View dogowner details" arrow>
                          <ReadMoreIcon color="primary" />
                        </Tooltip>
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners/${dogowner.dog}/${dogowner.owner}/edit`} onClick={handleBtnClick}>
                        <EditIcon />
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/dogowners/${dogowner.dog}/${dogowner.owner}/delete`} onClick={handleBtnClick}>
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