import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  report: {
    width: '100%',
    '& .MuiCard-root': {
      margin: '1rem'
    },
    '& .MuiCardContent-root': {
      padding: 0
    },
    '& .MuiList-root': {
      backgroundColor: 'transparent !important',
      boxShadow: 'none'
    },
    '& .MuiGrid-root': {
      padding: 10
    }
  }
}));

const options = [
  {
    url: 'files/report',
    filename: 'reporte_archivos',
    index: 1
  },
  {
    url: 'files/downloaded', 
    filename: 'reporte_descargas', 
    index: 2
  },
  {
    url: 'files/read', 
    filename: 'reporte_solicitudes', 
    index: 3
  },
  {
    url: 'users/activity', 
    filename: 'reporte_logs', 
    index:4
  },
]

const Reports = () => {
  const classes = useStyles()
  const [selected, select] = React.useState(0);

  const generateFile = ({url, filename, index}) => {
    if (selected) {
      return;
    }
    select(index);
    const headers = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('token'),
      },
    };

    fetch(`/api/admin/${url}`, headers)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.pdf`;
        document.body.appendChild(a);
        // we need to append the element to the dom -> otherwise it will not work in firefox
        a.click();
        a.remove();
        select(0);
        //afterwards we remove the element again         
      });
  }

  const spinner = () => {
    if (!selected) {
      return '';
    }
    return (
      <Grid
        container
        justify='center'
        alignItems='center'
      >
        <CircularProgress size={40} thickness={5} />
      </Grid>
    )
  }

  return (
    <Box
      textAlign='center'
      display='flex'
      justifyContent='center'
      alignItems='center'
      className={`${classes.report} min-h100`}
    >
      <Card>
        <CardContent>
          <List
            subheader={
              <ListSubheader component='div' id='subheader'>
                Reportes
              </ListSubheader>
            }
          >
            <ListItem
              button
              selected={selected===1}
              onClick={() => generateFile(options[0])}
            >
              <ListItemText
                primary='Reporte de archivos'
                secondary={'Resumen de todos los archivos en el servidor, quien los subió y cuando'}
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={selected===2}
              onClick={() => generateFile(options[1])}
            >
              <ListItemText
                primary='Historial de descargas'
                secondary={'Registro de todas las descargas solicitadas por usuarios'}
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={selected===3}
              onClick={() => generateFile(options[2])}
            >
              <ListItemText
                primary='Historial de solicitudes'
                secondary={'Registro de las solicitudes de archivos por parte de los usuarios'}
              />
            </ListItem>
            <Divider />
            <ListItem
              button
              selected={selected===4}
              onClick={() => generateFile(options[3])}
            >
              <ListItemText
                primary='Logs'
                secondary={'Detalles de los ingresos al sistema'}
              />
            </ListItem>
            <Divider />
          </List>
          {spinner()}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Reports;