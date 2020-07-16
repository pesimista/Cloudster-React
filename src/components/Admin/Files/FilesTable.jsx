import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import { getIcon, handleFetch } from '../../SF/helpers';
import { SelectCell, TableHeader, useStyles } from '../tableStyles';

const tableColumns = [
  { key: 'image', label: 'Icono', align: 'left' },
  { key: 'ino', label: 'ID', align: 'left' },
  { key: 'name', label: 'Nombre del archivo', align: 'left' },
  { key: 'nivel', label: 'Nivel', align: 'right' },
  { key: 'lastChanged', label: 'Última modificación', align: 'right' },
  { key: 'size', label: 'Tamaño', align: 'right' },
  { key: 'dependency', label: 'En carpeta', align: 'right' },
  { key: '', label: '', align: 'right' },
];

const initialState = {
  fileList: null,
  shouldUpdate: true,
};

const FilesTableContainer = ({ useTheme }) => {
  const classes = useStyles();

  const [{ filesList, shouldUpdate }, setState] = React.useState(initialState);

  React.useEffect(() => {
    if (!shouldUpdate) {
      return;
    }
    fetch(`/api/admin/files`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    })
      .then(handleFetch)
      .then((files) => setState({ shouldUpdate: false, filesList: files }))
      .catch((mistake) => alert('salio mal' + mistake.message));
  }, [shouldUpdate]);

  if (!filesList) {
    const tempStyle = {
      minHeight: '100%',
      minWidth: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    };
    return (
      <div style={tempStyle}>
        <CircularProgress size={100} thickness={5} />
      </div>
    );
  }

  return (
    <TableContainer
      className={classes.elevation0}
      component={Paper}
      color="primary"
    >
      <Table stickyHeader className={useTheme ? classes.dark : classes.table}>
        <TableHeader columns={tableColumns} />
        <TableBody>
          <TableRows classes={classes} data={filesList} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FilesTableContainer;

const TableRows = ({ classes, data }) =>
  data.map((value) => {
    const cells = tableColumns.map((col, i) => {
      let constent = value[col.key];
      switch (col.key) {
        case 'image':
          constent = (
            <ImageCell value={value} className={classes.imageContainer} />
          );
          break;
        case 'nivel':
          constent = <SelectCell nivel={value.nivel} identifier={value.ino} />;
          break;
        case 'lastChanged':
          constent = new Date(value[col.key]).toLocaleString('es-VE');
          break;
        case '':
          constent = (
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          );
          break;
        default:
          break;
      }
      return (
        <TableCell
          component={col.key === 'name' ? 'th' : 'td'}
          scope="row"
          className={!i || col.key === 'nivel' ? classes.p0 : ''}
          align={col.align}
          key={`col-${i}`}
        >
          {constent}
        </TableCell>
      );
    });

    return <TableRow key={value.ino}>{cells}</TableRow>;
  }, []);

const ImageCell = ({ value, className }) => {
  return (
    <div className={className}>
      <img
        src={getIcon(value.isFile, value.ext)}
        alt={value.ext}
        width="24px"
      />
    </div>
  );
};
