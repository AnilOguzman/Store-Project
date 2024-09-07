import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

const AboutPage = () => {
  const [validationErrors,setValidationErrors]=useState([]);
  const getValidationErrors= () => {
    agent.testErrors.getValidationError().then(()=>console.log("shouldn't see this!")).catch(error=>setValidationErrors(error))
  }
  return (
    <Container>
      <Typography variant="h2">Errors for testing purposes</Typography>
      <ButtonGroup fullWidth>
        <Button variant="contained" onClick={()=>agent.testErrors.get400Error().catch(error=>console.log(error))}>Test 400 Error</Button>
        <Button variant="contained" onClick={()=>agent.testErrors.get401Error().catch(error=>console.log(error))}>Test 401 Error</Button>
        <Button variant="contained" onClick={()=>agent.testErrors.get404Error().catch(error=>console.log(error))}>Test 404 Error</Button>
        <Button variant="contained" onClick={()=>agent.testErrors.get500Error().catch(error=>console.log(error))}>Test 500 Error</Button>
        <Button variant="contained" onClick={getValidationErrors}>Test Validation Error</Button>
      </ButtonGroup>
      {validationErrors.length>0 && 
        <Alert severity="error">
          <AlertTitle>Validation Error</AlertTitle>
          <List>
            {validationErrors.map((error)=>(
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>

      }
    </Container>
  );
};

export default AboutPage;
