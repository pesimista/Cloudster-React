import { Snackbar } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Link from "@material-ui/core/Link";
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Typography from '@material-ui/core/Typography';
import React, { useReducer } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { handleFetch, structuteChecker } from '../SF/helpers';
import MySnackbarContentWrapper from '../SubSnackBar/SubSnackBar';

const useStyles = makeStyles(theme => ({
   root: {
      '& .MuiTextField-root': {
         margin: theme.spacing(1),
         width: 350,
      },
      '& .MuiFormHelperText-contained': {
         marginTop: '4px',
         textAlign: 'center'
      },
      '& .MuiFormHelperText-contained:Empty': {
         minHeight: '12px'
      }
   },
   root2: {
      [theme.breakpoints.up('md')]: {
         width: '50%'
      },
      [theme.breakpoints.up('lg')]: {
         width: '70%'
      },
      [theme.breakpoints.up('xl')]: {
         width: '50%'
      },
   },
   button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
   },
   actionsContainer: {
      marginBottom: theme.spacing(2),
   },
   resetContainer: {
      padding: theme.spacing(3),
   },
   formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
   },
   selectEmpty: {
      marginTop: theme.spacing(2),
   },
}));

const reactLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const initialState = {
   open: false,
   activeStep: 0,
   nombre: "",
   apellido: "",
   user: "",
   userExist: false,
   password: "",
   password2: "",
   pregunta1: 1,
   pregunta2: 2,
   respuesta1: "",
   respuesta2: "",
   questions: []
}

const reducer = (state, action) => {
   return { ...state, ...action };
}

