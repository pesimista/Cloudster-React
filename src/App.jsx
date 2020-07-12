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
// import Bottombar from './components/Sidebar/Bottombar';
import TopBar from './components/TopBar/TopBar';
import Welcome from './components/Welcome/Welcome';
import NotFound from './components/Err/NotFound';
import Admin from './components/Admin/Admin';

/** Auxiliares */
import { saduwux } from './components/SF/Context';
import { handleFetch } from './components/SF/helpers';
import ProtectedRoute from './components/SF/ProtectedRoute';

const useStyles = makeStyles(theme => ({
  toolbar: theme.mixins.toolbar,
  // main: { display: 'flex', minWidth: '100%', flexGrow: 1, position: 'relaive' },
  theme: {
    backgroundColor: theme.palette.background.default, color: theme.palette.text.primary
  }, useDark: {
    backgroundColor: '#393d46'
  }
}));

const prins = createMuiTheme({
  typography: {
    h2: {
      fontSize: '3.75rem',
      fontWeight: 300,
      lineHeight: 1.2,
      letterSpacing: '-0.00833em',
      fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
      '@media (min-width:600px)': {
        fontSize: '3.75rem'
      },
      '@media (min-width:0px)': {
        fontSize: '3.25rem'
      },
    },
    h4: {
      fontSize: '2.15rem',
      fontWeight: 400,
      lineHeight: 1.235,
      letterSpacing: '0.00735em',
      fontFamily: ["Roboto", "Helvetica", "Arial", 'sans-serif'],
      '@media (min-width:600px)': {
        fontSize: '2.15rem'
      },
      '@media (min-width:0px)': {
        fontSize: '1.75rem'
      },
    },
  },
  palette: {
    primary: { main: green[500] },
    secondary: { main: orange[400] },
    textPrimary: { main: '#FFF' }
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

  const dark = createMuiTheme({
    typography: {
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
      type: "dark",
      primary: { main: '#424242' },
      secondary: { main: '#252525' },
      primaryText: { main: '#FFF' },
    },
  });

  /** Verificacion de token on init */
  useFetchUser(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      dispatch({ type: 'update', payload: { logStatus: 0 } })
      localStorage.clear();
      return;
    }

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
    ).catch(() => {
      localStorage.clear();
      dispatch({ type: 'update', payload: { logStatus: 0 } });
    });
  }); //Use Effect
  /*---------------------- HANDLERS ----------------------*/

  const switchView = () => {
    return (
      <div className={`container ${state.theme ? classes.useDark : ''} min-h100`}>
        <Route
          component={TopBar}
          path={[
            "/perfil",
            "/configuracion",
            "/busqueda",
            "/transfers",
            "/reproductor",
            "/admin"
          ]}
        />
        <Route
          component={Sidebar}
          path={[
            "/perfil",
            "/configuracion",
            "/busqueda",
            "/transfers",
            "/reproductor",
            "/admin"
          ]}
        />
        <Switch>
          <Route exact path="/" component={Welcome} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/recover" component={Recover} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/notlogged" component={RequireLogin} />
          <ProtectedRoute exact path="/reproductor" render={() => <div></div>} />
          <ProtectedRoute exact path="/busqueda" component={Search} />
          <ProtectedRoute exact path="/perfil" component={Profile} />
          <ProtectedRoute exact path="/configuracion" component={ProfileSettings} />
          <ProtectedRoute requireAdmin path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
        <ProtectedRoute
          path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]}
          component={Reproductor}
        />
      </div>
    )
  }
  // <div className={classes.mobileBar}>
  //   <Route path={["/perfil", "/configuracion", "/busqueda", "/transfers", "/reproductor", "/admin"]} component={Bottombar} />
  // </div>

  if (state.logStatus === 1) {
    const tempStyle = () => ({
      minHeight: '100%',
      minWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    });
    return (
      <div style={tempStyle()}>
        <CircularProgress size={100} thickness={5} />
      </div>
    );
  } else {
    return (
      <ThemeProvider theme={!state.theme ? prins : dark}>
        <BrowserRouter basename='/'>
          {switchView()}
        </BrowserRouter>
      </ThemeProvider>
    );
  }
}

export default App;
