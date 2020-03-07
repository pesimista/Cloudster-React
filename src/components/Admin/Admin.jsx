import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import ShowData from './ShowData';
import ShowUsers from './ShowUsers';
//import { makeStyles, Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';

function TabPanel(props) {
	const { children, value, index, ...other } = props;
  
	return (
	  <Typography
		component="div"
		role="tabpanel"
		hidden={value !== index}
		id={`simple-tabpanel-${index}`}
		aria-labelledby={`simple-tab-${index}`}
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
  
  function a11yProps(index) {
	return {
	  id: `simple-tab-${index}`,
	  'aria-controls': `simple-tabpanel-${index}`,
	};
  }

const drawerWidth = 51;
const useStyles = makeStyles(theme => ({
	root: {
	  flexGrow: 1,
	},
	appBar: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
	  },
	  toolbar: theme.mixins.toolbar,
	  useDark:{
		flexGrow: 1,
		backgroundColor: '#393d46',
	  }
  }));

const Admin = (props) => {
	const classes = useStyles();
  	const [value, setValue] = React.useState(0);
	const [filesList, updateFiles] = useState([]);
	const [userList, updateUsers] = useState([]);	

	const fetchUsers = () => {
		fetch('/api/users')
			.then(res => res.json())
			.then(users => {
			updateUsers(users)
		});
	}

	React.useEffect(() => {
		fetchUsers();
		fetch('/api/allFiles')
		.then(res => res.json())
		.then(files => {
			updateFiles(files)
		});
	}, []);

	if(!localStorage.getItem('user'))
	{
		return (<Redirect to='/notlogged' />);
	} else if ( JSON.parse(localStorage.getItem('user')).nivel !== 5){
		return (<Redirect to='/Busqueda' />);
	}

	const filteredFiles = filesList.filter(f => {
		return f.name.toLowerCase().includes(props.searchFileField.toLowerCase())
	})
	const filteredUsers = userList.filter(u => {
		return u.nombre.toLowerCase().includes(props.searchUserField.toLowerCase()) || u.usuario.toLowerCase().includes(props.searchUserField.toLowerCase())
	})

	const handleChange = (event, newValue) => {
		props.modifySearch(newValue);
		setValue(newValue);
	};

	if(value===1){
		props.modifySearch(1);
	}

	return(
		<Box display="flex" width={1}>
			<ShowData
			useTheme={props.useTheme}
			getIcon={props.getIcon}
			filesList={filteredFiles}
			userId={props.userId}
			userList={filteredUsers}
			fetchUsers={fetchUsers}
			modifySearch={props.modifySearch}
			/>
		</Box>
	);
}
export default Admin;