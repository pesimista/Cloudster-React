import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Paper from '@material-ui/core/Paper';
//import { Link, AppBar, Toolbar, Typography, Button, Container, Box, makeStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useReducer } from 'react';
import { Link as RouterLink, Redirect, useHistory  } from 'react-router-dom';
import { handleFetch } from "../SF/helpers";
import { saduwux } from '../SF/Context';


const useStyles = makeStyles((theme) => ({
   grow: {
      flexGrow: 1,
    },
   root: {
      height: '100vh',
    },
   image: {
      backgroundImage: 'url(https://source.unsplash.com/random)', //"url(" + View + ")",
      backgroundRepeat: 'no-repeat',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    },
    form: {
      marginTop: theme.spacing(8),
      },
   sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
         display: 'flex',
      },
      },
   sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
         display: 'none',
      },
   },
    paper: {
      margin: theme.spacing(8, 4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
      },
   appBar: { 
      top: 'auto', 
      bottom: 0, 
   }
}));

const reactLink = React.forwardRef(
   (props, ref) => <RouterLink innerRef={ref} {...props} />
);
reactLink.displayName = 'reactLink';

function Alert(props) {
   return <MuiAlert elevation={6} variant="filled" {...props} />;
}

/*
<AppBar>
            <Toolbar>
               <Container maxWidth='lg'>
                  <Link component={reactLink} to='/login' underline='none'>
                     <Button size="large">
                        <Typography  fontWeight="fontWeightBold">Iniciar Sesión</Typography>
                     </Button>
                  </Link>
                  <Link component={reactLink} to='/register' underline='none'>
                     <Button size="large">
                        <Typography  fontWeight="fontWeightBold">Registrarse</Typography>
                     </Button>
                  </Link>
               </Container>
            </Toolbar>
         </AppBar>





         <Typography component={'span'} align="center">
                     <Box
                        color="secondary.main"
                        fontSize="h2.fontSize"
                        fontWeight="fontWeightBold"
                        lineHeight={2}
                        className={classes.form}
                        >
                        <CloudIcon
                           color='primary'
                           fontSize="inherit"/>
                        Cloudster
                     </Box>
                     <Box fontSize="h4.fontSize">Una forma sencilla de compartir tus archivos sin limites de plataforma.</Box>
                  </Typography>
         */

const initialState = {
   open: false,
   message:'',
   logedIn: false,
   signInUser: "",
   signInPassword: "",
   wrong: "",
   block: false
};

const reducer = (state, action) => {
   return { ...state, ...action };
};

const Welcome = () => {
   const history = useHistory();
   const classes = useStyles();
   const { state: { logStatus } } = useContext(saduwux);

   const [state, update] = useReducer(reducer, initialState);
   const { dispatch } = useContext(saduwux);

   const handleLogin = () => {
      if (
         state.signInUser.trim().length === 0 ||
         state.signInPassword.trim().length === 0
      )
         return;

      fetch("/api/users/login", {
         method: "post",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            usuario: state.signInUser.trim(),
            password: state.signInPassword.trim()
         })
      })
         .then(handleFetch)
         .then(data => {
            localStorage.setItem("token", "bearer " + data.token);
            dispatch({ type: "login", payload: { user: data.user } });
            update({ open: true, message: 'Inicio de sesión exitoso!' });
            setTimeout(() => {
               history.push("/busqueda");
            }, 500);
         })
         .catch(error => {
            update({ open: true, message: error.message });
         });
   };

   const handleClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      update({ open: false });
   };

   if (logStatus === 2) {
      return <Redirect to='/busqueda' />
   } else return (
      <Box width={1}>
         <AppBar>
            <Toolbar>
               <Container maxWidth='lg' className={classes.sectionDesktop}>
                  <Link component={reactLink} to='/login' underline='none'>
                     <Button size="large">
                        <Typography  fontWeight="fontWeightBold">Iniciar Sesión</Typography>
                     </Button>
                  </Link>
                  <Link component={reactLink} to='/register' underline='none'>
                     <Button size="large">
                        <Typography  fontWeight="fontWeightBold">Registrarse</Typography>
                     </Button>
                  </Link>
               </Container>
               <div className={classes.grow} />
               <Link className={classes.sectionMobile} component={reactLink} to='/register' underline='none'>
                     <Button size="large">
                        <Typography  fontWeight="fontWeightBold">Registrarse</Typography>
                     </Button>
                  </Link>
            </Toolbar>
         </AppBar>
         <Grid container component="main" className={classes.root}>
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                  <Typography component={'span'} align="center" variant="h2">
                     <Box
                        color="secondary.main"
                        className={classes.form}
                        >
                        <CloudIcon
                           color='primary'
                           fontSize="inherit"/>
                        Cloudster
                     </Box>
                     <Typography variant="h4">Una forma sencilla de compartir tus archivos sin limites de plataforma.</Typography>
                     <Box display={{ xs: 'block', sm: 'none' }}>
                        <Link component={reactLink} to='/login' underline='none'>
                           <Button size="large" color="primary" variant="contained">
                              Iniciar Sesión
                           </Button>
                        </Link>
                     </Box>
                  </Typography>
               <Box display={{ xs: 'none', sm: 'block' }}>
                  <Container maxWidth={'xs'}>
                     <TextField
                        disabled={state.block}
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Nombre de usuario"
                        variant="outlined"
                        onChange={e => update({ signInUser: e.target.value })}
                     />
                     <TextField
                        disabled={state.block}
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        type="password"
                        label="Contraseña"
                        variant="outlined"
                        onChange={e => update({ signInPassword: e.target.value })}
                     />
                     <Button
                        disabled={
                           state.block ||
                           state.signInUser.length === 0 ||
                           state.signInPassword.length < 6
                        }
                        className={classes.submit}
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={handleLogin}
                     >
                        Iniciar Sesión
                     </Button>
                     <Link
                     component={reactLink}
                     to="/recover"
                     color="secondary"
                  >
                     Olvidé mi contraseña
                  </Link>
                  </Container>
               </Box>
            </Grid>
            <Grid item xs={false} sm={4} md={7} className={classes.image} />
         </Grid>
         <Snackbar 
            anchorOrigin={{
               vertical: "bottom",
               horizontal: "left"
            }}
            open={state.open} 
            onClose={handleClose}
            autoHideDuration={6000}
         >
            <Alert onClose={handleClose} severity="success">
               {state.message}
            </Alert>
         </Snackbar>
      </Box>
   )
}
export default Welcome;