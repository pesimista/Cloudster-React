//import { Button, Card, CardActions, CardContent, CardHeader, Divider, Link, makeStyles, Snackbar, TextField } from '@material-ui/core';
import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Snackbar from "@material-ui/core/Snackbar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import { Link as RouterLink, useHistory } from "react-router-dom";
import MySnackbarContentWrapper from "../SubSnackBar/SubSnackBar";

import { handleFetch } from "../SF/helpers";

const useStyles = makeStyles(theme => ({
   root: {
      "& .MuiTextField-root": {
         margin: theme.spacing(0.5),
         width: 300
      }
   },
   buttonStyle: {
      "& .MuiButton-root": {
         margin: theme.spacing(0.5),
         width: 300
      }
   }
}));

const initialState = {
   open: false,
   logedIn: false,
   signInUser: "",
   signInPassword: "",
   wrong: "",
   block: false
};

const reactLink = React.forwardRef((props, ref) => (
   <RouterLink innerRef={ref} {...props} />
));

const Login = props => {
   let history = useHistory();
   const classes = useStyles();
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

   const [open, setOpen] = React.useState(false);
   const [signInUser, updateUser] = useState("");
   const [signInPassword, updatePassword] = useState("");
   const [wrong, updateWrong] = useState("");
   const [block, updateBlock] = useState(false);

   const old_handleLogin = () => {
      fetch("/api/login", {
         method: "post",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            nombre: signInUser,
            usuario: signInUser,
            password: signInPassword
         })
      })
         .then(res => res.json())
         .then(data => {
            if (data.response === "Grant access") {
               localStorage.setItem("user", JSON.stringify(data.user));
               setOpen(true);
               console.log("hace esto");
               setTimeout(() => {
                  history.push("/Busqueda");
               }, 1000);
            } else if (data.response === "Contraseña incorrecta!") {
            } else {
               console.log("reason 2: ", data.response);
            }
         })
         .catch(err => console.log("ERROR", err));
   };

   const handleLogin = () => {
      if (state.signInUser.trim().length === 0 || state.signInPassword.trim().length === 0)
         return;
         
      fetch("http://localhost:6969/api/users/login", {
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
            localStorage.setItem("user", JSON.stringify(data.user));
            updateState({ open: true });
            setTimeout(() => {
               history.push("/Busqueda");
            }, 500);
         })
         .catch(error => {
            alert(error.message);
         })
   };

   const onTry = response => {
      if (response === "Grant access") {
         updateWrong("grant");
      } else if (response === "Contraseña incorrecta!") {
         updateWrong("ci");
      } else if (response === "Bloqueado por multiples intentos fallidos") {
         updateBlock(true);
         updateWrong("grant");
      } else {
         updateWrong("un");
      }
   };

   const handleClose = (event, reason) => {
      if (reason === "clickaway")
         return;
      setOpen(false);
   };

   return (
      <Box
         textAlign="center"
         bgcolor="bg.main"
         display="flex"
         width={1}
         justifyContent="center"
         alignItems="center"
         style={{ minHeight: "100vh" }}
      >
         <Box className={classes.root}>
            <Card>
               <Box>
                  <CardHeader
                     title="Inicia Sesión"
                     subheader="Comienza a compartir archivos"
                  />
                  <Divider />
               </Box>
               <CardContent className={classes.buttonStyle}>
                  <TextField
                     disabled={state.block}
                     onChange={e => updateByKey("signInUser", e.target.value)}
                     id="outlined-basic"
                     label="Nombre de usuario"
                     variant="outlined"
                  />
                  <Box>
                     <TextField
                        disabled={state.block}
                        onChange={e => updateByKey("signInPassword", e.target.value)}
                        id="outlined-basic"
                        type="password"
                        label="Contraseña"
                        variant="outlined"
                     />
                  </Box>
                  <Button
                     disabled={
                        state.block ||
                        state.signInUser.length === 0 || state.signInPassword.length < 6
                     }
                     onClick={handleLogin}
                     variant="outlined"
                     color="primary"
                     size="large"
                  >
                     Iniciar Sesión
                  </Button>
                  <Box>
                     <Snackbar
                        anchorOrigin={{
                           vertical: "bottom",
                           horizontal: "left"
                        }}
                        open={state.open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                     >
                        <MySnackbarContentWrapper
                           onClose={handleClose}
                           variant="success"
                           message="Inicio de sesión exitoso!"
                        />
                     </Snackbar>
                  </Box>
               </CardContent>
               <CardActions>
                  <Box mx="auto">
                     <Link
                        component={reactLink}
                        to="/recover"
                        underline="none"
                        color="secondary"
                     >
                        Olvidé mi contraseña
                     </Link>
                  </Box>
               </CardActions>
            </Card>
            <Box m={1}>
               <Box mx="auto">
                  <Button
                     variant="outlined"
                     color="secondary"
                     onClick={preventDefault}
                  >
                     <Link component={reactLink} to="/register" underline="none">
                        <Box fontWeight="fontWeightBold">Registrarse</Box>
                     </Link>
                  </Button>
               </Box>
            </Box>
         </Box>
      </Box>
   );
};
export default Login;