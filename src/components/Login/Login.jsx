import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloudIcon from '@material-ui/icons/Cloud';
import MuiAlert from '@material-ui/lab/Alert';
import React, { useContext, useReducer } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import { handleFetch } from '../SF/helpers';

const useStyles = makeStyles((theme) => ({
  main: {
    gridColumnStart: '1',
    gridColumnEnd: '3',
    gridRowStart: '1',
    gridRowEnd: '3',
    display: 'flex',
    placeContent: 'center',
    alignItems: 'center',
    backgroundColor: 'cyan',
    maxWidth: 'auto',

    '& .MuiButtonBase-root': { padding: '0px' },

    '& button': {
      padding: '0.5rem 1rem',
      fontWeight: '600',

      '&.MuiButton-containedPrimary': {
        color: '#fff',
      },
      '&.Mui-disabled': {
        color: 'rgba(0, 0, 0, 0.26)',
      },
    },
  },
  box: {
    padding: '1rem 3rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    maxWidth: '400px',
  },
  form: {
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: '0.5rem !important',
  },
}));

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

/**
 * updates the state
 * @param {initialState} value The new value to assign to the state
 */
const initialState = {
  open: false,
  message: '',
  username: '',
  password: '',
  isLoading: false,
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

const Login = () => {
  const history = useHistory();
  const classes = useStyles();

  React.useEffect(() => localStorage.clear(), []);

  const [state, update] = useReducer(reducer, initialState);
  const { dispatch } = useContext(saduwux);

  const invalid = () => {
    const { username, password } = state;
    return !username.length || password.length < 6;
  };

  const handleLogin = () => {
    if (invalid()) {
      return;
    }

    const { username, password } = state;
    update({ isLoading: true });
    fetch('/api/users/login', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: username,
        password,
      }),
    })
      .then(handleFetch)
      .then((data) => {
        localStorage.setItem('token', 'bearer ' + data.token);
        dispatch({ type: 'login', payload: { user: data.user } });
        update({ open: true, message: 'Inicio de sesión exitoso!' });
        setTimeout(() => history.push('/busqueda'), 500);
      })
      .catch((error) => {
        update({ open: true, message: error.message, isLoading: false });
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    update({ open: false });
  };

  const handleInput = ({ target }) => {
    update({ [target.id]: target.value.trim() });
  };

  return (
    <Container component="main" className={classes.main}>
      <Box
        className={classes.box}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <Link to="/" component={reactLink}>
          <IconButton>
            <CloudIcon color="primary" style={{ fontSize: '4rem' }} />
          </IconButton>
        </Link>
        <Typography component="h1" variant="h5">
          Inicia Sesión
        </Typography>
        <Box className={classes.form} width={1}>
          <Divider />
          <TextField
            disabled={state.isLoading}
            margin="normal"
            required
            fullWidth
            autoFocus
            value={state.username}
            onChange={(e) => handleInput(e)}
            id="username"
            label="Nombre de usuario"
            variant="outlined"
          />
          <TextField
            disabled={state.isLoading}
            margin="normal"
            required
            fullWidth
            value={state.password}
            onChange={(e) => handleInput(e)}
            id="password"
            type="password"
            label="Contraseña"
            variant="outlined"
          />
          <Button
            disabled={state.isLoading || invalid()}
            className={classes.submit}
            fullWidth
            onClick={handleLogin}
            variant="contained"
            color="primary"
            size="large"
          >
            Iniciar Sesión
          </Button>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={state.open}
            onClose={handleClose}
            autoHideDuration={6000}
          >
            <Alert onClose={handleClose} severity="success">
              {state.message}
            </Alert>
          </Snackbar>
        </Box>
        <Grid container>
          <Grid item xs>
            <Link component={reactLink} to="/recover" color="secondary">
              Olvidé mi contraseña
            </Link>
          </Grid>
          <Grid item>
            <Link component={reactLink} to="/register">
              Registrarse
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Login;
