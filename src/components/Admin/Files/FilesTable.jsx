import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import { getIcon, handleFetch } from '../../SF/helpers';
import {
  SelectCell,
  TableHeader,
  useStyles,
  ConfirmDialog,
} from '../tableStyles';
import CloudQueueIcon from '@material-ui/icons/CloudQueue';
import CloudOffIcon from '@material-ui/icons/CloudOff';

const tableColumns = [
  { key: 'image', label: 'Icono', align: 'left' },
  { key: 'ino', label: 'ID', align: 'left' },
  { key: 'name', label: 'Nombre del archivo', align: 'left' },
  { key: 'nivel', label: 'Nivel', align: 'right' },
  { key: 'lastModified', label: 'Última modificación', align: 'right' },
  { key: 'size', label: 'Tamaño', align: 'right' },
  { key: 'dependency', label: 'En carpeta', align: 'right' },
  { key: '', label: '', align: 'right' },
];

const initialState = {
  fileList: null,
  shouldUpdate: false,
  fileToSuspend: null,
};

/** Reset type */
const reducer = (state, action) => {
  return {
    ...initialState,
    fileList: state.fileList,
    ...action,
  };
};

const FilesTableContainer = ({
  useTheme,
  onResponse,
  loadingComponent,
  criteria,
}) => {
  const classes = useStyles();

  const [state, setState] = React.useReducer(reducer, {
    ...initialState,
    shouldUpdate: true,
  });
  const { fileList, shouldUpdate } = state;

  React.useEffect(() => {
    if (!shouldUpdate) {
      return;
    }
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };
    setState({ shouldUpdate: false });
    fetch(`/api/admin/files`, headers)
      .then(handleFetch)
      .then((files) => {
        files = files.map((file, index) => ({
          ...file,
          updating: false,
          index,
        }));
        setState({ fileList: files });
      })
      .catch((mistake) => {
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: mistake.message,
        });
      });
  }, [shouldUpdate, onResponse]);

  if (!fileList) {
    return loadingComponent;
  }

  const setUpdate = (index, value = true) => {
    const files = [...fileList];
    files[index].updating = value;
    setState({ fileList: files });
  };

  const toggleSuspend = (index) => {
    const files = [...fileList];
    files[index].available = +!files[index].available;
    files[index].updating = false;
    setState({ fileList: files });
  };

  const handleLevelChage = ({ name, value }, index) => {
    setUpdate(index);
    const headers = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
      body: JSON.stringify({ nivel: value }),
    };

    fetch(`/api/files/${name}`, headers)
      .then(handleFetch)
      .then((res) => {
        setState({ shouldUpdate: true });
        onResponse({
          key: new Date().getTime(),
          type: 'success',
          message: res.message,
        });
      })
      .catch((err) => {
        setState({ shouldUpdate: true });
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: err.response,
        });
      });
  };

  const handleSuspend = (closeEvent) => {
    if (!closeEvent) {
      setState({ fileToSuspend: null });
      return;
    }
    const file = { ...state.fileToSuspend };
    setUpdate(state.fileToSuspend.index);

    const headers = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };

    fetch(`/api/files/${file.ino}`, headers)
      .then(handleFetch)
      .then((res) => {
        toggleSuspend(file.index);
        onResponse({
          key: new Date().getTime(),
          type: 'success',
          message: res.message,
        });
      })
      .catch((err) => {
        setUpdate(state.fileToSuspend.index, false);
        onResponse({
          key: new Date().getTime(),
          type: 'error',
          message: err.response,
        });
      });
  };

  const setSuspend = (file) => {
    setState({ fileToSuspend: { ...file } });
  };

  const confirmText = () => {
    if (!state.fileToSuspend) {
      return '';
    }
    if (state.fileToSuspend.available) {
      return `¿Seguro deseas dar de baja ${state.fileToSuspend.name}?`;
    }
    return `¿Seguro deseas restaurar ${state.fileToSuspend.name}?`;
  };

  return (
    <React.Fragment>
      <TableContainer
        className={classes.elevation0}
        component={Paper}
        color="primary"
      >
        <Table stickyHeader className={useTheme ? classes.dark : classes.table}>
          <TableHeader columns={tableColumns} />
          <TableContent
            classes={classes}
            data={fileList}
            onChangeSelect={handleLevelChage}
            onClickTrash={setSuspend}
            criteria={criteria}
            key="12gey12"
          />
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={state.fileToSuspend}
        handleClose={handleSuspend}
        theme={useTheme}
        text={confirmText()}
      />
    </React.Fragment>
  );
};

export default FilesTableContainer;

const TableContent = ({
  classes,
  data,
  onChangeSelect,
  onClickTrash,
  criteria = '',
}) => {
  const regex = new RegExp(criteria, 'ig');
  const rows = data.reduce((collection, value) => {
    if (criteria && !value.name.match(regex)) {
      return collection;
    }
    const cells = tableColumns.map((col, i) => {
      let constent = value[col.key];
      switch (col.key) {
        case 'name': 
          constent = value.name + (!value.ext && value.ext!=='~' ? `.${value.ext}` : '');
          break;
        case 'image':
          constent = (
            <ImageCell value={value} className={classes.imageContainer} />
          );
          break;
        case 'nivel':
          constent = (
            <SelectCell
              nivel={value.nivel}
              identifier={value.ino.toString()}
              disabled={value.updating}
              onChange={(target) => onChangeSelect(target, value.index)}
            />
          );
          break;
        case 'lastModified':
          constent = new Date(value[col.key] || value.birthtime).toLocaleString(
            'es-VE'
          );
          break;
        case '': {
          const title = value.available ? 'Dar de baja' : 'Restaurar';
          constent = (
            <Tooltip title={title}>
              <span>
                <IconButton
                  disabled={value.updating}
                  aria-label="delete"
                  onClick={() => onClickTrash(value, value.index)}
                >
                  {value.available ? <CloudQueueIcon /> : <CloudOffIcon />}
                </IconButton>
              </span>
            </Tooltip>
          );
          break;
        }
        default:
          break;
      }
      const component = col.key === 'name' ? 'th' : 'td';
      return (
        <TableCell
          component={component}
          scope="row"
          className={!i || col.key === 'nivel' ? classes.p0 : ''}
          align={col.align}
          key={`col-${i}`}
        >
          {constent}
        </TableCell>
      );
    });

    const rowClass = () => {
      switch (true) {
        case value.updating:
          return 'disabled';
        case !value.available:
          return 'suspended';
        default:
          return '';
      }
    };

    const row = (
      <TableRow className={rowClass()} key={value.ino}>
        {cells}
      </TableRow>
    );
    return [...collection, row];
  }, []);
  return <TableBody>{rows}</TableBody>;
};

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
