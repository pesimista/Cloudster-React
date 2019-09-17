import React, { Component } from 'react';

class ShowUsers extends Component {
	render(){
    const users = this.props.usersList.map( (value) =>
    {
      return (
        <tr key={value.id} className="user-table">
          <td><p>{value.id}</p></td>
          <td><input onChange={(e) => console.log(e.target.value)} type="text" value={value.usuario}/></td>
          <td className="number-column">
            <select className='' style={{display: 'block'}} >
              <option value="" disabled selected>{value.nivel}</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </td>
          <td><p className='number-column' style={{minWidth: '110px', maxWidth:'110px'}}>{value.desde}</p></td>
          <td>{value.nombre}</td>
          <td>********</td>
          <td><button onClick={() => console.log(value)}>
            <i className={`fa fa-save`} style={{fontSize: '26px', color: '#424242'}}></i>
          </button></td>
        </tr>
      )
    });
		return(
      <div className="">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de usuaio</th>
              <th className="number-column">Nivel</th>
              <th style={{textAlign: 'left',minWidth: '110px', maxWidth:'110px'}} >Desde</th>
              <th>Nombre</th>
              <th>Password</th>
              <th>Guardar</th>
            </tr>
          </thead>
          <tbody>
            {users}
          </tbody>
        </table>
			</div>
			)
	}
}

export default ShowUsers;