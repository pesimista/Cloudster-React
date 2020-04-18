import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
//import { makeStyles, Typography, Box, Tabs, Tab, Container, TextField, MenuItem, Button} from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import { saduwux } from "../SF/Context";
import { handleFetch } from "../SF/helpers";

const useStyles = makeStyles(theme => ({
   root: {
      "& .MuiTab-wrapper": {
         justifyContent: "flex-start",
         flexDirection: "row"
      },
      "& .MuiTextField-root": {
         margin: theme.spacing(0.5),
         width: 350
      },
      "& .MuiTab-root": {
         borderBottom: `1px solid ${theme.palette.divider}`
      },
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      height: "50%"
   },
   tabs: {
      borderRight: `1px solid ${theme.palette.divider}`
   }
}));

const questions = [
   { id: "1", pregunta: "¿Cuál es el nombre de tu mejor amigo?" },
   { id: "2", pregunta: "¿Cuál es la ciudad donde naciste?" },
   { id: "3", pregunta: "¿Cómo se llamaba tu primera mascota?" },
   { id: "4", pregunta: "¿Cuál es tu color favorito?" },
   { id: "5", pregunta: "¿Cuál es el segundo nombre de tu madre?" }
];

const TabPanel = ({ children, value, index, ...other }) => {
   return (
      <Typography
         component="div"
         role="tabpanel"
         hidden={value !== index}
         id={`vertical-tabpanel-${index}`}
         aria-labelledby={`vertical-tab-${index}`}
         {...other}
      >
         {value === index && <Box p={3}>{children}</Box>}
      </Typography>
   );
}

TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.any.isRequired,
   value: PropTypes.any.isRequired
};

function a11yProps(index) {
   return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`
   };
}

const initialState = {
   value: 0,
   nombre: "",
   apellido: "",
   password: "",
   password2: "",
   pregunta1: 1,
   pregunta2: 2,
   respuesta1: "",
   respuesta2: ""
};

const userReducer = (state, payload) => {
   return { ...state, ...payload };
};

const ProfileSettings = props => {
   const classes = useStyles();

   const [state, update] = React.useReducer(userReducer, initialState);
   const {
      state: { user },
      dispatch
   } = React.useContext(saduwux);

   const [, updatePassword0] = React.useState("");

   const getPartialInfo = (tab) => {
      switch (tab) {
         case 0: {
            return JSON.stringify({
               nombre: state.nombre,
               apellido: state.apellido
            });
         }
         case 1: {
            return JSON.stringify({
               password: state.password,
               confirmpassword: state.password2
            });
         }
         case 2: {
            return JSON.stringify({
               pregunta1: state.pregunta1,
               pregunta2: state.pregunta2,
               respuesta1: state.respuesta1,
               respuesta2: state.respuesta2
            });
         }

         default: {
            return "";
         }
      }
   };

   const handleUpdate = () => {
      if (state.value === 1 && state.password2 !== state.password1) {
         alert('Marico las contraseñas no coinciden');
         return;
      }
      fetch(`/api/users/${user.id}`, {
         method: "PUT",
         headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token")
         },
         body: getPartialInfo(state.value)
      })
         .then(handleFetch)
         .then(res => {
            localStorage.setItem("token", "bearer " + res.token);
            dispatch({ type: 'update', payload: { user: res.user } });
            alert('Yes');
         })
         .catch(mistake => {
            console.log(mistake)
            alert('Error');
         });
   };

   const mapPreguntas = questions.map((P, index) => {
      return (
         <MenuItem key={index} value={P.id}>
            {" "}
            {P.pregunta}{" "}
         </MenuItem>
      );
   });

   if (!user.id)
      return <Redirect to="/notlogged" />;

   return (
      <Box
         textAlign="center"
         width={1}
         display="flex"
         bgcolor="bg.main"
         alignItems="center"
         style={{ height: "100vh" }}
      >
         <Container maxWidth="md" className={classes.root}>
            <Tabs
               orientation="vertical"
               variant="fullWidth"
               value={state.value}
               indicatorColor="primary"
               onChange={(event, newValue) => update({ value: newValue })}
               aria-label="Vertical tabs example"
               className={classes.tabs}
            >
               <Tab label="Perfil" {...a11yProps(0)} />
               <Tab label="Contraseña" {...a11yProps(1)} />
               <Tab label="Preguntas Secretas" {...a11yProps(2)} />
            </Tabs>
            <Typography>
               <TabPanel value={state.value} index={0}>
                  <div>
                     <TextField
                        onChange={e => update({ nombre: e.target.value })}
                        defaultValue={user.nombre}
                        id="outlined-basic"
                        label="Nombre"
                        variant="outlined"
                     />
                  </div>
                  <div>
                     <TextField
                        onChange={e => update({ apellido: e.target.value })}
                        defaultValue={user.apellido}
                        id="outlined-basic"
                        label="Apellido"
                        variant="outlined"
                     />
                  </div>
                  <Button
                     variant="contained"
                     color="primary"
                     className={classes.button}
                     onClick={handleUpdate}
                  >
                     {" "}
                     Guardar
                  </Button>
               </TabPanel>
               <TabPanel value={state.value} index={1}>
                  <TextField
                     onChange={e => updatePassword0(e.target.value)}
                     id="outlined-password-input"
                     label="Contraseña actual"
                     variant="outlined"
                  />
                  <Box>
                     <TextField
                        onChange={e => update({ password: e.target.value })}
                        error={state.password.length < 6}
                        id="outlined-password-input"
                        label="Nueva contraseña"
                        variant="outlined"
                     />
                  </Box>
                  <Box>
                     <TextField
                        onChange={e => update({ password2: e.target.value })}
                        error={state.password2.length < 6 || state.password !== state.password2}
                        id="outlined-password-input"
                        label="Confirmar nueva contraseña"
                        variant="outlined"
                     />
                  </Box>
                  <Button
                     variant="contained"
                     color="primary"
                     className={classes.button}
                     onClick={handleUpdate}
                  >
                     {" "}
                     Guardar
                  </Button>
               </TabPanel>
               <TabPanel value={state.value} index={2}>
                  <Box>
                     <Box>
                        <TextField
                           id="outlined-select-currency"
                           select
                           label="Primera pregunta"
                           value={state.pregunta1}
                           onChange={e => update({ pregunta1: e.target.value })}
                           variant="outlined"
                        >
                           {mapPreguntas}
                        </TextField>
                        <Box>
                           <TextField
                              onChange={e => update({ respuesta1: e.target.value })}
                              id="outlined-basic"
                              value={state.respuesta1}
                              label="Respuesta "
                              variant="outlined"
                           />
                        </Box>
                     </Box>
                     <Box>
                        <TextField
                           id="outlined-select-currency"
                           select
                           label="Segunda pregunta"
                           value={state.pregunta2}
                           onChange={e => update({ pregunta2: e.target.value })}
                           variant="outlined"
                        >
                           {mapPreguntas}
                        </TextField>
                        <Box>
                           <TextField
                              onChange={e => update({ respuesta2: e.target.value })}
                              id="outlined-basic"
                              value={state.respuesta2}
                              label="Respuesta "
                              variant="outlined"
                           />
                        </Box>
                     </Box>
                     <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={handleUpdate}
                     >
                        {" "}
                        Guardar
                     </Button>
                  </Box>
               </TabPanel>
            </Typography>
         </Container >
      </Box >
   );
};

export default ProfileSettings;
