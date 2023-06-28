import { Alert, Button, Card, CardContent, Container, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../constants";


export const ActivateAccount = () => {
  const { confirmation_code } = useParams();
  const [message, setMessage] = useState("");
  const [successful, setSuccessful] = useState<boolean>();

  const activate = async () => {
        try {
            
            const { data } = await axios.get(`${BACKEND_API_URL}/user/register/confirm/${confirmation_code}`)
            setMessage(data.Message);
            setSuccessful(true);
        } catch (error: any) {
            setMessage(
                (error.response && error.response.data && error.response.data.error) ||
                error.message ||
                error.toString()
            );
            setSuccessful(false);
        }
  };

  useEffect(() => {
    activate();
  }, []);

  return (
    <Container style={{ height:'100vh',marginTop:'100px'}}>
        <Card>
            <CardContent>
                {<Typography variant="h3">Account activation</Typography>}
                <Alert severity={successful ? "success" : "error"}>{message}</Alert>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        window.location.href = "/login";

                    }}
                    sx = {{marginTop: 2}}
                    >Go to login</Button>
            </CardContent>
        </Card>
  </Container>
  );
};