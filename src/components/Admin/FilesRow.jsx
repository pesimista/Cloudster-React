import React, { Component } from 'react';

class FilesRow extends Component {
  constructor()
  {
    super();
    this.state = {
      id:  this.props.file.id,
      isFile: this.props.file.isFile ,
      ext: this.props.file.ext ,
      nombre: this.props.file.nombre ,
      nivel: this.props.file.nivel ,
      lastModified: this.props.file.lastModified ,
      dependency: this.props.file.dependency ,
      size: this.props.file.size
    }
  }
  onChangeNivel = (nivel) => 
  {
    this.setState({nivel: nivel});
  }
  render()
  {
    const { id, isFile, ext, nombre, nivel, lastModified, dependency, size } = this.state;
    const { getIcon } = this.props;
    return (
      <tr key={id} id={`file${id}`} className="user-table">
        <td><img src={getIcon(isFile, ext)} alt={ext} width="24px"/>
        </td>
        <td><p>{id}</p></td>
        <td><input onChange={(e) => console.log(e.target.value)} type="text" value={nombre.length > 25 ? nombre.substring(0,20) + '...' + ext : nombre }/></td>
        <td className="number-column">
          <select className='' style={{display: 'block'}}>
            <option value="" disabled selected>{nivel}</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </td>
        <td className='number-column'><p className='number-column' >{ext}</p></td>
        <td className='number-column'><p  style={{minWidth: '110px', maxWidth:'110px', textAlign:'left'}}>{lastModified}</p></td>
        <td className="number-column" style={{maxWidth:'75px'}}>{size}</td>
        <td style={{textDecoration: "none", textAlign: "center"}} > <a href={`#file${dependency}`}>{dependency}</a> </td>
        <td><button onClick={() => console.log(nombre ,nivel)}>
          <i className={`fa fa-save`} style={{fontSize: '26px', color: '#424242'}}></i>
        </button></td>
      </tr>
    )
  }
}

export default FilesRow;