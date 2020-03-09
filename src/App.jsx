import React from 'react';
import { Switch, BrowserRouter, Route } from "react-router-dom";
import './App.css';
import Welcome from './components/Welcome/Welcome';
import Reproductor from './components/Reproductor/Reproductor';
import Search from './components/Files/Search';
import Login from './components/Login/Login';
import Recover from './components/Login/Recover';
import Register from './components/Register/Register';
import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import Profile from './components/Profile/Profile';
import ProfileSettings from './components/Profile/ProfileSettings';
import Err from './components/Err/Err';
import RequireLogin from './components/Err/RequireLogin';
import Admin from './components/Admin/Admin';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';

//SVG
import folder from './components/svg/folder.svg';
import pdf from './components/svg/Papirus-Team-Papirus-pdf.svg';
import html from './components/svg/Papirus-Team-Papirus-html.svg';
import audio from './components/svg/Papirus-Team-Papirus-audio.svg';
import json from './components/svg/Papirus-Team-Papirus-json.svg';
import compress from './components/svg/Papirus-Team-Papirus-compress.svg';
import iso from './components/svg/Papirus-Team-Papirus-iso.svg';
import video from './components/svg/Papirus-Team-Papirus-video.svg';
import zerosize from './components/svg/Papirus-Team-Papirus-zerosize.svg';
import Mimetypes from './components/svg/Papirus-Team-Papirus-Mimetypes-X-office-document.svg';
import pic from './components/svg/Papirus-Team-Papirus-ImageGeneric.svg';
//SVG

const useStyles = makeStyles(theme => ({
   root: {
      display: 'flex',
   },
   theme: {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
   },
   toolbar: theme.mixins.toolbar,
   useDark: {
      display: 'flex',
      backgroundColor: '#393d46'
   },
}));

// const {Provider, Consumer} = React.createContext(defaultValue);

const App = (props) => {

   const classes = useStyles();
   const initialUser = {
      id: 0,
      nombre: "",
      nivel: 1,
      desde: "",
      usuario: ""
   };
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

   const prins = createMuiTheme({
      palette: {
         primary: {
            main: green[400],
            dark: '#424242'
         },
         secondary: {
            main: orange[400],
            dark: '#252525'
         },
         textPrimary: {
            main: '#FFF'
         },
         bg: {
            main: orange[50],
         },
      },
   });
   const dark = createMuiTheme({
      palette: {
         primary: {
            main: '#424242',
         },
         secondary: {
            main: '#252525',
         },
         primaryText: {
            main: '#FFF',
         },
         bg: {
            main: '#393d46',
         },
      },
   });

   React.useEffect(() => {
      const localUser = localStorage.getItem('user');
      if (localUser !== null && JSON.stringify(user) === JSON.stringify(initialUser)) {
         loadUser(JSON.parse(localUser));
         loadFiles(currentFolder);
      }
      else return;

      if (serverIp === "localhost") {
         fetch(`/api/dir`)
            .then(res => res.json())
            .then(data => {
               updateServerIp(data.IP);
            }).catch(e => console.log('Eoor'))
      }
   }, []); //Use Effect

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
   }//Sort
   const byName = (a, b) => {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      return compare(x, y);
   }//By name
   const byFileType = (a, b) => {
      var x = a.ext.toLowerCase();
      var y = b.ext.toLowerCase();
      return compare(x, y);
   }//ByFileType
   const compare = (a, b) => {
      return (a < b ? -1 :
         a > b ? 1 : 0);
   }//Compare
   /*----------------- OWN METHODS ---------------------*/
   /*---------------------- HANDLERS ----------------------*/
   const contextMenu = (e) => {
      e.preventDefault();
   }//ContextMenu
   const handleClick = (id) => {
      updateCurrentFolder(id);
      loadFiles(id);
   }//Handleclick
   const goHome = () => {
      updateCurrentFolder(0);
      loadFiles(0);
   }//GoHome
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
   }//Go Back
   const changeRep = (id) => {
      updateReproductor(id);
   }//changeRep
   const onSearchFileChange = (event) => { /* Changes what files are shown */
      updateSearchFile(event.target.value);
   }
   const onSearchUserChange = (event) => { /* Changes what files are shown */
      updateSearchUser(event.target.value);
   }
   const signout = () => {
      localStorage.removeItem('user');
      updateUser(initialUser);
      updateCurrentFolder(0);
      updateShowBar('');
   }//signout
   const modifyBar = (show) => {
      updateShowBar(show);
   }//ModifyBar
   const modifySearch = (show) => {
      updateSearchBar(show);
   }//ModifySearch
   const updateSwitch = event => {
      updateTheme(event.target.checked);
   };
   const getIcon = (isFile, ext) => {
      return (
         !isFile ? folder :
            ext === 'jpg' || ext === 'png' ? pic :
            ext === 'mp3' || ext === 'wav' ? audio :
            ext === 'mp4' || ext === 'mkv' ? video :
            ext === 'rar' || ext === 'zip' ? compress :
            ext === 'json' || ext === 'js' ? json :
            ext === 'iso' ? iso :
            ext === 'json' ? json :
            ext === 'pdf' ? pdf :
            ext === 'txt' ? Mimetypes :
            ext === 'html' ? html : zerosize
      );
   }//GetIcon
   /*---------------------- HANDLERS ----------------------*/

   const switchView = () => {
      const filteredFiles = (files) ? files.filter(f => {
         return f.name.toLowerCase().includes(searchFileField.toLowerCase())
      }) : [];
      return (
         <div className={!useTheme ? classes.root : classes.useDark}>
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} render={(props) => (
               <Sidebar
                  useTheme={useTheme}
                  userLvl={user.nivel}
                  signout={signout}
                  modifyBar={modifyBar}
                  modifySearch={modifySearch}
               />
            )}
            />
            <Route path={["/Perfil", "/Configuracion", "/Busqueda", "/transfers", "/reproductor", "/Admin"]} render={(props) => (
               <TopBar
                  name={user.usuario}
                  onSearchFileChange={onSearchFileChange}
                  onSearchUserChange={onSearchUserChange}
                  showBar={showBar}
                  showSearch={showSearch}
                  useTheme={useTheme}
                  updateSwitch={updateSwitch}
               />
            )}
            />
            <Switch>
               <Route exact path="/" component={Welcome} />
               <Route exact path="/login"
                  render={(props) => (
                     <Login />
                  )}
               />
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
               <Route exact path="/Perfil"
                  render={(props) => (
                     <Profile
                        user={user}
                     />
                  )}
               />
               <Route exact path="/Configuracion"
                  render={(props) => (
                     <ProfileSettings
                     />
                  )}
               />
               <Route exact path="/Reproductor"
                  render={(props) => (
                     <Reproductor
                        serverIp={serverIp}
                        idReproductor={idReproductor}
                     />
                  )}
               />
               <Route exact path="/notlogged"
                  render={(props) => (
                     <RequireLogin
                     />
                  )}
               />
               <Route exact path="/Admin"
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
