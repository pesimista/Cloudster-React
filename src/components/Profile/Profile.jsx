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
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import DescriptionIcon from '@material-ui/icons/Description';
import FolderIcon from '@material-ui/icons/Folder';
import SettingsIcon from '@material-ui/icons/Settings';
import SvgIcon from '@material-ui/core/SvgIcon/SvgIcon';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import React, { useContext } from 'react';
import { Link as RouterLink, Redirect } from 'react-router-dom';
import { Cell, Label, Legend, Pie, PieChart } from 'recharts';
import { saduwux } from '../SF/Context';
import { handleFetch } from '../SF/helpers';

const useStyles = makeStyles(() => ({
  avatar: { backgroundColor: green[500] },
  main: {
    overflow: 'auto',
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
  useDark: {
    backgroundColor: '#393d46',
  },
  useLight: {
    color: 'white',
  },
}));

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

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

const route = window.location.hostname.replace(/(:)\d/g, '');

const Profile = () => {
  const classes = useStyles();
  const matches = useMediaQuery((theme) => theme.breakpoints.up('sm'));

  /** @type {context}*/
  const {
    state: { user, theme },
    dispatch,
  } = useContext(saduwux);
  const [state, update] = React.useReducer(reducer, initialState);

  /** Algo así para buscar los archivos subidos por el usuario */
  React.useEffect(() => {
    fetch(`http://${route}:1234/api/users/${user.id}/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(handleFetch)
      .then((response) => update({ ...response, files: sort(response.files) }))
      .catch((mistake) =>
        console.log(`/api/files/${user.id}/files`, mistake.message)
      );
  }, [user.id, state.shouldUpdate]);

  /* const toFolder = () => {  //// Método para llevar al folder en el que se encuentra el archivo en el Search

  }*/

  const handleCheck = (event) =>
    dispatch({
      type: 'update',
      payload: { theme: event.target.checked },
    });

  const files = () =>
    state.files.map((file, index) => {
      return (
        <ListItem key={index}>
          <ListItemIcon>
            <SvgIcon component={!file.ext ? FolderIcon : DescriptionIcon} />
          </ListItemIcon>
          <ListItemText primary={file.name} secondary={null} />
        </ListItem>
      );
    });

  if (!user.id) return <Redirect to="/notlogged" />;

  return (
    <Box className={classes.main} component="main" width={1} textAlign="center">
      <Container
        className={theme ? classes.useDark : ''}
        fixed
        disableGutters
        maxWidth="md"
      >
        <Grid container alignItems="center">
          <Grid item xs justify="center" container>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader title="Perfil" />
                <Divider />
                <CardContent>
                  <Typography variant="h3">{user.usuario}</Typography>
                  <Box m={0.5}>
                    <Box display="flex" justifyContent="center">
                      <Avatar className={classes.avatar}>{user.nivel}</Avatar>
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
                  </Box>
                </CardActions>
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
              </Card>
            </Grid>
          </Grid>
          <Grid item container xs>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader title="Archivos Subidos" />
                <Divider />
                <CardContent>
                  <List className={classes.list} dense={true}>
                    {files()}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card className={classes.card}>
                <CardHeader title="Tipos de Archivos" />
                <Divider />
                <FileChartContent matches={matches} data={state.chartData} />
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Box display={{ xs: 'flex', sm: 'none' }}>
        <Toolbar variant="dense" />
      </Box>
    </Box>
  );
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
