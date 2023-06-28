
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
    Input,
    Typography,
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
import { Toys } from "../../models/Toys";
import { Label } from "@mui/icons-material";
import jwt_decode from 'jwt-decode';
import axios from "axios";

  export const ToysShowAll = () => {
    const [loading, setLoading] = useState(false);
    const [toys, setToys] = useState<Toys[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [number, setNumber] = useState(1); // Set initial state to 1
    const [InputValue,setInputValue]=useState(0);
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
      fetch(`${BACKEND_API_URL}/toys/?p=${currentPage}&price=${InputValue}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then(async (data) => {
          const toysWithUsernames = await Promise.all(data.results.map(async (toy: any) => {
            const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${toy.users}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const user = await userResponse.json();
            return { ...toy, username: user.username };
          }));
          setToys(toysWithUsernames);
          
          setLoading(false);
        });
    }, []);
    
    
    // const handleNextPage = () => {
    //   if (NextPage) {
        
    //     setCurrentPage(currentPage + 1);
        
    //     setLoading(true);
    //     fetch(`${NextPage}`)
    //     .then((response) => response.json())
    //     .then((data) => {
          
    //       setToys(data.results);
    //       setNextPage(data.next);
    //       setPrevPage(data.previous);
    //       setLoading(false);
    //     });
        
    //   }
    // };
  
    // const handlePrevPage = () => {
    //   if (PrevPage) {
        
    //     setCurrentPage(currentPage - 1);
        
    //     setLoading(true);
    //     fetch(`${PrevPage}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //       setToys(data.results);
    //       setNextPage(data.next);
    //       setPrevPage(data.previous);
    //       setLoading(false);
    //     });
         
    //   }
    // };


    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();

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
      // navigate("/books");
      setLoading(true);
      setCurrentPage(1);
      
          fetch(`${BACKEND_API_URL}/toys/?p=1&price=${InputValue}`,{
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then((response) => response.json())
          .then(async (data) => {
            const toysWithUsernames = await Promise.all(data.results.map(async (toy: any) => {
              
              const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${toy.users}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const user = await userResponse.json();
              return { ...toy, username: user.username };
            }));
            setToys(toysWithUsernames);
            setLoading(false);
          });
        }

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
      fetch(`${BACKEND_API_URL}/toys/?p=${newPage}&price=${InputValue}&page_size=${page_size}`,{
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then((response) => response.json())
      .then(async (data) => {
        const toysWithUsernames = await Promise.all(data.results.map(async (toy: any) => {
          
          const userResponse = await fetch(`${BACKEND_API_URL}/user/details/${toy.users}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const user = await userResponse.json();
          return { ...toy, username: user.username };
        }));
        setToys(toysWithUsernames);
        setLoading(false);
      });
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

    const pageNumbers = [];
    for (
      let i = Math.max(1, currentPage - 5);
      i <= Math.min(totalPages, currentPage + 5);
      i++
    ) {
      pageNumbers.push(i);
    }

    return (
      <Container style={{ height:'120vh'}}>
        <h1 style={{color:"white"}}>All toys</h1>
        <label style={{color:"white"}}>Current Page: {currentPage}</label> 
        {loading && <CircularProgress />}
        {!loading && toys.length === 0 && <p style={{color:"white"}}>No toys found</p>}
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
          {/* <IconButton onClick={handlePrevPage} style={{ marginRight:'370px'}} component={Link} sx={{ mr: 3 }} to={`/toys/?p=${currentPage}&price=${InputValue}`} disabled={! PrevPage}>
            <Tooltip title="Previous">
             <ArrowBackIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton> */}
          <IconButton  style= {{ marginLeft:'100px',marginRight: '45px' }} component={Link} sx={{ mr: 3 }} to={`/toys/add`} onClick={handleBtnClick}>
            <Tooltip title="Add a new toys" arrow>
              <AddIcon color="primary" />
            </Tooltip>
          </IconButton>
          
          <Input
          style= {{ marginRight: '15px' }}
        inputProps={{ style: { color: 'white' } }}
        type="number"
        onChange={(event) => setInputValue(Number(event.target.value))}
        value={InputValue}
        placeholder="Enter a number"
      />
      <Button onClick={handleSubmit}>Filter</Button>
        {/* <IconButton style={{ marginLeft:'370px'}} onClick={handleNextPage} component={Link} sx={{ mr: 3 }}  to={`/toys/?p=${currentPage }&price=${InputValue}`} disabled={!NextPage}>
            <Tooltip title="Next">
             <ArrowForwardIosIcon sx={{ color: "white" }} />
            </Tooltip>
          </IconButton> */}
        </Toolbar>
        )}
        {!loading && toys.length > 0 && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell align="center">Name</TableCell>
                  <TableCell align="center">Dog</TableCell>
                  <TableCell align="center">Material</TableCell>
                  <TableCell align="center">Colour</TableCell>
                  <TableCell align="center">Price</TableCell>
                  {/* <TableCell align="center">Description</TableCell> */}
                  <TableCell align="center">NrOtherToys</TableCell>
                  <TableCell align="center">User</TableCell>
                  <TableCell align="center">Operations</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {toys.map((toy, index) => (
                  <TableRow key={toy.id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Link to={`/toys/${toy.id}/details`} title="View toy details" onClick={handleBtnClick}>
                        {toy.name}
                      </Link>
                    </TableCell>
                    <TableCell align="center">{toy.dog.toString()}</TableCell>
                    <TableCell align="center">{toy.material}</TableCell>
                    <TableCell align="center">{toy.colour}</TableCell>
                    <TableCell align="center">{toy.price}</TableCell>
                    {/* <TableCell align="center">{toy.descriptions}</TableCell> */}
                    <TableCell align="center">{toy.nr_of_toys}</TableCell>
                    <TableCell align="right">
                    <Link to={`/user/details/${toy.users}`} title="View user details" onClick={handleBtnClick}>
                        {toy.username?.toString()}
                      </Link>
                      </TableCell>
                    <TableCell align="center">
                      <IconButton
                        component={Link}
                        sx={{ mr: 3 }}
                        to={`/toys/${toy.id}/details`}
                        onClick={handleBtnClick}>
                        <Tooltip title="View toy details" arrow>
                          <ReadMoreIcon color="primary" />
                        </Tooltip>
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/toys/${toy.id}/edit`} onClick={handleBtnClick}>
                        <EditIcon />
                      </IconButton>
  
                      <IconButton component={Link} sx={{ mr: 3 }} to={`/toys/${toy.id}/delete`} onClick={handleBtnClick}>
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