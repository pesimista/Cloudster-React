import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import './App.css';
import Admin from './components/Admin/Admin';
import Err from './components/Err/Err';
import RequireLogin from './components/Err/RequireLogin';
import Search from './components/Files/Search';
import Login from './components/Login/Login';
import Recover from './components/Login/Recover';
import Profile from './components/Profile/Profile';
import ProfileSettings from './components/Profile/ProfileSettings';
import Register from './components/Register/Register';
import Reproductor from './components/Reproductor/Reproductor';
import { sadux } from './components/SF/Context';
import { handleFetch, history } from './components/SF/helpers';
import Sidebar from './components/Sidebar/Sidebar';
//SVG
import folder from './components/svg/folder.svg';
import audio from './components/svg/Papirus-Team-Papirus-audio.svg';
import compress from './components/svg/Papirus-Team-Papirus-compress.svg';
import html from './components/svg/Papirus-Team-Papirus-html.svg';
import pic from './components/svg/Papirus-Team-Papirus-ImageGeneric.svg';
import iso from './components/svg/Papirus-Team-Papirus-iso.svg';
import json from './components/svg/Papirus-Team-Papirus-json.svg';
import Mimetypes from './components/svg/Papirus-Team-Papirus-Mimetypes-X-office-document.svg';
import pdf from './components/svg/Papirus-Team-Papirus-pdf.svg';
import video from './components/svg/Papirus-Team-Papirus-video.svg';
import zerosize from './components/svg/Papirus-Team-Papirus-zerosize.svg';
//SVG
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

const initialUser = {
   id: 0,
   nombre: "",
   nivel: 1,
   desde: "",
   usuario: ""
};

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


