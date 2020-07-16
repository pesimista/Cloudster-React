import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon/SvgIcon';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { saduwux } from '../SF/Context';
import green from '@material-ui/core/colors/green';

const routes = [`/busqueda`, `/reproductor`, `/perfil`, `/admin`];
const routesComponents = [
  FolderIcon,
  PlayCircleFilledIcon,
  AccountCircleIcon,
  SettingsIcon,
];

const reactLink = React.forwardRef((props, ref) => (
  <RouterLink innerRef={ref} {...props} />
));
reactLink.displayName = 'reactLink';

const useStyles = makeStyles(() => ({
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
  },
  drawer: {
    '& .Mui-selected': {
      backgroundColor: 'rgba(0,0,0,0.1)',
      borderLeft: '2px solid ' + green[500],
    },
    flexShrink: 0,
    '& .MuiListItemIcon-root': { minWidth: '0' },
    '& .MuiListItem-gutters': {
      paddingLeft: 8,
      paddingRight: 8,
    },
  },
  useDark: {
    '& .MuiListItemIcon-root': { color: 'white' },
    '& .MuiDrawer-paper': { backgroundColor: '#252525' },
  },
}));

const Sidebar = () => {
  const classes = useStyles();
  const location = useLocation();

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { state: globalState, dispatch } = React.useContext(saduwux);

  React.useEffect(() => {
    const [, url] = location.pathname.split('/');
    const x = routes.indexOf(`/${url}`);
    setSelectedIndex(x);
  }, [location.pathname]);

  const signout = () => {
    localStorage.clear();
    dispatch({ type: 'reset' });
  };

  const listItems = () =>
    routes.reduce((prev, route, index) => {
      if (index === 3 && globalState.user.nivel < 5) return prev;
      const fragment = (
        <React.Fragment key={index}>
          <ListItem
            button
            component={reactLink}
            to={route}
            selected={selectedIndex === index}
          >
            <ListItemIcon>
              <SvgIcon fontSize="large" component={routesComponents[index]} />
            </ListItemIcon>
          </ListItem>
          <Divider />
        </React.Fragment>
      );
      prev.push(fragment);
      return prev;
    }, []);

  return (
    <Box component="aside" className={globalState.theme ? classes.useDark : ''}>
      <Drawer
        className={`${classes.drawer} min-h100`}
        color="primary.main"
        variant="permanent"
        classes={{
          paper: `${classes.flexColumn} position-static`,
        }}
      >
        <List>{listItems()}</List>

        <List>
          <ListItem button component={reactLink} to="/" onClick={signout}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="large" />
            </ListItemIcon>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
