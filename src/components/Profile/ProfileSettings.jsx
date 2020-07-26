import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert from '@material-ui/lab/Alert';
import EnhancedEncryptionIcon from '@material-ui/icons/EnhancedEncryption';
import PropTypes from 'prop-types';
import React from 'react';
import ChangePasswordDialog from '../Admin/Users/ChangePasswordDialog';
import { saduwux } from '../SF/Context';
import { handleFetch } from '../SF/helpers';

const useStyles = makeStyles((theme) => ({
  main: {
    width: '100%',
    display: 'flex',
    alignItems:' center',
    justifyContent: 'center',
    '& form':{
      padding: 20,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      '& .buttons-container': {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 10
      },
    },
    '& .MuiFormControl-root':{
      margin: '0.5rem 0',
    },
    [theme.breakpoints.down('xs')]: {
      alignItems: 'flex-start',
      height: '100%',
      overflow: 'auto',
      '& .MuiContainer-root': {
        display: 'none',
      }
    },
  },
  darkFocused: {
    '& .Mui-focused':{
      color: 'rgb(255, 255, 255)'
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
      borderColor: 'rgba(255, 255, 255, 0.7)',
    },
  },
  root: {
    '& .MuiTab-wrapper': {
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    flexGrow: 1,
    height: 400,
    display: 'flex',
    
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  sectionMobile: {
    display: 'block',
    marginTop: '1rem',
    maxWidth: 'calc(100vw - 2rem)',
    width: 'calc(100vw - 2rem)',
    height: 400,
    '& .MuiAccordionDetails-root': {
      minHeight: 250,
      '& #vertical-tabpanel-1': {
        width: '100%',
        '& > *': {
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }
      },
      '& #vertical-tabpanel-2': {
        width: '100%',
        maxWidth: '100%',
      }
    },
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },

}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const pattern = {
  nombre: new RegExp(`^[A-Z'\\s]*$`, 'i'),
  apellido: new RegExp(`^[A-Z'\\s]*$`, 'i'),
  respuesta1: new RegExp(`^[A-Z'0-9\\s]*$`, 'i'),
  respuesta2: new RegExp(`^[A-Z'0-9\\s]*$`, 'i')
}

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
    '&$expanded': {
      margin: 'auto',
    },
  },
  expanded: {},
})(Accordion);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0, 0, 0, .03)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(AccordionSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(AccordionDetails);

const questions = [
  { id: '1', pregunta: '¿Cuál es el nombre de tu mejor amigo?' },
  { id: '2', pregunta: '¿Cuál es la ciudad donde naciste?' },
  { id: '3', pregunta: '¿Cómo se llamaba tu primera mascota?' },
  { id: '4', pregunta: '¿Cuál es tu color favorito?' },
  { id: '5', pregunta: '¿Cuál es el segundo nombre de tu madre?' },
];

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={!other & (value !== index)}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const initialState = {
  open: false,
  value: 0,
  message: '',
  nombre: '',
  apellido: '',
  changePassword: false,
  pregunta1: 1,
  pregunta2: 2,
  respuesta1: '',
  respuesta2: '',
  isLoading: false
};

const userReducer = (state, payload) => {
  return { ...state, ...payload };
};

const ProfileSettings = () => {
  const classes = useStyles();
  /**@type {context} */
  const { state: { user, theme }, dispatch } = React.useContext(saduwux);

  const [state, update] = React.useReducer(userReducer, {
    ...initialState,
    pregunta1: user.pregunta1,
    pregunta2: user.pregunta2,
  });

  const tapProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  };

  const getPartialInfo = (tab) => {
    switch (tab) {
      case 0: {
        return JSON.stringify({
          nombre: state.nombre,
          apellido: state.apellido,
        });
      }
      case 2: {
        return JSON.stringify({
          pregunta1: state.pregunta1,
          pregunta2: state.pregunta2,
          respuesta1: state.respuesta1,
          respuesta2: state.respuesta2,
        });
      }

      default: {
        return '';
      }
    }
  };

  const invalid = () => {
    switch(state.value) {
      case 2: {
        const { pregunta1, pregunta2, respuesta1, respuesta2 } = state;
        return respuesta1.trim().length < 3
          || respuesta2.trim().length < 3
          || pregunta1 === pregunta2;
      }
      case 0: {
        return state.nombre.trim().length < 2 || state.apellido.trim().length < 2;
      }
      default: return true;
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    if (invalid() || state.value === 1) {
      // alert('Marico las contraseñas no coinciden');
      return;
    }
    update({isLoading: true});
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: getPartialInfo(state.value)
    };
    fetch(`/api/users/${user.id}`, headers)
      .then(handleFetch)
      .then((res) => {
        localStorage.setItem('token', 'bearer ' + res.token);
        dispatch({
          type: 'update',
          payload: {
            user: res.user
          }
        });
        update({
          ...initialState,
          value: state.value,
          pregunta1: res.user.pregunta1,
          pregunta2: res.user.pregunta2,
          open: true,
          isLoading: false,
          severity: 'success',
          message: 'Cambios guardados satisfactoriamente!',
        });
      })
      .catch((mistake) => {
        update({
          open: true,
          message: mistake.message,
          severity: 'success',
          isLoading: false
        });
      });
  };

  const handleChange = (event) => {
    const {target} = event;
    if(!pattern[target.name] || target.value.trim().match(pattern[target.name])) {
      update({[target.name] : target.value})
    }
  }
  const handleChangePassword = (data)  => {
    if (!data) {
      update({ changePassword: null });
      return;
    }
    update({ isLoading: true, changePassword: null });
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ password: data.password }),
    };

    fetch(`/api/users/${data.userID}`, headers)
      .then(handleFetch)
      .then(() => {
        update({
          isLoading: false,
          open: true,
          message: 'Contraseña cambiada',
          severity: 'success'
        });
      })
      .catch((err) => {
        update({
          isLoading: false,
          open: true,
          message: err.message,
          severity: 'error'
        });
      });
  };
  const setChangePassword = ()  => {
    update({ changePassword:  user})
  }

  const mapPreguntas = questions.map((P, index) => {
    return (
      <MenuItem key={index} value={P.id}>
        {' '}
        {P.pregunta}{' '}
      </MenuItem>
    );
  });

  const handleTapChange = (event, value) => {
    update({ value })
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    update({ open: false });
  };

  const getTap = (index) => {
    switch(index) {
      case 2: {
        return (
          <Grid container>
            <Grid item xs={12}>
              <TextField
                select
                onChange={handleChange}
                value={state.pregunta1}
                name="pregunta1"
                required
                label="Primera pregunta"
                variant="outlined"
                fullWidth
                margin="normal"
              >
                { mapPreguntas }
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={state.respuesta1}
                name="respuesta1"
                required
                label="Respuesta "
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                onChange={handleChange}
                value={state.pregunta2}
                name="pregunta2"
                required
                label="Segunda pregunta"
                variant="outlined"
                fullWidth
                margin="normal"
              >
                {mapPreguntas}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={handleChange}
                value={state.respuesta2}
                name="respuesta2"
                required
                label="Respuesta "
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        );
      }
      case 1: {
        return (
          <Grid
            container
            direction="row"
            align="center"
            justify="center"
          >
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={setChangePassword}
              startIcon={<EnhancedEncryptionIcon />}
            >
              Cambiar contraseña
            </Button>
          </Grid>
        );
      }
      default: {
        return (
          <Grid container>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleChange(e)}
                value={state.nombre}
                required
                name="nombre"
                label={`Nombre (${user.nombre})`}
                variant="outlined"
                fullWidth
                helperText="El nombre debe contener al menos 2 catacteres"
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                onChange={(e) => handleChange(e)}
                value={state.apellido}
                name="apellido"
                required
                label={`Apellido (${user.apellido})`}
                helperText="El apellido debe contener al menos 2 catacteres"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </Grid>
          </Grid>
        );
      }
    }
  }

  const content = (
    <React.Fragment>
      {[0,1,2].map(index => (
        <TabPanel key={`panel-${index}`} value={state.value} index={index}>
          {getTap(index)}
        </TabPanel>
      ))}
    </React.Fragment>
  );

  const getClasses = () =>{
    let className = classes.main;
    if (theme) className += ` ${classes.darkFocused}`;
    return className;
  }

  return (
    <Box
      component="main"
      className={getClasses()}
    >
      <Container maxWidth="md">
        <Paper className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="fullWidth"
            value={state.value}
            indicatorColor="primary"
            onChange={handleTapChange}
            aria-label="Configuracion de perfil"
            className={classes.tabs}
          >
            <Tab label="Perfil" {...tapProps(0)} />
            <Tab label="Contraseña" {...tapProps(1)} />
            <Tab label="Preguntas Secretas" {...tapProps(2)} />
          </Tabs>
          <form
            autoComplete="off"
            onSubmit={handleUpdate}
          >
            {content}
            {
              state.value !== 1 && (
                <Box className="buttons-container">
                  <Button
                    disabled={invalid()}
                    variant="contained"
                    color="primary"
                    type="submit"
                    className={classes.button}
                  >
                    {' '}
                    Guardar
                  </Button>
                </Box>
              )
            }
          </form>
        </Paper>
      </Container>
      
      <Box className={classes.sectionMobile}>
        <ExpansionPanel
          square
          id="panel2"
          expanded={!state.value}
          onChange={() => handleTapChange('', 0)}
        >
          <ExpansionPanelSummary 
            expandIcon={<ExpandMoreIcon />}
            id="p1d-header"
          >
            <Typography className={classes.heading}>
              Perfil
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form
              onSubmit={handleUpdate}
            >
              { getTap(0) }
              
              <Button
                disabled={state.nombre.length <= 1 && state.apellido.length <= 1}
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
              >
                {' '}
                Guardar
              </Button>
            
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel
          square
          id="panel2"
          expanded={state.value === 1}
          onChange={() => handleTapChange('', 1)}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            id="p2d-header"
          >
            <Typography className={classes.heading}>
              Contraseña
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            { getTap(1) }
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel
          square
          id="panel3"
          expanded={state.value === 2}
          onChange={() => handleTapChange('', 2)}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            id="p1d-header"
          >
            <Typography className={classes.heading}>
              Preguntas secretas
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <form
              onSubmit={handleUpdate}
            >
              { getTap(2) }
              <Button
                disabled={state.respuesta1.length < 2 && state.respuesta2.length < 2}
                variant="contained"
                color="primary"
                type="submit"
                className={classes.button}
              >
                {' '}
                Guardar
              </Button>
            </form>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Box>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={state.open}
        autoHideDuration={2000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={state.severity || "success"}>
          {state.message}
        </Alert>
      </Snackbar>
      <ChangePasswordDialog
        user={state.changePassword}
        handleClose={handleChangePassword}
      />
    </Box>
  );
};

export default ProfileSettings;

// <Box display={{ xs: 'block', sm: 'none' }}>
//   <Toolbar variant="dense" />
// </Box>