const App = (props) => {

   const classes = useStyles();

   const { state: globalState, dispatch } = useContext(sadux);

   const [user, updateUser] = React.useState(initialUser);
   const [currentFolder, updateCurrentFolder] = React.useState(0);
   const [serverIp, updateServerIp] = React.useState('localhost');
   const [files, updateFiles] = React.useState();
   const [idReproductor, updateReproductor] = React.useState();
   const [showBar, updateShowBar] = React.useState(1);
   const [showSearch, updateSearchBar] = React.useState(0);
   const [searchFileField, updateSearchFile] = React.useState('');
   const [searchUserField, updateSearchUser] = React.useState('');
   const [useTheme, updateTheme] = React.useState(false);

   /** Verificacion de token on init */
   useFetchUser(() => {
      const token = localStorage.getItem('token');
      if (token) {

         fetch(`http://localhost:1234/api/users/token`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': localStorage.getItem('token')
            },
         }).then(
            handleFetch
         ).then(
            res => dispatch({ type: 'update', payload: { user: res } })
         ).catch(
            mistake => {
               localStorage.clear();
               history.push('/');
            }
         )
      }
      else {
         localStorage.clear();
         history.push('/');
      };
      // if (serverIp === "localhost") {
      //    fetch(`/api/dir`)
      //       .then(res => res.json())
      //       .then(data => {
      //          updateServerIp(data.IP);
      //       }).catch(e => console.log('Eoor'))
      // }
   }); //Use Effect

   const loadUser = (data) => {
      if (data) {
         updateUser({
            id: parseInt(data.id),
            nombre: data.nombre,
            nivel: data.nivel,
            desde: data.desde,
            usuario: data.usuario
         });
      }
   }//Load user
   const loadFiles = (id) => {
      console.log(`/api/allFiles/${id}?user=${user.nivel}`);
      fetch(`/api/allFiles/${id}?user=${user.nivel}`)
         .then(res => { return res.json(); })
         .then(data => {
            sort(data);
            updateFiles(data);
         })
         .catch(e => {
         });
   }//Load Files

   /*----------------- OWN METHODS ---------------------*/
   const sort = (arr) => {
      arr.sort(byName);
      arr.sort(byFileType);
      updateFiles(arr);
   };//Sort
   const byName = (a, b) => {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return compare(x, y);
   };//By name
   const byFileType = (a, b) => {
      var x = a.ext.toLowerCase();
      var y = b.ext.toLowerCase();
      return compare(x, y);
   };//ByFileType
   const compare = (a, b) => {
      return (a < b ? -1 :
         a > b ? 1 : 0);
   };//Compare
   /*----------------- OWN METHODS ---------------------*/

   /*---------------------- HANDLERS ----------------------*/

   /** MOVER A COMPONENTES */

   /** Search */
   const contextMenu = (e) => {
      e.preventDefault();
   };//ContextMenu
   const handleClick = (id) => {
      updateCurrentFolder(id);
      loadFiles(id);
   };//Handleclick
   const goHome = () => {
      updateCurrentFolder(0);
      loadFiles(0);
   };//GoHome

   /** Va hacia la carpeta contenedora de la carpeta actual - Files */
   const goBack = () => {
      console.log(currentFolder)
      if (currentFolder !== 0) {
         // fetch('http://localhost:6969/api/fileInfo/' + files[0].dependency)
         fetch(`/api/fileInfo/${files[0].dependency}`)
            .then(res => {
               return res.json();
            })
            .then(data => {
               loadFiles(data.dependency);
               updateCurrentFolder(data.dependency);
            })
            .catch(e => {
               console.log("Something went wrong");
               console.log(e);
            });
      }
   };//Go Back

   const changeRep = (id) => {
      updateReproductor(id);
   };//changeRep

   /** Filtra archivos - Files */
   const onSearchFileChange = (event) => {
      updateSearchFile(event.target.value);
   }

   /** Filtra usuarios en la pagina de admin - Provider */
   const onSearchUserChange = (event) => {
      updateSearchUser(event.target.value);
   }

   /** Logs out - Sidebar*/


   const modifyBar = (show) => {
      /** True || false */
      updateShowBar(show);
   };//ModifyBar

   /** Cambia si busca usuarios o archivos - Provider*/
   const modifySearch = (show) => {
      updateSearchBar(show);
   };//ModifySearch

   /** Cambia el tema - Profile*/
   const updateSwitch = event => {
      updateTheme(event.target.checked);
   };
   /** MOVER A COMPONENTES */


   /** Oculta o mustra la barra de busqueda */


   const getIcon = (isFile, ext) => {
      if (!isFile)
         return folder;
      switch (ext) {
         case 'jpg':
         case 'png':
            return pic;
         case 'mp3':
         case 'wav':
            return audio;
         case 'mp4':
         case 'mkv':
            return video;
         case 'rar':
         case 'zip':
            return compress;
         case 'json':
         case 'js':
            return json;
         case 'iso':
            return iso;
         case 'pdf':
            return pdf;
         case 'txt':
            return Mimetypes;
         case 'html':
            return html;
         default:
            return zerosize;
      }
   }//GetIcon
   /*---------------------- HANDLERS ----------------------*/

   const switchView = () => {
      const filteredFiles = (files) ? files.filter(f => {
         return f.name.toLowerCase().includes(searchFileField.toLowerCase())
      }) : [];
      return (
         <div className={!useTheme ? classes.root : classes.useDark}>
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} component={Sidebar} />
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} component={TopBar} />
            <Switch>
               <Route exact path="/" component={Welcome} />
               <Route exact path="/login" component={Login} />
               <Route exact path="/recover" component={Recover} />
               <Route exact path="/register" component={Register} />
               <Route exact path="/busqueda"
                  render={(props) => (
                     <Search
                        useTheme={useTheme}
                        serverIp={serverIp}
                        changeRep={changeRep}
                        ip={serverIp}
                        getIcon={getIcon}
                        contextMenu={contextMenu}
                        files={filteredFiles}
                        loadUser={loadUser}
                        goBack={goBack}
                        goHome={goHome}
                        handleClick={handleClick}
                     />
                  )}
               />
               <Route exact path="/perfil" component={Profile} />
               <Route exact path="/configuracion"
                  render={(props) => (
                     <ProfileSettings
                     />
                  )}
               />
               <Route exact path="/reproductor"
                  render={(props) => (
                     <Reproductor
                        serverIp={serverIp}
                        idReproductor={idReproductor}
                     />
                  )}
               />
               <Route exact path="/notlogged" component={RequireLogin} />
               <Route exact path="/admin"
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
               />
               <Route component={Err} />
            </Switch>
         </div>
      )
   }

   return (
      <ThemeProvider theme={!useTheme ? prins : dark}>
         <BrowserRouter basename='/'>
            {switchView()}
         </BrowserRouter>
      </ThemeProvider>
   );
}

export default App;
