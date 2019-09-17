import React, { Component } from 'react';

class ShowFiles extends Component {

  changeNivel = (fileId, target) => {
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
        target.style.border = "2px solid #66bb6a";
        setTimeout( () => target.style.border = "1px solid #f2f2f2", 500 );
      }
    })
  }
	render(){
    const { getIcon } = this.props;
    const file = this.props.filesList.map( (value) =>
    {
      return (
        <tr key={value.id} id={`file${value.id}`} className="user-table">
          <td><img src={getIcon(value.isFile, value.ext)} alt={value.ext} width="24px"/>
          </td>
          <td><p>{value.id}</p></td>
          <td><p style={{maxWidth: "400px"}}>{ value.name }</p></td>
          <td className="number-column">
            <select className='' style={{display: 'block'}} onChange={(e) => this.changeNivel(value.id, e.target)}>
              <option value="" disabled selected>{value.nivel}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </td>
          <td className='number-column'><p className='number-column' >{value.ext}</p></td>
          <td className='number-column'><p  style={{minWidth: '110px', maxWidth:'110px', textAlign:'left'}}>{value.lastModified}</p></td>
          <td className="number-column" style={{maxWidth:'75px'}}>{value.size}</td>
          <td style={{textDecoration: "none", textAlign: "center"}} > <a href={`#file${value.dependency}`}>{value.dependency}</a> </td>
        </tr>
      )
    });
		return(
      <React.Fragment>
        <table>
          <thead>
            <tr>
              <th>Icono</th>
              <th>ID</th>
              <th>Nombre del archivo</th>
              <th className="number-column">Nivel</th>
              <th className="number-column" >Extensión</th>
              <th style={{minWidth: '110px', maxWidth:'110px'}} >Última modificación</th>
              <th className="number-column">Tamaño</th>
              <th style={{textDecoration: "none", textAlign: "center"}} >En carpeta</th>
            </tr>
          </thead>
          <tbody>
            {file}
          </tbody>
        </table>
      </React.Fragment>
    )
	}
}

export default ShowFiles;