import React, { Component, useState } from 'react';
import { withRouter } from "react-router-dom";
import { Link as RouterLink } from 'react-router-dom';
//import { TextField, Card, CardContent, CardActions, Link, Divider, CardHeader, Box, StepLabel, Stepper, Typography, Step, makeStyles, Button, FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Link from '@material-ui/core/Link';
import Divider from '@material-ui/core/Divider';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import Step from '@material-ui/core/Step';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';

import { handleFetch } from "../SF/helpers";

const useStyles = makeStyles(theme => ({
   root: {
      minWidth: '40%',
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: 300,
      },
   },
   button: {
      marginRight: theme.spacing(1),
   },
   instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
   },
   mRight: {
      flexGrow: 1,
   },
}));

const reactLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const getSteps = () => {
   return ['Nombre de Usuario', 'Preguntas Secretas', 'Nueva Contraseña'];
}

const initialState = {
   activeStep: 0,
   user: '',
   id_usuario: '',
   pregunta1: '',
   pregunta2: '',
   respuesta1: '',
   respuesta2: '',
   password: '',
   password2: ''
}

const Recover = (props) => {
   const classes = useStyles();
   const steps = getSteps();
   const preventDefault = event => event.preventDefault();

   const [state, update] = useState(initialState);

   /**
    * updates the state
    * @param {initialState} value The new value to assign to the state
    */
   const updateState = value => {
      update({ ...state, ...value });
   };

   /**
    * Updates the value of certain key
    * @param {string} key name of the property to be changed
    * @param {any} value the new value to assign to it
    */
   const updateByKey = (key, value) => {
      update({ ...state, [key]: value });
   };

   const [activeStep, setActiveStep] = React.useState(0);
   const [user, updateUser] = React.useState('');
   const [pregunta1, updatePregunta1] = React.useState();
   const [pregunta2, updatePregunta2] = React.useState();
   const [respuesta1, updateRespuesta1] = React.useState();
   const [respuesta2, updateRespuesta2] = React.useState();
   const [password, updatePassword] = React.useState();
   const [password2, updatePassword2] = React.useState();

   const old_handleUsername = (e) => {
      fetch(`http://localhost:6969/api/questions/${user}`, {
      })
         .then(res => res.json())
         .then(data => {
            setActiveStep(prevActiveStep => prevActiveStep + 1);
            updatePregunta1(data.user.pregunta1);
            updatePregunta2(data.user.pregunta2);
         })
         .catch(e => console.log(e));
   }
   const handleUsername = () => {
      if (state.user.length === 0) return
      fetch(`http://localhost:6969/api/users/${state.user}/questions`)
         .then(handleFetch)
         .then(data => {
            updateState({
               user: data.usuario,
               id_usuario: data.id_usuario,
               pregunta1: data.pregunta1,
               pregunta2: data.pregunta2,
               activeStep: 1
            });
         })
         .catch(e => console.log(e));
   }


   const old_handleQuestions = (e) => {
      fetch('http://localhost:6969/api/checkQuestions', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            usuario: { user },
            respuesta1: { respuesta1 },
            respuesta2: { respuesta2 }
         })
      })
         .then(res => res.json())
         .then(data => {
            console.log(data.response);
            if (data.response === 'Grant access') {
               setActiveStep(prevActiveStep => prevActiveStep + 1);
            }
         })
         .catch(err => console.log("ERROR", err));
   }

   const handleQuestions = () => {
      if (state.respuesta1.trim().length === 0 || state.respuesta2.trim().length === 0)
         return;

      fetch(`http://localhost:6969/api/users/${state.id_usuario}/questions`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            respuesta1: state.respuesta1,
            respuesta2: state.respuesta2
         })
      })
         .then(handleFetch)
         .then(data => {
            localStorage.setItem("token", "bearer " + data.token);
            updateByKey('activeStep', 2)
         })
         .catch(e => alert(e));
   }

   const old_changePassword = (e) => {
      if ({ password } === { password2 }) {
         fetch('http://localhost:6969/api/password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            type: 'cors',
            body: JSON.stringify({
               usuario: { user },
               password: { password },
               withUser: true
            })
         })
            .then(res => res.json())
            .then(data => {
               console.log(data.response);
               if (data.response.endsWith('exitosa')) {
                  console.log(data.user);
                  localStorage.setItem("user", JSON.stringify(data.user));
                  alert(data.response);
                  props.history.push('search');
               }
            })
            .catch(err => console.log("ERROR", err));
      }
   }

   const changePassword = (e) => {
      if (state.password.length > 0 && state.password === state.password2) {
         fetch(`http://localhost:6969/api/users/${state.id_usuario}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ password: password })
         })
            .then(handleFetch)
            .then(data => {
               debugger
               console.log(data);
               localStorage.setItem("token", "bearer " + data.token);
               localStorage.setItem("user", JSON.stringify(data.user));
               props.history.push('/busqueda');
            })
            .catch(err => console.log("ERROR", err));
      }
   }

   const handleNext = () => {
      state.activeStep === 0 ? handleUsername() :
         state.activeStep === 1 ? handleQuestions() :
            changePassword();
   };
   const handleBack = () => {
      setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const handleChange = (e) => {
      updateByKey(e.target.name, e.target.value.trim());
   }

   /**
    * 
    * @param {number} step 
    */
   const getStepContent = (step) => {
      switch (step) {
         case 0:
            return (
               <FormControl>
                  <TextField
                     onChange={handleChange}
                     name="user"
                     value={state.user}
                     id="standard-name"
                     label="Nombre de usuario"
                     variant="outlined"
                  />
               </FormControl>

            );
         case 1:
            return (
               <React.Fragment>
                  <TextField
                     onChange={handleChange}
                     name="respuesta1"
                     value={state.respuesta1}
                     id="outlined-basic"
                     label="Respuesta #1"
                     helperText={`Primera pregunta: ${state.pregunta1}`}
                     variant="outlined" />
                  <Box>
                     <TextField
                        onChange={handleChange}
                        name="respuesta2"
                        value={state.respuesta2}
                        id="outlined-basic"
                        label="Respuesta #2"
                        helperText={`Segunda pregunta: ${state.pregunta2}`}
                        variant="outlined" />
                  </Box>
               </React.Fragment>
            );
         case 2:
            return (
               <Box>
                  <TextField
                     onChange={handleChange}
                     name="password"
                     value={state.password}
                     id="outlined-password-input"
                     label="Nueva contraseña"
                     type="password"
                     variant="outlined"
                  />
                  <Box>
                     <TextField
                        onChange={handleChange}
                        name="password2"
                        value={state.password2}
                        id="outlined-password-input"
                        label="Confirmar contraseña"
                        type="password"
                        variant="outlined"
                     />
                  </Box>
               </Box>
            );
         default:
            return 'Unknown step';
      }
   }

   return (
      <Box display='flex' textAlign="center" bgcolor="bg.main" width={1} justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
         <Card className={classes.root}>
            <CardHeader title="Recuperar Contraseña" />
            <Divider />
            <CardContent>
               <Box>
                  <Typography component={'span'} className={classes.instructions}>{getStepContent(state.activeStep)}</Typography>

                  <Stepper activeStep={state.activeStep} alternativeLabel>
                     {steps.map(label => (
                        <Step key={label}>
                           <StepLabel>{label}</StepLabel>
                        </Step>
                     ))}
                  </Stepper>
                  <Button
                     disabled={state.activeStep === 0}
                     onClick={handleBack}
                     className={classes.backButton}
                  >
                     Back
                  </Button>
                  <Button
                     variant="contained"
                     color="primary"
                     disabled={
                        (state.activeStep === 0 && state.user.trim().length === 0) ||
                        (state.activeStep === 1 && state.respuesta1.trim().length === 0 && state.respuesta2.trim().length === 0) ||
                        (state.activeStep === 2 &&
                           (
                              (state.password.trim().length === 0 || state.password2.trim().length === 0) || /* Si alguno esta vacio */
                              (state.password !== state.password2) /* asd */
                           )
                        )
                     }
                     onClick={handleNext}>
                     {state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
               </Box>
            </CardContent>
            <Divider />
            <CardActions>
               <Box mx="auto">
                  <Link component={reactLink} to='/login' underline='none' color="primary">
                     <Button>
                        Volver a inicio de sesión
            </Button>
                  </Link>
               </Box>
            </CardActions>
         </Card>
      </Box>
   );
}

export default withRouter(Recover);