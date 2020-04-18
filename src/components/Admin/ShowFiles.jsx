import React from 'react';
//import { withStyles, makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, MenuItem,  Select, InputBase, CircularProgress, Box } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import TableBody from '@material-ui/core/TableBody';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import Box from '@material-ui/core/Box';
import DeleteIcon from '@material-ui/icons/Delete';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Snackbar from "@material-ui/core/Snackbar";
import Typography from '@material-ui/core/Typography';
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
    '& .MuiTableCell-body':{
      backgroundColor: '#393d46',
      color: 'white'
    },
    '& .MuiSelect-select:focus':{
      backgroundColor: 'rgba(255,255,255,.75)'
    }
  },
  a: {
    color: '#228dff',
  },
  text: {
    color: '#FFF'
  },
});

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

const ShowFiles = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [displayMessage, updateMessage ] = React.useState('');

  const changeNivel = (fileId, target) => {
    fetch(`/api/update/file`, {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        id: fileId,
        newNivel: target.value
      })
    }).then( res => res.json() )
    .then( data => {
      if(data.response ===  "oll korrect")
      {
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

  const file = props.filesList.map( (value, index) =>
    {
      return (
        <TableRow key={value.id}>
          <TableCell><img src={props.getIcon(value.isFile, value.ext)} alt={value.ext} width="24px"/></TableCell>
          <TableCell>{value.id}</TableCell>
          <TableCell>{ value.name.length > 30 ? value.name.substring(0,27) : value.name }</TableCell>
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
          <TableCell align="right">{value.ext}</TableCell>
          <TableCell align="right">{value.lastModified}</TableCell>
          <TableCell align="right">{value.size}</TableCell>
          <TableCell align="right"><a className={props.useTheme ? classes.a : ''} href={`#file${value.dependency}`}>{value.dependency}</a></TableCell>
          <TableCell align="right">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      )
    });


  if(file.length = props.filesList.length){
  return(
    <TableContainer component={Paper} color="primary">
      <Table className={!props.useTheme ? classes.table : classes.useDark} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Icono</TableCell>
            <TableCell>ID</TableCell>
            <TableCell>Nombre del archivo</TableCell>
            <TableCell align="right">Nivel</TableCell>
            <TableCell align="right">Extensión</TableCell>
            <TableCell align="right">Última modificación</TableCell>
            <TableCell align="right">Tamaño</TableCell>
            <TableCell align="right">En carpeta</TableCell>
            <TableCell aria-label="delete" align="right">Eliminar</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {file}
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
  );}
  else return (
    <Box display="flex" width={1} textAlign="center" justifyContent="center" alignItems="center" style={{ height: '86.5vh' }}>
    <Typography className={props.useTheme ? classes.text : ''}>
      Cargando...
    </Typography>
    </Box> )
}

export default ShowFiles;