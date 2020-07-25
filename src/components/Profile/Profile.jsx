/**
 * @typedef {import('../SF/typedefs.jsx').context} context
 * @typedef {import('../SF/typedefs.jsx').file} file
 */
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { green } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import { useHistory } from 'react-router-dom';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useContext } from 'react';
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';
import { saduwux } from '../SF/Context';
import { handleFetch, reactLink } from '../SF/helpers';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const useStyles = makeStyles((theme) => ({
  avatar: { backgroundColor: green[500] },
  main: {
    overflow: 'auto',
    height: '100%',
    '& .card-box': {
      minWidth: 300,
      maxWidth: 480,
      width: '100%',
      padding: '0 10px',
      textAlign: 'center',
      '& .MuiCardHeader-root': {
        textAlign: 'center',
      },
      '& .MuiCard-root': {
        minWidth: 300,
        maxWidth: 480,
        margin: '1rem',
        width: '100%',
        height: 'min-content',
        [theme.breakpoints.down('sm')]: {
          maxWidth: 'calc(100vw - 1rem)',
          margin: '1rem 0'
        },
        '& .MuiCardContent-root':{
          '&.files-container': {
            padding: '0',
          },
          '&:last-child': {
            paddingBottom: 16,
          },
        }
      },
      '& .center': {
        display: 'flex',
        justifyContent: 'center',
      },
      '& .MuiButton-containedPrimary': {
        boxShadow: 'none',
        marginRight: 10
      }
    },
  },
  card: {
    minWidth: 300,
    maxWidth: 500,
    margin: 5,
  },
  list: {
    overflow: 'auto',
    maxHeight: 300,
  },
  dark: {
    backgroundColor: '#393d46',
    color: '#fff',
    '& .files': {
      color: '#4caf50',
    },
    '& .MuiButton-containedPrimary': {
      border: '1px solid #fff',
    }
  },
  dim: {
    backgroundColor: '#fff9c4',
    color: 'white',
    '& .files': {
      color: '#4caf50',
    },
    '& .MuiButton-containedPrimary': {
      color: '#fff'
    }
  },
}));

const initialState = {
  files: [],
  shouldUpdate: false,
  totalSize: 0,
  parsedSize: '',
  chartData: [],
};
const reducer = (state, action) => {
  return { ...state, ...action };
};

