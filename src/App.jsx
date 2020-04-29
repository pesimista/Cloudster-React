import './App.css';
import React, { useContext } from 'react';

/** Material */
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter, Route, Switch } from "react-router-dom";

/** Componentes */
import RequireLogin from './components/Err/RequireLogin';
import Search from './components/Files/Search';
import Login from './components/Login/Login';
import Recover from './components/Login/Recover';
import Profile from './components/Profile/Profile';
import ProfileSettings from './components/Profile/ProfileSettings';
import Register from './components/Register/Register';
import Reproductor from './components/Reproductor/Reproductor';
import Sidebar from './components/Sidebar/Sidebar';
import Bottombar from './components/Sidebar/Bottombar';
import TopBar from './components/TopBar/TopBar';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/Err/NotFound';
import Admin from './components/Admin/Admin';

/** Auxiliares */
import { saduwux } from './components/SF/Context';
import { handleFetch } from './components/SF/helpers';

const useStyles = makeStyles(theme => ({
   toolbar: theme.mixins.toolbar,
   main: { display: 'flex', minWidth: '100%', flexGrow: 1, position: 'relaive'},
   theme: {
      backgroundColor: theme.palette.background.default, color: theme.palette.text.primary
   }, useDark: {
      backgroundColor: '#393d46'
   },
   desktopBar: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
         display: 'flex',
      },
   },
   mobileBar: {
      display: 'flex',
      [theme.breakpoints.up('sm')]: {
         display: 'none',
      },
   },
}));

const prins = createMuiTheme({
   typography:{
      h2: {
         fontSize: '3.75rem',
         fontWeight: 300,
         lineHeight: 1.2,
         letterSpacing: '-0.00833em',
         fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
         '@media (min-width:600px)': {
            fontSize: '3.75rem',
         },
         '@media (min-width:0px)': {
         fontSize: '3.25rem',
         },
      },
      h4: {
         fontSize: '2.15rem',
         fontWeight: 400,
         lineHeight: 1.235,
         letterSpacing: '0.00735em',
         fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
         '@media (min-width:600px)': {
            fontSize: '2.15rem',
            },
            '@media (min-width:0px)': {
            fontSize: '1.75rem',
         },
      },
   },
   palette: {
      primary: { main: green[500] },
      secondary: { main: orange[400] },
      textPrimary: { main: '#FFF' },
   },
});
const dark = createMuiTheme({
   typography:{
      h2: {
         fontSize: '3.75rem',
         fontWeight: 300,
         lineHeight: 1.2,
         letterSpacing: '-0.00833em',
         fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
         '@media (min-width:600px)': {
            fontSize: '3.75rem',
         },
         '@media (min-width:0px)': {
         fontSize: '3.25rem',
         },
      },
      h4: {
         fontSize: '2.15rem',
         fontWeight: 400,
         lineHeight: 1.235,
         letterSpacing: '0.00735em',
         fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
         '@media (min-width:600px)': {
            fontSize: '2.15rem',
            },
         '@media (min-width:0px)': {
            fontSize: '1.75rem',
         },
      },
   },
   palette: {
      primary: { main: '#424242' },
      secondary: { main: '#252525' },
      primaryText: { main: '#FFF' },
      bg: { main: '#393d46' },
   },
});
 

/**
 * Checks if the token inside the local storage is valid 
 * and if it is retrieves the user
 * @param {function} cb callback function
 */
const useFetchUser = (cb) => {
   const didMount = React.useRef(false);

   React.useEffect(() => {
      if (!didMount.current) {
         cb();
         didMount.current = true;
      }
   });
}


