//import { Divider, Drawer, List, ListItem, ListItemIcon, makeStyles } from '@material-ui/core';
//import { AccountCircle as AccountCircleIcon, ExitToApp as ExitToAppIcon, Folder as FolderIcon, Settings as SettingsIcon, PlayCircleFilled as PlayCircleFilledIcon } from '@material-ui/icons';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import FolderIcon from '@material-ui/icons/Folder';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import SettingsIcon from '@material-ui/icons/Settings';
import React from 'react';
import SvgIcon from "@material-ui/core/SvgIcon/SvgIcon";
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { saduwux } from "../SF/Context";

const drawerWidth = 51;
const routes = [`/busqueda`, `/reproductor`, `/perfil`, `/admin/files`];
const routesComponents = [FolderIcon, PlayCircleFilledIcon, AccountCircleIcon, SettingsIcon];

const reactLink = React.forwardRef((props, ref) =>
   <RouterLink innerRef={ref} {...props} />
);
reactLink.displayName = 'reactLink';

const useStyles = makeStyles(theme => ({
   grow: { flexGrow: 1 },
   drawerPaper: { width: drawerWidth, position: 'static'},
   flexColumn: { justifyContent: 'space-between' },
   toolbar: theme.mixins.toolbar,
   drawer: {
      flexShrink: 0,
      width: drawerWidth,
      '& .MuiListItemIcon-root': { minWidth: '0' },
      '& .MuiListItem-gutters': {
         paddingLeft: 8,
         paddingRight: 8
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
      let x = routes.indexOf(location.pathname);
      setSelectedIndex(x)
   }, [location.pathname])

   const signout = () => {
      localStorage.clear();
      dispatch({ type: 'reset' })
   };

   return (
      <Box component="aside" className={globalState.theme ? classes.useDark : ''}>
         <Drawer
            className={`${classes.drawer} min-h100`}
            color="primary.main"
            variant="permanent"
            classes={{
               paper: `${classes.drawerPaper} flex-column ${classes.flexColumn} min-h100`,
            }}
         >
            <List>
               {
                  routes.reduce((prev, route, index) => {
                     if (index === 4 && globalState.user.nivel < 5) return prev;
                     const fragment = (
                        <React.Fragment key={index}>
                           <ListItem button component={reactLink} to={route} selected={selectedIndex === index}>
                              <ListItemIcon>
                                 <SvgIcon fontSize="large" component={routesComponents[index]} />
                                 {/* <FolderIcon /> */}
                              </ListItemIcon>
                           </ListItem>
                           <Divider />
                        </React.Fragment>
                     );
                     prev.push(fragment);
                     return prev;
                  }, [])
               }
            </List>
            
            <List>
               <ListItem button component={reactLink} to='/' onClick={signout}>
                  <ListItemIcon>
                     <ExitToAppIcon fontSize="large" />
                  </ListItemIcon>
               </ListItem>
            </List>
         </Drawer>
      </Box>
   );
}
export default Sidebar;