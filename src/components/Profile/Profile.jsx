import {  PieChart, Pie,Cell, Tooltip, Label, LabelList } from 'recharts';
import Avatar from "@material-ui/core/Avatar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import { green } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Link from "@material-ui/core/Link";
//import { Link, Avatar, makeStyles, Card, CardContent, Typography, CardActions, Button, CardHeader, Divider, Box } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React, { useContext } from "react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { saduwux } from "../SF/Context";

const useStyles = makeStyles(theme => ({
   card: { minWidth: 275 },
   title: { fontSize: 14 },
   pos: { marginBottom: 12 },
   avatar: { backgroundColor: green[500] },
   content: {
      flexGrow: 1,
      padding: theme.spacing(3)
   },
   bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)"
   }
}));

const reactLink = React.forwardRef((props, ref) => (
   <RouterLink innerRef={ref} {...props} />
));



const Profile = props => {
   const classes = useStyles();

   // const { nombre, nivel, desde, usuario } = props.user;
   const {
      state: { user }
   } = useContext(saduwux);

   if (!user.id)
      return <Redirect to="/notlogged" />;

   const data = [
      { name: 'Group A', value: 400 },
      { name: 'Group B', value: 300 },
      { name: 'Group C', value: 300 },
      { name: 'Group D', value: 200 },
   ];

   const result = data.reduce((totalValue, data) => totalValue + data.value,0);
      
   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

   return (
      <Box
         
         width={1}
         textAlign="center"
         bgcolor="bg.main"
         
      >
         
         <Grid
            container
            direction="row"
            justify="space-around"
            alignItems="center"
            style={{ height: "100vh" }}
         >
         <Grid item>
            <Card className={classes.card}>
               <CardHeader title="Perfil" />
               <Divider />
               <CardContent>
                  <Typography variant="h3" className={classes.asd} gutterBottom>
                     {user.usuario}
                  </Typography>
                  <Box display="flex" justifyContent="center">
                     <Avatar className={classes.avatar}>{user.nivel}</Avatar>
                  </Box>
                  <Typography className={classes.pos} color="textSecondary">
                     Nivel de jerarquía
                  </Typography>
                  <Divider />
                  <Typography component={"span"}>
                     <Box>{`${user.nombre} ${user.apellido}`}</Box>
                     <Box>Miembro desde: {user.desde}</Box>
                  </Typography>
                  <Divider />
               </CardContent>
               <CardActions>
                  <Box mx="auto">
                     <Link
                        component={reactLink}
                        to="/configuracion"
                        underline="none"
                     >
                        <Button variant="contained" color="primary">
                           Configuración
                        </Button>
                     </Link>
                  </Box>
               </CardActions>
            </Card>
         </Grid>
         <Grid item>
            <Card className={classes.card}>
               <CardHeader title="Archivos subidos" />
               <Divider />
               <CardContent>
                  <PieChart width={400} height={400} style={{fontFamily: 'sans-serif'}}>
                     <Pie
                     data={data}
                     cx={200}
                     cy={200}
                     label
                     innerRadius={100}
                     outerRadius={120}
                     fill="#8884d8"
                     paddingAngle={5}
                     dataKey="value"
                     isAnimationActive={false}
                     >
                        <Label value={result} style={{fontSize: '1.5rem'}} offset={0} position="center" />
                        <LabelList dataKey="name" position="top" />
                        {
                           data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                        }
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </CardContent>
            </Card>
         </Grid>
         </Grid>
      </Box>
   );
};

export default Profile;