const App = () => {

   const classes = useStyles();

   const { state, dispatch } = useContext(saduwux);

   /** Verificacion de token on init */
   useFetchUser(() => {
      const token = localStorage.getItem('token');
      if (token) {
         dispatch({ type: 'update', payload: { logStatus: 1 } })
         fetch(`/api/users/token`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': localStorage.getItem('token')
            },
         }).then(
            handleFetch
         ).then(
            res => dispatch({ type: 'login', payload: { user: res } })
         ).catch(
            () => {
               console.log('redirect')
               localStorage.clear();
               dispatch({ type: 'update', payload: { logStatus: 0 } });
            }
         )
      }
      else {
         dispatch({ type: 'update', payload: { logStatus: 0 } })
         localStorage.clear();
      }
      // if (serverIp === "localhost") {
      //    fetch(`/api/dir`)
      //       .then(res => res.json())
      //       .then(data => {
      //          updateServerIp(data.IP);
      //       }).catch(e => console.log('Eoor'))
      // }
   }); //Use Effect

   // const loadUser = (data) => {
   //    if (data) {
   //       updateUser({
   //          id: parseInt(data.id),
   //          nombre: data.nombre,
   //          nivel: data.nivel,
   //          desde: data.desde,
   //          usuario: data.usuario
   //       });
   //    }
   // };//Load user
   // const loadFiles = (id) => {
   //    console.log(`/api/allFiles/${id}?user=${user.nivel}`);
   //    fetch(`/api/allFiles/${id}?user=${user.nivel}`)
   //       .then(res => { return res.json(); })
   //       .then(data => {
   //          sort(data);
   //          updateFiles(data);
   //       })
   //       .catch(e => {
   //       });
   // }//Load Files

   /*----------------- OWN METHODS ---------------------*/
   // const sort = (arr) => {
   //    arr.sort(byName);
   //    arr.sort(byFileType);
   //    updateFiles(arr);
   // };//Sort
   // const byName = (a, b) => {
   //    var x = a.name.toLowerCase();
   //    var y = b.name.toLowerCase();
   //    return compare(x, y);
   // };//By name
   // const byFileType = (a, b) => {
   //    var x = a.ext.toLowerCase();
   //    var y = b.ext.toLowerCase();
   //    return compare(x, y);
   // };//ByFileType
   // const compare = (a, b) => {
   //    return (a < b ? -1 :
   //       a > b ? 1 : 0);
   // };//Compare
   /*----------------- OWN METHODS ---------------------*/

   /*---------------------- HANDLERS ----------------------*/

   /** MOVER A COMPONENTES */

   /** Search */
   // const contextMenu = (e) => {
   //    e.preventDefault();
   // };//ContextMenu
   // const handleClick = (id) => {
   //    updateCurrentFolder(id);
   //    loadFiles(id);
   // };//Handleclick
   const goHome = () => {
      console.log('Im goind home')
      // updateCurrentFolder(0);
      // loadFiles(0);
   };//GoHome

   /** Va hacia la carpeta contenedora de la carpeta actual - Files */
   const goBack = () => {
      console.log('Im goind back')
      // console.log(currentFolder)
      // if (currentFolder !== 0) {
      //    // fetch('http://localhost:6969/api/fileInfo/' + files[0].dependency)
      //    fetch(`/api/fileInfo/${files[0].dependency}`)
      //       .then(res => {
      //          return res.json();
      //       })
      //       .then(data => {
      //          loadFiles(data.dependency);
      //          updateCurrentFolder(data.dependency);
      //       })
      //       .catch(e => {
      //          console.log("Something went wrong");
      //          console.log(e);
      //       });
      // }
   };//Go Back

   // const changeRep = (id) => {
   //    updateReproductor(id);
   // };//changeRep

   /** Filtra archivos - Files */
   // const onSearchFileChange = (event) => {
   //    updateSearchFile(event.target.value);
   // }

   /** Filtra usuarios en la pagina de admin - Provider */
   // const onSearchUserChange = (event) => {
   //    updateSearchUser(event.target.value);
   // }

   /** Logs out - Sidebar*/


   // const modifyBar = (show) => {
   //    /** True || false */
   //    updateShowBar(show);
   // };//ModifyBar

   /** Cambia si busca usuarios o archivos - Provider*/
   // const modifySearch = (show) => {
   //    updateSearchBar(show);
   // };//ModifySearch

   /** Cambia el tema - Profile*/
   // const updateSwitch = event => {
   //    updateTheme(event.target.checked);
   // };
   /** MOVER A COMPONENTES */


   /** Oculta o mustra la barra de busqueda */

   /*---------------------- HANDLERS ----------------------*/

   const switchView = () => {
      return (
         <div className={`${state.theme ? classes.useDark : ''} min-h100 flex-column`}>
            <Route path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]} component={TopBar} />
            <div className={classes.main} >
               <div className={classes.desktopBar}> <Route  path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]} component={Sidebar} /> </div>
               <Switch>
                  <Route exact path="/" component={Welcome} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/recover" component={Recover} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/reproductor" render={() => <div></div>} />
                  <Route exact path="/notlogged" component={RequireLogin} />
                  <Route exact path="/busqueda" component={Search} />
                  <Route exact path="/perfil" component={Profile} />
                  <Route exact path="/configuracion" component={ProfileSettings} />
                  {/*<Route path="/admin" component={Admin} />*/}
                  <Route component={NotFound} />
               </Switch>
               <Route path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]} component={Reproductor} />
            </div>
         <div className={classes.mobileBar}>  <Route  path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]} component={Bottombar} /> </div>
         </div>
      )
   }

   if (state.logStatus === 1) {
      const tempStyle = {
         minHeight: '100vh'
         , minWidth: '100%'
         , display: 'flex'
         , justifyContent: 'center'
         , alignItems: 'center'
      };
      return (
         <div style={tempStyle}>
            <CircularProgress size={100} thickness={5} />
         </div>
      );
   } else
      return (
         <ThemeProvider theme={!state.theme ? prins : dark}>
            <BrowserRouter basename='/'>
               {switchView()}
            </BrowserRouter>
         </ThemeProvider>
      );
}

export default App;
