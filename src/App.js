import React, { Component } from 'react';
import { Switch, BrowserRouter, Route } from "react-router-dom";

/*----------------Components-------------------*/
import Welcome from './components/Welcome/Welcome';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Search from './components/Search/Search';
import TopBar from './components/TopBar/TopBar';
import Sidebar from './components/Sidebar/Sidebar';
import Profile from './components/Profile/Profile';
import ProfileSettings from './components/Profile/ProfileSettings';
import Reproductor from './components/Reproductor/Reproductor';
import Err from './components/Err/Err';
import PlsLog from './components/Err/plsLog';
import Admin from './components/Admin/Admin';
import Recover from './components/Login/Recover';
/*----------------Components-------------------*/


/*------------------ CSS ----------------------*/
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';
import './components/SF/CSS/font-awesome.min.css';
import './components/SF/CSS/style1.css';
/*------------------ CSS ----------------------*/

/*----------------- Media ---------------------*/
import folder from './components/SF/svg/folder.svg';
import pdf from './components/SF/svg/Papirus-Team-Papirus-pdf.svg';
import html from './components/SF/svg/Papirus-Team-Papirus-html.svg';
import audio from './components/SF/svg/Papirus-Team-Papirus-audio.svg';
import json from './components/SF/svg/Papirus-Team-Papirus-json.svg';
import compress from './components/SF/svg/Papirus-Team-Papirus-compress.svg';
import iso from './components/SF/svg/Papirus-Team-Papirus-iso.svg';
import video from './components/SF/svg/Papirus-Team-Papirus-video.svg';
import zerosize from './components/SF/svg/Papirus-Team-Papirus-zerosize.svg';
import Mimetypes from './components/SF/svg/Papirus-Team-Papirus-Mimetypes-X-office-document.svg';
import pic from './components/SF/svg/Papirus-Team-Papirus-ImageGeneric.svg';
/*----------------- Media ---------------------*/


class App extends Component {
  constructor() {    
    super();
    this.state = {
      buttons: [
      { id: 1, value: 'fa fa-folder', dir: 'search'},
      { id: 3, value: 'fa fa-play-circle', dir: 'reproductor'},
      { id: 4, value: 'fa fa-user', dir: 'profile'},
      { id: 5, value: 'fa fa-sign-out', dir: '/'},
      ],
      adminButton: {
        id: 6, value: 'fa fa-cogs', dir: 'adminconfig'
      },
      user: this.initialUser,
      files: [],
      currentFolder: 0,
      searchFileField: '',
      searchUserField: '',
      show: '',
      idRep: null,
      serverIp: 'localhost'
    }
    if(this.state.serverIp === "localhost")
    {
      fetch(`/api/dir`)
      .then(res => res.json())
      .then(data => {
        this.setState({serverIp: data.IP})
      })
    }
  }
  getUserIcon = (nivel) => 
  {
    return (
      nivel === 1 ? 'green-text text-lighten-1' :
      nivel === 2 ? 'light-blue-text' :
      nivel === 3 ? 'purple-text' :
      nivel === 4 ? 'yellow-text' :
      'orange-text'
    )
  }
  initialUser = {
      id: 0,
      nombre: "",
      nivel: 1,
      desde: "",
      usuario: ""
  }; 
  /*----------------- OWN METHODS ---------------------*/
  componentDidMount(){
    const localUser = localStorage.getItem('user');
    if(localUser !== null && JSON.stringify(this.state.user) === JSON.stringify(this.initialUser))
    {
      this.loadUser(JSON.parse(localUser));
      this.updateFiles(this.state.currentFolder);
    }
    else return;

    if( JSON.stringify(this.state.files) === JSON.stringify(this.initialFiles) )
    {
      this.updateFiles(this.state.currentFolder);
    }
    if(this.state.serverIp === "localhost")
    {
      fetch(`/api/dir`)
      .then(res => res.json())
      .then(data => {
        this.setState({serverIp: data.IP})
      }).catch(e => console.log('Eoor')) 
    }
  }
  loadUser = (data) => {
    if(data)
    {
      this.setState({
      user: {
        id: parseInt(data.id),
        nombre: data.nombre,
        nivel: data.nivel,
        desde: data.desde,
        usuario: data.usuario
      }});
    }      
  }
  updateFiles = (id) => 
  {
    console.log(`/api/allFiles/${id}?user=${this.state.user.nivel}`);
    // fetch(`/api/allFiles/${id}?user=${this.state.user.nivel}`)
    fetch(`/api/allFiles/${id}?user=${this.state.user.nivel}`)
    .then(res =>{return res.json();})
    .then(data => 
      {
        this.sort(data);
        this.setState({files: data}) ;
      })
    .catch(e => 
      {
      });
  }
  getIcon = (isFile, ext) =>
  {
    return (
      !isFile ? folder :
      ext==='jpg' ||  ext==='png' ? pic :
      ext==='mp3' ||  ext==='wav' ? audio :
      ext==='mp4' ||  ext==='mkv' ? video : 
      ext==='rar' ||  ext==='zip' ? compress : 
      ext==='json'||  ext==='js'  ? json :
      ext==='iso'  ? iso  : 
      ext==='json' ? json :
      ext==='pdf'  ? pdf  :
      ext==='txt'  ? Mimetypes  :
      ext==='html' ? html : zerosize
      );
  }
  getUserIcon = (nivel) => 
  {
    return (
      nivel === 1 ? 'green-text text-lighten-1' :
      nivel === 2 ? 'light-blue-text' :
      nivel === 3 ? 'brown-text' :
      nivel === 4 ? 'purple-text' :
      'orange-text'
    )
  }
  modifyBar = (show) => {
    this.setState({ show : show })
  }
  /*----------------- OWN METHODS ---------------------*/


