import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import { withStyles, makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, MenuItem, Select, InputBase, IconButton } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import PropTypes from 'prop-types';
import React from 'react';
import MySnackbarContentWrapper from '../SubSnackBar/SubSnackBar';


const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  useDark: {
    '& .MuiTableCell-head': {
      backgroundColor: '#424242',
      color: 'white'
    },
    '& .MuiTableCell-body': {
      backgroundColor: '#393d46',
      color: 'white'
    },
    '& .MuiSelect-select:focus': {
      backgroundColor: 'rgba(255,255,255,.75)'
    },
    '& .MuiTablePagination-toolbar': {
      backgroundColor: '#393d46',
      color: 'white'
    },
    '& .MuiSelect-icon': {
      color: 'white'
    },
    '& .MuiIconButton-root': {
      color: 'rgba(255,255,255,0.54)'
    },
    '& .MuiIconButton-root.Mui-disabled': {
      color: 'rgba(255,255,255,0.26)'
    }
  },
  a: {
    color: '#228dff',
  },
  text: {
    color: '#FFF'
  },
});

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

const BootstrapInput = withStyles(theme => ({
  root: {
    'label + &': {
      marginTop: theme.spacing(3),
    },
  },
  input: {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

const ColorCircularProgress = withStyles({
  root: {
    color: '#00695c',
  },
})(CircularProgress);

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const ShowUsers = (props) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [open, setOpen] = React.useState(false);
  const [displayMessage, updateMessage] = React.useState('');

  const changeNivel = (fileId, target) => {
    fetch(`/api/update/usuario?nivel=true`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: fileId,
        newNivel: target.value
      })
    }).then(res => res.json())
      .then(data => {
        if (data.response === "oll korrect") {
          updateMessage('Nivel modificado satisfactoriamente!')
          setOpen(true);
        }
      })
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const deleteUser = (userid, nivel) => {
    if (userid !== props.userId && nivel < 5) {
      fetch(`/api/users/${userid}`, {
        method: 'delete'
      }).then(res => res.json())
        .then(data => {
          if (data.response === "oll korrect") {
            props.fetchUsers();
            updateMessage('Usuario eliminado satisfactoriamente!')
            setOpen(true);
          }
        })
    }
    else if (nivel === 5) {
      alert('No puedes eliminar a otro administrados');
    }
    else {
      alert('No puedes eliminar tu propio usuario');
    }
  };

  const users = (rowsPerPage > 0
    ? props.userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : props.userList
  ).map((value) => {
    return (
      <TableRow key={value.id}>
        <TableCell>{value.id}</TableCell>
        <TableCell>{value.usuario}</TableCell>
        <TableCell align="right">
          <Select
            labelId="demo-customized-select-label"
            id="demo-customized-select"
            onChange={(e) => changeNivel(value.id, e.target)}
            input={<BootstrapInput />}
            defaultValue={value.nivel}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>

        </TableCell>
        <TableCell align="right">{value.desde}</TableCell>
        <TableCell align="right">{value.nombre}</TableCell>
        <TableCell align="right">
          <IconButton onClick={() => deleteUser(value.id, value.nivel)} aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </TableCell>
      </TableRow>
    )
  });

  return (
    <div>
      <TableContainer component={Paper}>
        <Table className={!props.useTheme ? classes.table : classes.useDark} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre de usuaio</TableCell>
              <TableCell align="right">Nivel</TableCell>
              <TableCell align="right">Desde</TableCell>
              <TableCell align="right">Nombre</TableCell>
              <TableCell align="right">Eliminar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users}
          </TableBody>
        </Table>
        <Box>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <MySnackbarContentWrapper
              onClose={handleClose}
              variant="success"
              message={displayMessage}
            />
          </Snackbar>
        </Box>
      </TableContainer>
      <TablePagination
        className={!props.useTheme ? null : classes.useDark}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={props.userList.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActions}
      />
    </div>
  );
}

// const showUsers = (
//   <TableContainer component={Paper} color="primary">
//      <Table className={!props.useTheme ? classes.table : classes.useDark} aria-label="simple table">
//         <TableHead>
//            <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Nombre de usuaio</TableCell>
//               <TableCell align="right">Nivel</TableCell>
//               <TableCell align="right">Desde</TableCell>
//               <TableCell align="right">Nombre</TableCell>
//               <TableCell align="right">Eliminar</TableCell>
//            </TableRow>
//         </TableHead>
//         <TableBody>
//            {users}
//         </TableBody>
//      </Table>
//   </TableContainer>
// )

// const users = (rowsPerPage > 0
//   ? props.userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//   : props.userList
// ).map((value) => {
//   return (
//      <TableRow key={value.id}>
//         <TableCell>{value.id}</TableCell>
//         <TableCell>{value.usuario}</TableCell>
//         <TableCell align="right">
//            <Select
//               labelId="demo-customized-select-label"
//               id="demo-customized-select"
//               onChange={(e) => changeNivelUser(value.id, e.target)}
//               input={<BootstrapInput />}
//               defaultValue={value.nivel}
//            >
//               <MenuItem value={1}>1</MenuItem>
//               <MenuItem value={2}>2</MenuItem>
//               <MenuItem value={3}>3</MenuItem>
//               <MenuItem value={4}>4</MenuItem>
//               <MenuItem value={5}>5</MenuItem>
//            </Select>

//         </TableCell>
//         <TableCell align="right">{value.desde}</TableCell>
//         <TableCell align="right">{value.nombre}</TableCell>
//         <TableCell align="right">
//            <IconButton onClick={() => deleteUser(value.id, value.nivel)} aria-label="delete">
//               <DeleteIcon />
//            </IconButton>
//         </TableCell>
//      </TableRow>
//   )
// }
// );

export default ShowUsers;