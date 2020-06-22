import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from "@material-ui/core/IconButton";
import Link from '@material-ui/core/Link';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
//import { TextField, Card, CardContent, CardActions, Link, Divider, CardHeader, Box, StepLabel, Stepper, Typography, Step, makeStyles, Button, FormControl } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import React, { useContext, useReducer } from 'react';
import { Link as RouterLink, useHistory, withRouter } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch } from '../SF/helpers';



const useStyles = makeStyles(theme => ({
   marginTop: {
      marginTop: theme.spacing(8),
   },
   form: {
      marginTop: theme.spacing(1),
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

const reactLink = React.forwardRef((props, ref) =>
   <RouterLink innerRef={ref} {...props} />
);
reactLink.displayName = 'reactLink';

const initialState = {
   activeStep: 0,
   user: '',
   id: '',
   pregunta1: '',
   pregunta2: '',
   respuesta1: '',
   respuesta2: '',
   password: '',
   password2: ''
}
const reducer = (state, action) => {
   return { ...state, ...action }
};

const Recover = () => {
   const classes = useStyles();
   const steps = ['Nombre de Usuario', 'Preguntas Secretas', 'Nueva Contraseña'];
   const history = useHistory();

   const [state, update] = useReducer(reducer, initialState);
   const { dispatch } = useContext(saduwux);

   const handleUsername = () => {
      if (state.user.trim().length === 0) return
      fetch(`/api/users/${state.user}/questions`)
         .then(handleFetch)
         .then(data => {
            console.log('asd');
            update({
               user: data.usuario.trim(),
               id_usuario: data.id_usuario.trim(),
               pregunta1: data.pregunta1,
               pregunta2: data.pregunta2,
               activeStep: 1
            });
         })
         .catch(e => console.log(e));
   };

   const handleQuestions = () => {
      if (state.respuesta1.trim().length === 0 || state.respuesta2.trim().length === 0)
         return;

      fetch(`/api/users/${state.id_usuario}/questions`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            respuesta1: state.respuesta1,
            respuesta2: state.respuesta2
         })
      })
         .then(handleFetch)
         .then(data => {
            localStorage.setItem('token', 'bearer ' + data.token);
            update({ 'activeStep': 2 })
         })
         .catch(e => alert(e));
   }

   const changePassword = () => {
      if (state.password.length > 0 && state.password === state.password2) {
         fetch(`/api/users/${state.id_usuario}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ password: state.password })
         })
            .then(handleFetch)
            .then(data => {
               dispatch({ type: 'login', payload: { user: data.user } });
               localStorage.setItem('token', 'bearer ' + data.token);
               history.push('/busqueda');
            })
            .catch(err => console.log('ERROR', err));
      }
   }

   const handleNext = () => {
      state.activeStep === 0 ? handleUsername() :
         state.activeStep === 1 ? handleQuestions() :
            changePassword();
   };
   const handleBack = () => {
      update({ activeStep: state.activeStep - 1 });
      // setActiveStep(prevActiveStep => prevActiveStep - 1);
   };

   const handleChange = (e) => {
      update({ [e.target.name]: e.target.value });
   }

   /**
    * 
    * @param {number} step 
    */
   const getStepContent = (step) => {
      switch (step) {
         case 0:
            return (
               <TextField
                  onChange={handleChange}
                  name='user'
                  value={state.user}
                  id='standard-name'
                  label='Nombre de usuario'
                  variant='outlined'
                  margin="normal"
                  required
                  fullWidth
                  autoFocus
               />
            );
         case 1:
            return (
               <Box>
                  <TextField
                     onChange={handleChange}
                     name='respuesta1'
                     value={state.respuesta1}
                     id='respuesta1'
                     label='Respuesta #1'
                     helperText={state.pregunta1}
                     variant='outlined'
                     margin="normal"
                     required
                     fullWidth
                     autoFocus
                  />
                  <TextField
                     onChange={handleChange}
                     name='respuesta2'
                     value={state.respuesta2}
                     id='outlined-basic'
                     label='Respuesta #2'
                     helperText={state.pregunta2}
                     variant='outlined'
                     margin="normal"
                     required
                     fullWidth
                  />
               </Box>
            );
         case 2:
            return (
               <Box>
                  <TextField
                     onChange={handleChange}
                     name='password'
                     value={state.password}
                     id='outlined-password-input'
                     label='Nueva contraseña'
                     type='password'
                     variant='outlined'
                     margin="normal"
                     required
                     fullWidth
                     autoFocus
                  />
                  <TextField
                     onChange={handleChange}
                     name='password2'
                     value={state.password2}
                     id='outlined-password-input'
                     label='Confirmar contraseña'
                     type='password'
                     variant='outlined'
                     margin="normal"
                     fullWidth
                     required
                  />
               </Box>
            );
         default:
            return 'Unknown step';
      }
   }

   return (
      <Container component="main" maxWidth="sm">
         <Box className={classes.marginTop} display="flex" flexDirection="column" alignItems="center" textAlign="center">
            <Link to="/" component={reactLink} >
               <IconButton>
                  <CloudIcon
                     color='primary'
                     style={{ fontSize: '4rem' }}
                  />
               </IconButton>
            </Link>
            <Typography component="h1" variant="h5">
               Recuperar Contraseña
            </Typography>
            <Box className={classes.form} width="75%">
               <Divider />
               <Typography component={'span'} className={classes.instructions}>{getStepContent(state.activeStep)}</Typography>
            </Box>
            <Box width={1}>
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
                  Volver
               </Button>
               <Button
                  variant='contained'
                  color='primary'
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
                  {state.activeStep === steps.length - 1 ? 'Aceptar' : 'Siguiente'}
               </Button>
            </Box>
         </Box>
         <Grid container>
            <Grid item xs>
               <Link
                  component={reactLink}
                  to="/login"
                  color="secondary"
               >
                  Volver a inicio de sesión
                  </Link>
            </Grid>
            <Grid item>
               <Link
                  component={reactLink}
                  to="/register"
               >
                  Registrarse
                  </Link>
            </Grid>
         </Grid>
      </Container>
   );
}

export default withRouter(Recover);