  /*---------------------- HANDLERS ----------------------*/
  contextMenu = (e) => {
    e.preventDefault();
  };
  handleClick = (id) => {
    this.setState({ currentFolder: id });
    this.updateFiles(id);
  };
  goHome = () => {
    this.setState({ currentFolder: 0 });
    this.updateFiles(0);
  };
  goBack = () => {    
    console.log(this.state.currentFolder)
    if(this.state.currentFolder !== 0) 
    {
      const { files } = this.state;
      // fetch('http://localhost:6969/api/fileInfo/' + files[0].dependency)
      fetch(`/api/fileInfo/${files[0].dependency}`)
      .then(res =>{
        return res.json();
      })
      .then(data => 
      {
        this.updateFiles(data.dependency);
        this.setState({ currentFolder: data.dependency });
      })
      .catch(e => 
      {
        console.log("Something went wrong");
        console.log(e);
      });
    }
  }
  changeRep = (id) => {
    this.setState({ idRep: id })
  }
  signout = () => 
  {
    localStorage.removeItem('user');
    this.setState({
      user: this.initialUser,
      files: this.initialFiles,
      currentFolder: 0,
      show: ''
    });
  }
  onSearchFileChange = (event) => { /* Changes what files are shown */
    this.setState({ searchFileField: event.target.value });
  }
  onSearchUserChange = (event) => { /* Changes what files are shown */
    this.setState({ searchUserField: event.target.value });
  }
  /*---------------------- HANDLERS ----------------------*/
  

  /*---------------------- SWITCHVIEW ----------------------*/
  switchView = () => {   
    const { files, buttons, adminButton, user, searchFileField, searchUserField, idRep, show } = this.state;
    const filteredFiles = (files) ? files.filter(f => {
      return f.name.toLowerCase().includes(searchFileField.toLowerCase())
      }) : [];
    return(
      <BrowserRouter basename='/'>
        <div style={{height:'100%'}}>
          <Route path={["/profile","/profileSettings","/search","/transfers","/reproductor","/adminconfig"]} render={(props) => (
            <Sidebar 
            buttons={buttons} 
            adminButton={adminButton} 
            user={user} 
            signout={this.signout} 
            modifyBar={this.modifyBar}
            />
            )}
          />
          <Route path={["/profile","/profileSettings","/search","/transfers","/reproductor","/adminconfig"]} render={(props) => (
            <TopBar 
            user={user} 
            searchFileChange={this.onSearchFileChange} 
            searchUserChange={this.onSearchUserChange} 
            show={show}
            />
            )}
          />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route exact path="/login" 
              render={(props) => (
                <Login/>
                )}
            />
            <Route exact path="/recover" component={Recover}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/search" 
              render={(props) => (
              <div style={{marginLeft: '55px'}}>
                <Search 
                ip={this.state.serverIp}
                id={user.id} 
                files={filteredFiles} 
                loadUser={this.loadUser} 
                contextMenu={this.contextMenu} 
                handleClick={this.handleClick} 
                changeRep={this.changeRep}
                getIcon={this.getIcon} 
                goBack={this.goBack}
                goHome={this.goHome} 
                modifyBar={this.modifyBar}
                />
                </div>
              )}
            />
            <Route exact path="/profile" 
              render={(props) => (
                <Profile 
                user={user}
                modifyBar={this.modifyBar}
                />
                )}
            />
            <Route exact path="/profileSettings" 
              render={(props) => (
                <ProfileSettings 
                user={user}
                />
                )}
            />
            <Route exact path="/Reproductor"
              render={(props) => (
                <Reproductor 
                ip={this.state.serverIp}
                idRep={idRep}
                modifyBar={this.modifyBar}
                />
                )}
            />
            <Route exact path="/notlogged" component={PlsLog}/>
            <Route exact path="/adminconfig" 
              render={(props) => (
              <Admin
              user={user} 
              getUserIcon={this.getUserIcon} 
              id={user.id}
              files={filteredFiles}
              loadUser={this.loadUser}
              contextMenu={this.contextMenu}
              handleClick={this.handleClick}
              getIcon={this.getIcon}
              goBack={this.goBack}
              modifyBar={this.modifyBar}
              searchFileField={searchFileField} 
              searchUserField={searchUserField}
              />
              )}
            />
            <Route component={Err} />
          </Switch>
        </div>
      </BrowserRouter>
      
    )
  } 
  /*---------------------- SWITCHVIEW ----------------------*/


  /*---------------------- SORTING ----------------------*/
  sort(arr)
  {
    arr.sort(this.byName);
    arr.sort(this.byFileType);
    this.setState({files: arr});
  }
  compare = (a, b) => 
  {
    return (a<b?-1 :
            a>b? 1 : 0);
  }
  byName = (a, b) => 
  {
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    return this.compare(x, y);
  }
  byFileType = (a, b) => 
  {
    var x = a.ext.toLowerCase();
    var y = b.ext.toLowerCase();
    return this.compare(x, y);
  }
  /*---------------------- SORTING ----------------------*/
  
  render() {
    return (
      <BrowserRouter>
        <div style={{height: '100%'}}>          
          {this.switchView()}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
