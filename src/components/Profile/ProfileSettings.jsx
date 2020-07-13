import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from '@material-ui/core/Paper';
import Snackbar from "@material-ui/core/Snackbar";
//import { makeStyles, Typography, Box, Tabs, Tab, Container, TextField, MenuItem, Button} from '@material-ui/core';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiAlert from '@material-ui/lab/Alert';
import PropTypes from "prop-types";
import React from "react";
import { Redirect } from "react-router-dom";
import { saduwux } from "../SF/Context";
import { handleFetch } from "../SF/helpers";

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiTab-wrapper": {
      justifyContent: "flex-start",
      flexDirection: "row"
    },
    flexGrow: 1,
    height: 400,
    display: "flex",
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  list: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  },
  sectionMobile: {
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
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
})(MuiExpansionPanel);

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
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const questions = [
  { id: "1", pregunta: "¿Cuál es el nombre de tu mejor amigo?" },
  { id: "2", pregunta: "¿Cuál es la ciudad donde naciste?" },
  { id: "3", pregunta: "¿Cómo se llamaba tu primera mascota?" },
  { id: "4", pregunta: "¿Cuál es tu color favorito?" },
  { id: "5", pregunta: "¿Cuál es el segundo nombre de tu madre?" }
];

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={!other & value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

const initialState = {
  open: false,
  value: 0,
  message: '',
  expanded: 'panel1',
  nombre: "",
  apellido: "",
  password: "",
  password2: "",
  pregunta1: 1,
  pregunta2: 2,
  respuesta1: "",
  respuesta2: ""
};

const userReducer = (state, payload) => {
  return { ...state, ...payload };
};

const ProfileSettings = () => {
  const classes = useStyles();
  const matches = useMediaQuery(theme => theme.breakpoints.up('sm'));

  const [state, update] = React.useReducer(userReducer, initialState);
  const {
    state: { user },
    dispatch
  } = React.useContext(saduwux);

  const [, updatePassword0] = React.useState("");

  const a11yProps = (index) => {
    return {
      id: `vertical-tab-${index}`,
      "aria-controls": `vertical-tabpanel-${index}`
    };
  }

  const getPartialInfo = (tab) => {
    switch (tab) {
      case 0: {
        return JSON.stringify({
          nombre: state.nombre,
          apellido: state.apellido
        });
      }
      case 1: {
        return JSON.stringify({
          password: state.password,
          confirmpassword: state.password2
        });
      }
      case 2: {
        return JSON.stringify({
          pregunta1: state.pregunta1,
          pregunta2: state.pregunta2,
          respuesta1: state.respuesta1,
          respuesta2: state.respuesta2
        });
      }

      default: {
        return "";
      }
    }
  };

  const handleUpdate = () => {
    if (state.value === 1 && state.password2 !== state.password1) {
      alert('Marico las contraseñas no coinciden');
      return;
    }
    fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token")
      },
      body: getPartialInfo(state.value)
    })
      .then(handleFetch)
      .then(res => {
        localStorage.setItem("token", "bearer " + res.token);
        dispatch({ type: 'update', payload: { user: res.user } });
        update({ open: true, message: 'Cambios guardados satisfactoriamente!' });
      })
      .catch(mistake => {
        console.log(mistake)
        update({ open: true, message: mistake.message });
      });
  };

  const mapPreguntas = questions.map((P, index) => {
    return (
      <MenuItem key={index} value={P.id}>
        {" "}
        {P.pregunta}{" "}
      </MenuItem>
    );
  });

  const content = <React.Fragment>
    <TabPanel value={state.value} index={0}>
      <Grid container>
        <Grid xs={12}>
          <TextField
            onChange={e => update({ nombre: e.target.value })}
            defaultValue={user.nombre}
            id="outlined-basic"
            label="Nombre"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            onChange={e => update({ apellido: e.target.value })}
            defaultValue={user.apellido}
            id="outlined-basic"
            label="Apellido"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
    </TabPanel>
    <TabPanel value={state.value} index={1}>
      <Grid container>
        <Grid xs={12}>
          <TextField
            onChange={e => updatePassword0(e.target.value)}
            id="outlined-password-input"
            label="Contraseña actual"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            onChange={e => update({ password: e.target.value })}
            error={state.password.length < 6}
            id="outlined-password-input"
            label="Nueva contraseña"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid xs={12}>
          <TextField
            onChange={e => update({ password2: e.target.value })}
            error={state.password2.length < 6 || state.password !== state.password2}
            id="outlined-password-input"
            label="Confirmar nueva contraseña"
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
    </TabPanel>
    <TabPanel value={state.value} index={2}>
      <Grid container>
        <Grid item xs={12}>
          <TextField
            id="outlined-select-currency"
            select
            label="Primera pregunta"
            value={state.pregunta1}
            onChange={e => update({ pregunta1: e.target.value })}
            variant="outlined"
            fullWidth
            margin="normal"
          >
            {mapPreguntas}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => update({ respuesta1: e.target.value })}
            id="outlined-basic"
            value={state.respuesta1}
            label="Respuesta "
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="outlined-select-currency"
            select
            label="Segunda pregunta"
            value={state.pregunta2}
            onChange={e => update({ pregunta2: e.target.value })}
            variant="outlined"
            fullWidth
            margin="normal"
          >
            {mapPreguntas}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={e => update({ respuesta2: e.target.value })}
            id="outlined-basic"
            value={state.respuesta2}
            label="Respuesta "
            variant="outlined"
            fullWidth
            margin="normal"
          />
        </Grid>
      </Grid>
    </TabPanel>
  </React.Fragment>
    ;

  if (!user.id)
    return <Redirect to="/notlogged" />;

  const handleChange = (panel) => (event, newExpanded) => {
    update({ expanded: newExpanded ? panel : false });
    update({ value: panel === 'panel1' ? 0 : panel === 'panel2' ? 1 : 2 });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    update({ open: false });
  };

  return (
    <Box
      width={1}
      display={matches ? "flex" : 'block'}
      alignItems="center"
    >
      <Container maxWidth="md">
        <Paper className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="fullWidth"
            value={state.value}
            indicatorColor="primary"
            onChange={(event, newValue) => update({ value: newValue })}
            aria-label="Configuracion de perfil"
            className={classes.tabs}
          >
            <Tab label="Perfil" {...a11yProps(0)} />
            <Tab label="Contraseña" {...a11yProps(1)} />
            <Tab label="Preguntas Secretas" {...a11yProps(2)} />
          </Tabs>
          <Container maxWidth='sm'>
            {content}
            <Button
              disabled=
              {
                state.value === 0 ? state.nombre.length <= 1 && state.apellido.length <= 1 : false ||
                  /*state.value===1 ? state. las contraseñas aqui*/
                  state.value === 2 ? state.respuesta1.length <= 0 && state.respuesta2.length <= 0 : false
              }
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={handleUpdate}
            >
              {" "}
                        Guardar
                     </Button>
          </Container>
        </Paper>
      </Container >
      <Box className={classes.sectionMobile}>
        <ExpansionPanel square expanded={state.expanded === 'panel1'} onChange={handleChange('panel1')}>
          <ExpansionPanelSummary
            aria-controls="panel1d-content" id="panel1d-header"
          >
            <Typography className={classes.heading}>Expansion Panel 1</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {content}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel square expanded={state.expanded === 'panel2'} onChange={handleChange('panel2')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Expansion Panel 1</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {content}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel square expanded={state.expanded === 'panel3'} onChange={handleChange('panel3')}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography className={classes.heading}>Expansion Panel 1</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {content}
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Box>
      <Box display={{ xs: 'block', sm: 'none' }}>
        <Toolbar variant="dense" />
      </Box>
      <Box>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={state.open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert onClose={handleClose} severity="success">
            {state.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box >
  );
};

export default ProfileSettings;
