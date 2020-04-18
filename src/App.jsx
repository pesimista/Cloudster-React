import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
// import Admin from './components/Admin/Admin';
import Err from './components/Err/Err';
import RequireLogin from './components/Err/RequireLogin';
import Search from './components/Files/Search';
import Login from './components/Login/Login';
import Recover from './components/Login/Recover';
import Profile from './components/Profile/Profile';
import ProfileSettings from './components/Profile/ProfileSettings';
import Register from './components/Register/Register';
import Reproductor from './components/Reproductor/Reproductor';
import { saduwux } from './components/SF/Context';
import { handleFetch } from './components/SF/helpers';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import Welcome from './components/Welcome/Welcome';

const useStyles = makeStyles(theme => ({
   root: {
      display: 'flex',
   }, theme: {
      backgroundColor: theme.palette.background.default, color: theme.palette.text.primary,
   }, toolbar: theme.mixins.toolbar, useDark: {
      display: 'flex', backgroundColor: '#393d46'
   }
}));

const prins = createMuiTheme({
   palette: {
      primary: { main: green[400], dark: '#424242' },
      secondary: { main: orange[400], dark: '#252525' },
      textPrimary: { main: '#FFF' },
      bg: { main: orange[50] },
   },
});
const dark = createMuiTheme({
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
         <div className={!state.theme ? classes.root : classes.useDark}>
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} component={Sidebar} />
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} component={TopBar} />
            <Switch>
               <Route exact path="/" component={Welcome} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/recover" component={Recover} />
               <Route exact path="/register" component={Register} />
               <Route exact path="/reproductor" component={Reproductor} />
               <Route exact path="/notlogged" component={RequireLogin} />
               <Route exact path="/busqueda"
                  render={() => (
                     <Search
                        goBack={goBack}
                        goHome={goHome}
                     />
                  )}
               />
               <Route exact path="/perfil" component={Profile} />
               <Route exact path="/configuracion" component={ProfileSettings} />

               {/* <Route exact path="/admin"
                  render={(props) => (
                     <Admin
                        useTheme={useTheme}
                        userId={user.id}
                        modifySearch={modifySearch}
                        getIcon={getIcon}
                        searchFileField={searchFileField}
                        searchUserField={searchUserField}
                     />
                  )}
               /> */}
               <Route component={Err} />
            </Switch>
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
