import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { green } from "@material-ui/core/colors";
import Container from "@material-ui/core/Container";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
//import { Link, Avatar, makeStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, Divider, Box } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FolderIcon from '@material-ui/icons/Folder';
import React, { useContext } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';
import { saduwux } from "../SF/Context";

const useStyles = makeStyles(theme => ({
   card: {
      minWidth: 300,
      margin: 5
   },
   list: {
      overflow: 'auto',
      maxHeight: 300,
   },
   avatar: { backgroundColor: green[500] },
}));

const reactLink = React.forwardRef((props, ref) => (
   <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = "reactLink";

function generate(element) { // Método para mostrar unos cuantos "archivos" de prueba
   return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) =>
      React.cloneElement(element, {
         key: value,
      }),
   );
}




/*
const initialState = {
   files: [],
} 
*/

const Profile = () => {
   const classes = useStyles();
   const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

   /*          Algo así para buscar los archivos subidos por el usuario
   React.useEffect(() => {
      fetch(`/api/files/${globalState.folder}/files`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
         }
      })
         .then(handleFetch)
         .then(
            response => update({ files: sort(response) })
         ).catch(mistake => console.log(`/api/files/${globalState.folder}/files`, mistake.message));
   }, [globalState.folder, state.shouldUpdate]);
   */

   /* const toFolder = () => {  //// Método para llevar al folder en el que se encuentra el archivo en el Search

   }*/

   /*const getFiles = () => state.files.something((file, index) => {  ///// Método para mostrar los archivos subidos por el usuario
      const temp = <ListItem>
            <ListItemIcon>
               <img
                  src={getIcon(true, state.file.ext)}
                  width="24"
                  height="24" />
            </ListItemIcon>
            <ListItemText
            primary={file.name}
            />
            <ListItemSecondaryAction>
               <IconButton edge="end">
                  <FolderIcon
                  onClick={toFolder}
                  color="inherit"
                  />
               </IconButton>
            </ListItemSecondaryAction>
      </ListItem>;
      return [temp]
      })
   }*/

   // const { nombre, nivel, desde, usuario } = props.user;

   const {
      state: { user }
   } = useContext(saduwux);

   if (!user.id)
      return <Redirect to="/notlogged" />;

   const data = [ //Hacer método para juntar archivos por tipo
      { name: 'pdf', value: 400 },
      { name: 'png', value: 350 },
      { name: 'Word', value: 100 },
      { name: 'mp3', value: 200 },
   ];

   const result = data.reduce((totalValue, data) => totalValue + data.value, 0); // Suma de todos los archivos

   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colores para el chart

   return (
      <Box
         component="main"
         width={1}
         textAlign="center"
         className="min-h100"
      >
         <Container fixed disableGutters maxWidth="md">
            <Grid
            container
            alignItems="center">
            <Grid
               item
               xs
               justify="center"
               container
            >
               <Grid item>
                  <Card className={classes.card}>
                     <CardHeader title="Perfil" />
                     <Divider />
                     <CardContent>
                        <Typography variant="h3">
                           {user.usuario}
                        </Typography>
                        <Box m={0.5}>
                           <Box display="flex" justifyContent="center">
                              <Avatar className={classes.avatar}>{user.nivel}</Avatar>
                           </Box>
                           <Typography color="textSecondary">
                              Nivel de jerarquía
                        </Typography>
                        </Box>
                        <Divider />
                        <Box m={0.5}>
                           <Typography>
                              {user.nombre} {user.apellido}
                           </Typography>
                           <Typography>
                              Miembro desde: {user.desde}
                           </Typography>
                        </Box>
                        <Divider />
                        <Box m={0.5}>
                           <Typography>
                              Espacio en el servidor: 154.20 MB {/* something.espacioEnServidor*/}
                           </Typography>
                           <Typography>
                              Total de archivos subidos: {result}
                           </Typography>
                        </Box>
                        <Divider />
                     </CardContent>
                     <CardActions>
                        <Box mx="auto">
                           <Link
                              component={reactLink}
                              to="/configuracion"
                              underline="none">
                              <Button variant="contained" color="primary">
                                 Configuración
                           </Button>
                           </Link>
                        </Box>
                     </CardActions>
                  </Card>
               </Grid>
            </Grid>
            <Grid
               item
               container
               xs
            >
               <Grid item xs={12}>
                  <Card className={classes.card}>
                     <CardHeader title="Archivos Subidos" />
                     <Divider />
                     <CardContent>
                        <List className={classes.list} dense={true}>
                           {/*getFiles()*/}
                           {generate(
                              <ListItem>
                                 <ListItemIcon>
                                    <FolderIcon />
                                 </ListItemIcon>
                                 <ListItemText
                                    primary="Single-line item"
                                    secondary={null}
                                 />
                                 <ListItemSecondaryAction>
                                    <IconButton edge="end">
                                       <FolderIcon />
                                    </IconButton>
                                 </ListItemSecondaryAction>
                              </ListItem>
                           )}
                        </List>
                     </CardContent>
                  </Card>
               </Grid>
               <Grid item  xs={12}>
                  <Card className={classes.card}>
                     <CardHeader title="Tipos de Archivos" />
                     <Divider />
                     
                     <CardContent>
                        
                        <PieChart width={matches ? 400 : 300 } height={300} style={{ fontFamily: 'sans-serif' }}>
                           <Pie
                              data={data}
                              cx={'50%'}
                              cy={'50%'}
                              label
                              innerRadius={'68.9656%'}
                              outerRadius={'80%'}
                              fill="#8884d8"
                              paddingAngle={3}
                              dataKey="value"
                              isAnimationActive={false}>
                              <Label value={result} style={{ fontSize: '1.5rem' }} offset={0} position="center" />
                              {
                                 data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                              }
                           </Pie>
                           <Legend layout={matches ? 'vertical' : 'horizontal'} verticalAlign={matches ? 'middle' : 'bottom'} align={matches ? 'left' : 'center'} />
                        </PieChart>
                     </CardContent>
                  </Card>
               </Grid>
            </Grid>
         </Grid>
         </Container>
         <Box display={{ xs: 'flex', sm: 'none' }}>
            <Toolbar variant="dense"/>
         </Box>
      </Box>
   );
};

export default Profile;