const Register = (props) => {
   let history = useHistory();
   const classes = useStyles();

   const [state, update] = useReducer(reducer, initialState);

   const questions = [
      { id: "1", pregunta: "Cuál es el nombre de tu mejor amigo?" },
      { id: "2", pregunta: "Cuál es la ciudad donde naciste?" },
      { id: "3", pregunta: "Cómo se llamaba tu primera mascota?" },
      { id: "4", pregunta: "Cuál es tu color favorito?" },
      { id: "5", pregunta: "Cuál es el segundo nombre de tu madre?" }
   ];

   const handleRegister = () => {
      const keys = [
         { name: "nombre", required: true, type: "string", length: 2 },
         { name: "apellido", required: true, type: "string", length: 2 },
         { name: "password", required: true, type: "string", length: 6 },
         { name: "user", required: true, type: "string", length: 6 },
         { name: "pregunta1", required: true, type: "number" },
         { name: "pregunta2", required: true, type: "number" },
         { name: "respuesta1", required: true, type: "string", length: 3 },
         { name: "respuesta2", required: true, type: "string", length: 3 }
      ];

      if (!structuteChecker(state, keys))
         return;

      fetch('http://localhost:6969/api/users', {
         method: 'post',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({
            nombre: state.nombre.trim(),
            apellido: state.apellido.trim(),
            password: state.password,
            usuario: state.user.trim(),
            pregunta1: state.pregunta1,
            pregunta2: state.pregunta2,
            respuesta1: state.respuesta1.trim(),
            respuesta2: state.respuesta2.trim()
         })
      }).then(handleFetch).then(
         data => {
            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("token", 'bearer ' + data.token);
            update({
               userExist: false,
               open: true
            });

            setTimeout(() => {
               history.push('/busqueda');
            }, 1000);
         }
      ).catch(err => {
         console.log(err);
         update({ activeStep: 2 });
      });
   }

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
         return;
      }
      update({ open: false });
      // setOpen(false);
   };

   const steps = ['Nombres y Contraseña', 'Preguntas Secretas', 'Nombre de usuario'];
   const handleNext = () => update({ activeStep: state.activeStep + 1 });
   const handleBack = () => update({ activeStep: state.activeStep - 1 });
   const handleClick = () => state.activeStep < 2 ? handleNext() : handleRegister();

   const handleChange = (e) => {
      if (state.userExist && e.target.name === 'user') {
         update({ userExist: false, user: e.target.value });
      }
      else
         update({ [e.target.name]: e.target.value });

      console.log(e.target.name, e.target.value);
   }

   const mapPreguntas = questions.map(item => {
      return <MenuItem key={item.id} value={item.id}> {item.pregunta} </MenuItem>
   });

   const getStepContent = (step) => {
      switch (step) {
         case 0:
            return (
               <Box display='flex' justifyContent="center" flexWrap="wrap">
                  <Box className={classes.root}>
                     <TextField
                        onChange={handleChange}
                        name="nombre"
                        value={state.nombre}
                        id="outlined-basic"
                        label="Nombre" variant="outlined"
                        helperText='El nombre debe contener al menos 2 catacteres'
                     />
                     <Box>
                        <TextField
                           onChange={handleChange}
                           name="apellido"
                           value={state.apellido}
                           id="outlined-basic"
                           label="Apellido"
                           variant="outlined"
                           helperText='El apellido debe contener al menos 2 catacteres'
                        />
                     </Box>
                  </Box>
                  <Box>
                     <TextField
                        onChange={handleChange}
                        name="password"
                        value={state.password}
                        type="password"
                        id="outlined-password-input"
                        label="Contraseña"
                        variant="outlined"
                        helperText='La contraseña debe contener al menos 6 catacteres'
                     />
                     <Box>
                        <TextField
                           onChange={handleChange}
                           name="password2"
                           value={state.password2}
                           type="password"
                           error={state.password2.length > 2 && state.password !== state.password2}
                           helperText={state.password2.length > 2 && state.password !== state.password2 ? "Las contraseñas no coinciden" : ' '}
                           label="Confirmar contraseña"
                           variant="outlined" />
                     </Box>
                  </Box>
               </Box>
            );
         case 1:
            return (
               <Box display='flex' justifyContent="center" flexWrap="wrap">
                  <Box>
                     <TextField
                        id="outlined-select-currency"
                        select
                        onChange={handleChange}
                        name="pregunta1"
                        helperText={state.pregunta1 === state.pregunta2 ? 'Las preguntas no pueden ser iguales' : ' '}
                        error={state.pregunta1 === state.pregunta2}
                        value={state.pregunta1}
                        label="Primera pregunta"
                        variant="outlined"
                     >
                        {mapPreguntas}
                     </TextField>
                     <Box>
                        <TextField
                           onChange={handleChange}
                           name="respuesta1"
                           value={state.respuesta1}
                           id="outlined-basic"
                           label="Respuesta"
                           variant="outlined" />
                     </Box>
                  </Box>
                  <Box>
                     <TextField
                        id="outlined-select-currency"
                        select
                        label="Segunda pregunta"
                        onChange={handleChange}
                        name="pregunta2"
                        helperText={state.pregunta1 === state.pregunta2 ? 'Las preguntas no pueden ser iguales' : ' '}
                        error={state.pregunta1 === state.pregunta2}
                        value={state.pregunta2}
                        variant="outlined"
                     >
                        {mapPreguntas}
                     </TextField>
                     <Box>
                        <TextField
                           onChange={handleChange}
                           name="respuesta2"
                           value={state.respuesta2}
                           id="outlined-basic"
                           label="Respuesta"
                           variant="outlined"
                        />
                     </Box>
                  </Box>
               </Box>
            );
         case 2:
            return (
               <Box display='flex' justifyContent="center" flexWrap="wrap">
                  <TextField
                     onChange={handleChange}
                     name="user"
                     value={state.user}
                     helperText={state.userExist ? 'El nombre de usuario ya existe' : ' '}
                     error={state.userExist}
                     id="outlined-basic"
                     label="Nombre de usuario"
                     variant="outlined" />
               </Box>
            )
         default:
            return 'Paso no existente';
      }
   }
   return (
      <Box className={classes.root} bgcolor="bg.main" width={1} display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
         <div className={classes.root2} >
            <Stepper activeStep={state.activeStep} orientation="vertical">
               {steps.map((label, index) => (
                  <Step key={label}>
                     <StepLabel>{label}</StepLabel>
                     <StepContent>
                        <Typography component={'span'}>{getStepContent(index)}</Typography>
                        <div className={classes.actionsContainer}>
                           <div style={{ display: 'flex', justifyContent: 'center' }}>
                              <Button
                                 disabled={state.activeStep === 0}
                                 onClick={handleBack}
                                 className={classes.button}
                              >
                                 Volver
                              </Button>
                              <Button
                                 disabled={
                                    (index === 0 &&
                                       (state.nombre.length < 2 ||
                                          state.apellido.length < 2 ||
                                          state.password.length < 6 ||
                                          state.password !== state.password2)
                                    ) ||
                                    (index === 1 && (state.respuesta1.length < 3 || state.respuesta2.length < 3)) ||
                                    (index === 2 && state.user.length < 3)
                                 }
                                 variant="contained"
                                 color="primary"
                                 onClick={handleClick}
                                 className={classes.button}
                              >
                                 {state.activeStep === (steps.length - 1) ? 'Registrarse' : 'Siguiente'}
                              </Button>
                           </div>
                        </div>
                     </StepContent>
                  </Step>
               ))}
            </Stepper>
            <Box>
               <Snackbar
                  anchorOrigin={{
                     vertical: 'bottom',
                     horizontal: 'left',
                  }}
                  open={state.open}
                  autoHideDuration={6000}
                  onClose={handleClose}
               >
                  <MySnackbarContentWrapper
                     onClose={handleClose}
                     variant="success"
                     message="Registro exitoso!"
                  />
               </Snackbar>
            </Box>
            <Paper square elevation={0} className={classes.resetContainer}>
               <Typography>
                  Ya tienes cuenta?
        </Typography>
               <Link component={reactLink} to='/login'>
                  <Button className={classes.button}>
                     Inicia Sesión!
            </Button>
               </Link>
            </Paper>
         </div>
      </Box>
   )
}

export default Register;

// const old_handleRegister = () => {
//    fetch('/api/register', {
//       method: 'post',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//          nombre: nombre,
//          password: password,
//          usuario: user,
//          pregunta1: pregunta1,
//          pregunta2: pregunta2,
//          respuesta1: respuesta1,
//          respuesta2: respuesta2
//       })
//    })
//       .then(handleFetch)
//       .then(data => {

//          if (data.response === 'Grant access') {
//             localStorage.setItem("user", JSON.stringify(data.user));
//             updateUserExist(false);
//             setOpen(true);
//             setTimeout(() => {
//                history.push('/Busqueda');
//             }, 1000);
//          }
//          else if (data.response === 'El nombre de usuario ya existe!') {
//             console.log(data.response);
//             updateUserExist(true);
//             setActiveStep(2);
//          }
//          else {
//             alert(data.response);
//          }
//       })
//       .catch(err => console.log("ERROR", err));
// }

// const [password, updatePassword] = React.useState('');
// const [password2, updatePassword2] = React.useState('');
// const [pregunta1, updatePregunta1] = React.useState(1);
// const [pregunta2, updatePregunta2] = React.useState(2);
// const [respuesta1, updateRespuesta1] = React.useState('');
// const [respuesta2, updateRespuesta2] = React.useState('');