const Profile = () => {
  const classes = useStyles();
  const history = useHistory();
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  /** @type {context}*/
  const {
    state: { user, theme },
    dispatch,
  } = useContext(saduwux);
  const [state, update] = React.useReducer(reducer, initialState);

  /** Algo así para buscar los archivos subidos por el usuario */
  React.useEffect(() => {
    fetch(`/api/users/${user.id}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(handleFetch)
      .then((response) => update({ ...response, files: sort(response.files) }))
      .catch(() => {});
  }, [user.id, state.shouldUpdate]);

  const goToFolder = (dependency) => {
    dispatch({
      type: 'update',
      payload: {
        folder: dependency,
        history: []
      }
    });
    history.push('/busqueda');
  }

  const handleCheck = ({ target }) => {
    dispatch({
      type: 'update',
      payload: { theme: target.checked },
    });
  }

  const files = () =>
    state.files.map((file, index) => {
      return (
        <React.Fragment key={index}>
          <ListItem style={{height: 50}}>
            <ListItemIcon>
              <SvgIcon component={!file.ext ? FolderIcon : DescriptionIcon} />
            </ListItemIcon>
            <ListItemText primary={file.name} secondary={null} />
            <ListItemSecondaryAction>
              <IconButton
                style={{padding: 0}}
                aria-label="got-to-containingFolder"
                onClick={() => goToFolder(file.dependency)}
              >
                <ArrowRightIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
          <Divider/>
        </React.Fragment>
      );
    });

  const getClasses = () =>{
    let className = `${classes.main} `;
    className += theme ? classes.dark : classes.dim;
    return className;
  }
  return (
    <Grid
      className={getClasses()}
      container
      justify="center"
    >
      <Grid
        container
        item
        direction="column"
        justify="center"
        alignItems="center"
        wrap="nowrap"
        className="card-box"
      >
        <Card raised={false}>
          <CardHeader title="Perfil" />
          <Divider />

          <CardContent>
            <Typography variant="h3">
              {user.usuario}
            </Typography>
            <Box m={0.5}>
              <Box display="flex" justifyContent="center">
                <Avatar className={classes.avatar}>
                  {user.nivel}
                </Avatar>
              </Box>
              <Typography color="textSecondary">
                Nivel de jerarquía
              </Typography>
            </Box>
            <Divider />
            <Box m={0.5}>
              <Typography>
                {user.nombre} {user.apellido}
              </Typography>
              <Typography>Miembro desde: {user.desde}</Typography>
            </Box>
            <Divider />

            <Box m={0.5}>
              <Typography>
                Espacio en el servidor: {state.parsedSize}
              </Typography>
              <Typography>
                Total de archivos subidos: {state.files.length}
              </Typography>
            </Box>
            <Divider />

          </CardContent>
          <CardActions>
            <Box mx="auto">
              <Link
                component={reactLink}
                to="/configuracion"
                underline="none"
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SettingsIcon />}
                >
                  Configuración
                </Button>
              </Link>
              <FormControlLabel
                control={
                  <Switch
                    checked={theme}
                    onChange={handleCheck}
                    value="theme"
                    color={theme ? 'default' : 'primary'}
                    inputProps={{ 'aria-label': 'primary checkbox' }}
                  />
                }
                label="Cambiar tema"
              />
            </Box>
          </CardActions>
        </Card>
      </Grid>
      {
        !state.files.length ? 
        '' : (
          <Grid 
            container
            item
            direction="column"
            justify="center"
            alignItems="center"
            wrap="nowrap"
            className="card-box"
          >
            <Grid item xs={12} style={{width: '100%'}}>
              <Card raised={false} style={{width: '100%'}}>
                <CardHeader title="Archivos Subidos" />
                <Divider />
                <CardContent className="files-container">
                  <List className={classes.list} dense={true}>
                    {files()}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card raised={false}>
                <CardHeader title="Tipos de Archivos" />
                <Divider />
                <FileChartContent matches={matches} data={state.chartData} />
              </Card>
            </Grid>
          </Grid>
        )
      }
    </Grid>
  );
      //   <Box display={{ xs: 'flex', sm: 'none' }}>
      //     <Toolbar variant="dense" />
      //   </Box>
      // </Box>
};

const FileChartContent = ({ data, matches }) => {
  if (!data.length) {
    return <div></div>;
  }

  const result = data.reduce((totalValue, ext) => totalValue + ext.value, 0); // Suma de todos los archivos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']; // Colores para el chart

  return (
    <CardContent>
      <PieChart
        width={matches ? 400 : 300}
        height={300}
        style={{ fontFamily: 'sans-serif' }}
      >
        <Pie
          data={data}
          cx={'50%'}
          cy={'50%'}
          label
          innerRadius={'68.9656%'}
          outerRadius={'80%'}
          fill="#8884d8"
          paddingAngle={3}
          dataKey="value"
          isAnimationActive={false}
        >
          <Label
            value={result}
            style={{ fontSize: '1.5rem' }}
            offset={0}
            position="center"
          />
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          layout={matches ? 'vertical' : 'horizontal'}
          verticalAlign={matches ? 'middle' : 'bottom'}
          align={matches ? 'left' : 'center'}
        />
      </PieChart>
    </CardContent>
  );
};

/** @param {file[]} arr */
const sort = (arr) => {
  arr.sort(byName);
  arr.sort(byIno);
  return arr;
}; //Sort
/**
 * @param {file} a
 * @param {file} b
 */
const byName = (a, b) => a.name.localeCompare(b.name); //By name
/**
 * @param {file} a
 * @param {file} b
 */
const byIno = (a, b) => a.ino - b.ino;

export default Profile;
