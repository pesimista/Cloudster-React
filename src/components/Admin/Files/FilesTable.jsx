import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
//import { withStyles, makeStyles, TableContainer, Table, TableHead, TableRow, TableCell, Paper, TableBody, MenuItem,  Select, InputBase, CircularProgress, Box } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { parseSize, getIcon } from "../../SF/helpers";
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles({
   table: { minWidth: 650 },
   a: { color: '#228dff' },
   p0: { padding: '0px' },
   text: { color: '#FFF' },
   elevation0: { boxShadow: 'none', borderRadius: 0 },
   imageContainer: { display: 'flex', flexDirection: 'row', justifyContent: 'center' },
   useDark: {
      '& .MuiTableCell-head': {
         backgroundColor: '#424242',
         borderBottom: '2px solid #7d7d7d',
         color: 'white'
      },
      '& .MuiTableCell-body': {
         backgroundColor: '#393d46',
         borderBottom: '2px solid #7d7d7d',
         color: 'white'
      },
      '& .MuiSelect-select:focus': {
         backgroundColor: 'rgba(255,255,255,.75)'
      }
   }
});

const BootstrapInput = withStyles(theme => ({
   root: { 'label + &': { marginTop: theme.spacing(3) } },
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

const tableColumns = [
   { key: '', label: 'Icono', align: 'left' },
   { key: 'ino', label: 'ID', align: 'left' },
   { key: 'name', label: 'Nombre del archivo', align: 'left' },
   { key: 'nivel', label: 'Nivel', align: 'right' },
   { key: 'ext', label: 'Extensión', align: 'right' },
   { key: 'lastChanged', label: 'Última modificación', align: 'right' },
   { key: 'size', label: 'Tamaño', align: 'right' },
   { key: 'dependency', label: 'En carpeta', align: 'right' },
   { key: '', label: 'Eliminar', align: 'right' },
];

const FilesTableContainer = ({ filesList, useTheme }) => {
   const classes = useStyles();
   console.log(filesList);
   const fileRows = () => filesList.reduce((prev, value) => {
      // if() return prev;
      const row = (
         <TableRow key={value.ino}>
            {tableColumns.map((col, i) => {
               let constent = value[col.key];
               switch (true) {
                  case !i:
                     constent = (
                        <div className={classes.imageContainer}>
                           <img style={{ width: "50%" }} src={getIcon(value.isFile, value.ext)} alt={value.ext} width="24px" />
                        </div>
                     );
                     break
                  case i === 3:
                     constent = (
                        <Select
                           labelId="select-label"
                           id={"select-" + value.ino}
                           input={<BootstrapInput />}
                           defaultValue={value.nivel}>
                           <MenuItem value={1}>1</MenuItem>
                           <MenuItem value={2}>2</MenuItem>
                           <MenuItem value={3}>3</MenuItem>
                           <MenuItem value={4}>4</MenuItem>
                           <MenuItem value={5}>5</MenuItem>
                        </Select>
                     ); break;
                  case i === 5:
                     constent = new Date(value[col.key]).toLocaleDateString('es-VE');
                     break;
                  case i === tableColumns.length - 1:
                     constent = (
                        <IconButton aria-label="delete">
                           <DeleteIcon />
                        </IconButton>
                     ); break;
               }
               return (
                  <TableCell className={!i ? classes.p0 : ''} align={col.align} key={`col-${i}`}>
                     {constent}
                  </TableCell>
               );
            })}
         </TableRow>
      );
      prev.push(row);
      return prev;
   }, []);

   const filesTable = () => (
      <Table
         stickyHeader
         className={useTheme ? classes.useDark : classes.table}
         aria-label="files table">
         <TableHead>
            <TableRow>
               {
                  tableColumns.map(({ label, align }, i) => <TableCell align={align} key={"col-" + i}>{label}</TableCell>)
               }
            </TableRow>
         </TableHead>
         <TableBody>
            {fileRows()}
         </TableBody>
      </Table>
   );

   if (!filesList) {
      const tempStyle = {
         minHeight: '100%'
         , minWidth: '100%'
         , display: 'flex'
         , justifyContent: 'center'
         , alignItems: 'center'
      };
      return (
         <div style={tempStyle}>
            <CircularProgress size={100} thickness={5} />
         </div>
      );
   }
   else if (filesList && !filesList.length) {
      return (
         <Box display="flex" width={1} textAlign="center" justifyContent="center" alignItems="center" style={{ height: '86.5vh' }}>
            <Typography className={useTheme ? classes.text : ''}>
               Cargando...
            </Typography>
         </Box>
      )
   }
   else return (
      <TableContainer className={classes.elevation0} component={Paper} color="primary">
         {filesTable()}
      </TableContainer>
   )

}

export default FilesTableContainer;