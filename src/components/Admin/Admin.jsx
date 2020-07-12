import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
//import { makeStyles, Typography, AppBar, Tabs, Tab, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { useContext, useState } from "react";
import { Redirect, Route, Switch } from 'react-router-dom';
import { saduwux } from "../SF/Context";
import { handleFetch } from '../SF/helpers';
import FilesTableContainer from "./Files/FilesTable";
import ShowData from './ShowData';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    height: '100%',
    borderRadius: 0,
    '&>*': {
      overflow: 'hidden auto',
      height: '100%'
    }
  },
  useDark: { backgroundColor: '#393d46' }
});

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
  // const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const [filesList, updateFiles] = useState();
  const [userList, updateUsers] = useState([]);

  React.useEffect(() => {
    fetch(`/api/admin/files`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    }).then(
      handleFetch
    ).then(
      (response) => setTimeout(() => updateFiles(response), 500)
    ).catch((mistake) => {
      console.log(
        `/api/admin/files`,
        mistake.message
      );
      alert('salio mal' + mistake.message);
    }
    );
  }, []);

  const { state: globalState, dispatch } = useContext(saduwux);

  // const fetchUsers = () => {
  // 	fetch('/api/users')
  // 		.then(handleFetch)
  // 		.then(users => {
  // 			updateUsers(users)
  // 		});
  // }

  // React.useEffect(() => {
  // 	fetchUsers();
  // 	fetch('/api/allFiles')
  // 		.then(handleFetch)
  // 		.then(files => {
  // 			updateFiles(files)
  // 		});
  // }, []);

  if (!globalState.logStatus) {
    return <Redirect to='/notlogged' />
  }
  else if (globalState.user.nivel < 5) {
    return <Redirect to='/Busqueda' />;
  }

  const filteredFiles = filesList;
  const filteredUsers = userList;

  // if (value === 1) {
  // 	props.modifySearch(1);
  // }
  // fetchUsers={fetchUsers}

  return (
    <Box display="flex" style={{ flexGrow: 1, display: 'flex' }}>
      <Switch>

        <Route exact path={props.match.path}
          render={() =>
            <ShowData
              useTheme={props.useTheme}
              getIcon={props.getIcon}
              filesList={filteredFiles}
              userList={filteredUsers}
              userId={props.userId}
              modifySearch={props.modifySearch}
            />
          }
        />
        <Route path={`${props.match.path}/files`}
          render={() =>
            <React.Fragment>
              <div className={"flex-column"} style={{ width: '40%' }} ></div>
              <div style={{ flexGrow: 1, padding: '16px' }}>
                <Card className={`MuiPaper-elevation4 ${classes.card} ${globalState.theme ? classes.useDark : ''}`} >
                  <FilesTableContainer
                    filesList={filesList}
                    useTheme={globalState.theme}
                  />
                </Card>
              </div>
            </React.Fragment>
          }
        />
      </Switch>
    </Box>
  );
}
export default Admin;

/* <Route exact path={this.props.match.path} component={HomeDefault} />
<Route path={`${this.props.match.path}/one`} component={HomePageOne} />
<Route path={`${this.props.match.path}/two`} component={HomePageTwo} /> */