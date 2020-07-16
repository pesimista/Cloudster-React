import React, { useContext } from 'react';

import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Typography from '@material-ui/core/Typography';
import AssignmentIcon from '@material-ui/icons/Assignment';
/**Icons */
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import FolderSpecialIcon from '@material-ui/icons/FolderSpecial';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import ListAltIcon from '@material-ui/icons/ListAlt';
import WarningIcon from '@material-ui/icons/Warning';
import PropTypes from 'prop-types';
import {
  Link as RouterLink,
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { saduwux } from '../SF/Context';
import FilesTableContainer from './Files/FilesTable';
import UsersTableContainer from './Users/UsersTable';

const useStyles = makeStyles({
  main: {
    display: 'grid',
    gridTemplateColumns: '250px 1fr',
    height: '100%',
    overflow: 'auto',

    '& .right-column': {
      height: '100%',
      overflow: 'auto',
      paddingLeft: '10px',
    },
    '& .left-column': {
      boxShadow: '5px 0 5px -5px #333',
      width: '100%',
      height: '100%',
      zIndex: '10',
      '& .MuiAvatar-root': {
        backgroundColor: 'transparent',
      },
      '& .MuiSvgIcon-root': {
        fontSize: '40px',
      },
      '& .MuiListItem-root:hover': {
        backgroundColor: 'rgba(0,0,0,0.3)',
      },
    },
  },
  dim: {
    backgroundColor: '#fff9c4',
    '& .left-column': {
      backgroundColor: '#ffa726',
      '& .MuiSvgIcon-root': {
        color: '#000',
      },
    },
  },
  dark: {
    backgroundColor: '#393d46',
    '& .left-column': {
      backgroundColor: '#666',
      color: '#fff',
      '& .MuiSvgIcon-root': {
        color: '#fff',
      },
    },
  },
  card: {
    height: '100%',
    borderRadius: 0,
    '&>*': {
      overflow: 'hidden auto',
      height: '100%',
    },
  },
});

const routes = [
  {
    link: `/archivos/detalles`,
    component: AssignmentIcon,
    primaryText: 'Detalles de archivos',
    helperText: 'Ver resumen de los archivos',
  },
  {
    link: `/archivos/lista`,
    component: FolderSpecialIcon,
    primaryText: 'Administrar Archivos',
    helperText: 'Modificar estatus de los archivos',
  },
  {
    link: `/usuarios/detalles`,
    component: AssignmentIndIcon,
    primaryText: 'Detalles de usuarios',
    helperText: 'Ver resumen de los usuarios',
  },
  {
    link: `/usuarios/lista`,
    component: HowToRegIcon,
    primaryText: 'Administrar usuarios',
    helperText: 'Modificar estatus de los usuarios',
  },
  {
    link: `/reportes`,
    component: ListAltIcon,
    primaryText: 'Reportes',
    helperText: 'Descargar reportes en formato PDF',
  },
];

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const Admin = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    const x = routes.findIndex((route) => {
      const link = props.match.path + route.link;
      return location.pathname === link;
    });
    setSelectedIndex(x);
  }, [location.pathname, props.match.path]);

  const { state: globalState } = useContext(saduwux);

  const mainClass = () => {
    let className = classes.main;
    className += !globalState.theme ? ` ${classes.dim}` : ` ${classes.dark}`;
    return className;
  };

  const listItems = () =>
    routes.map((route, index) => (
      <React.Fragment key={index}>
        <ListItem
          button
          component={reactLink}
          to={props.match.path + route.link}
          selected={selectedIndex === index}
        >
          <ListItemAvatar>
            <Avatar>
              <route.component />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={route.primaryText}
            secondary={route.helperText}
          />
        </ListItem>
        <Divider />
      </React.Fragment>
    ));

  return (
    <Box component="main" display="flex" className={mainClass()}>
      <Box component="div" className="left-column">
        <List
          className={classes.root}
          subheader={
            <ListSubheader component="div" id="subheader">
              Configuraciones
            </ListSubheader>
          }
        >
          {listItems()}
        </List>
      </Box>

      <Box component="div" className="right-column">
        <Switch>
          <Route exact path={props.match.path} component={WelcomeAdmin} />
          <Route
            path={`${props.match.path}/archivos/lista`}
            render={() => <FilesTableContainer useTheme={globalState.theme} />}
          />
          <Route
            path={`${props.match.path}/usuarios/lista`}
            render={() => (
              <UsersTableContainer
                useTheme={globalState.theme}
                adminID={globalState.user.id}
              />
            )}
          />
        </Switch>
      </Box>
    </Box>
  );
};

export default Admin;

const WelcomeAdmin = () => {
  return (
    <Box
      textAlign="center"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="min-h100"
    >
      <Card>
        <CardContent style={{ paddingBottom: '0px' }}>
          <Typography variant="h5" component="h2">
            ¡Bienvenido!
          </Typography>
          <Typography variant="body2" component="p">
            Desde esta página puedes gestionar el contenido de Cloudster.
          </Typography>
          <Typography variant="body2" component="p">
            Procede con precaución.
          </Typography>

          <WarningIcon style={{ marginTop: '1rem', fontSize: '100px' }} />
        </CardContent>
      </Card>
    </Box>
  );
};

/* <Route exact path={this.props.match.path} component={HomeDefault} />
<Route path={`${this.props.match.path}/one`} component={HomePageOne} />
<Route path={`${this.props.match.path}/two`} component={HomePageTwo} /> */
