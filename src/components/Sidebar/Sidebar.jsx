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
import { Link as RouterLink, useLocation } from 'react-router-dom';

const drawerWidth = 51;
const routes = [`/busqueda`, `/reproductor`, `/perfil`, `/admin`];

const reactLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const useStyles = makeStyles(theme => ({
   drawer: {
      flexShrink: 0,
      width: drawerWidth,
      '& .MuiListItemIcon-root': {
         minWidth: '0'
      },
      '& .MuiListItem-gutters': {
         paddingLeft: 8,
         paddingRight: 8
      },
   },
   grow: {
      flexGrow: 1,
   },
   drawerPaper: {
      width: drawerWidth,
   },
   toolbar: theme.mixins.toolbar,
   useDark: {
      '& .MuiListItemIcon-root': {
         color: 'white',
      },
      '& .MuiDrawer-paper': {
         backgroundColor: '#252525',
      },
   },
}));

const Sidebar = (props) => {
   const location = useLocation();
   const classes = useStyles();
   const [selectedIndex, setSelectedIndex] = React.useState(1);
   const { modifyBar } = props;

   React.useEffect(() => {
      console.log(location.pathname)
      let x = routes.indexOf(location.pathname) + 1;
      modifyBar(x);
      setSelectedIndex(x)
   }, [location.pathname, modifyBar])

   const handleListItemClick = (index) => {
      setSelectedIndex(index);
      props.modifyBar(index);
      props.modifySearch(0);
   };

   return (
      <Box className={props.useTheme ? classes.useDark : ''}>
         <Drawer
            className={classes.drawer}
            color="primary.main"
            variant="permanent"
            classes={{
               paper: classes.drawerPaper,
            }}
         >
            <div className={classes.toolbar} />
            <List>
               <ListItem button component={reactLink} to='/busqueda'
                  selected={selectedIndex === 1}
                  onClick={() => handleListItemClick(1)}
               >
                  <ListItemIcon><FolderIcon fontSize="large" /></ListItemIcon>
               </ListItem>
               <Divider />
               <ListItem button component={reactLink} to='/reproductor'
                  selected={selectedIndex === 2}
                  onClick={() => handleListItemClick(2)}
               >
                  <ListItemIcon ><PlayCircleFilledIcon fontSize="large" /></ListItemIcon>
               </ListItem>
               <Divider />
               <ListItem button component={reactLink} to='/perfil'
                  selected={selectedIndex === 3}
                  onClick={() => handleListItemClick(3)}
               >
                  <ListItemIcon ><AccountCircleIcon fontSize="large" /></ListItemIcon>
               </ListItem>
               <Divider />
               {props.userLvl === 5 ?
                  <ListItem button component={reactLink} to='/admin'
                     selected={selectedIndex === 4}
                     onClick={() => handleListItemClick(4)}
                  >
                     <ListItemIcon ><SettingsIcon fontSize="large" /></ListItemIcon>
                  </ListItem> : ''}
               <Divider />
            </List>
            <div className={classes.grow} />
            <List>
               <ListItem button component={reactLink} to='/' onClick={props.signout}>
                  <ListItemIcon ><ExitToAppIcon fontSize="large" /></ListItemIcon>
               </ListItem>
            </List>
         </Drawer>
      </Box>
   );
}
export default Sidebar;