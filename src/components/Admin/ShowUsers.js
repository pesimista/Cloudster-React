import React, { Component } from 'react';

class ShowUsers extends Component {

  changeNivel = (fileId, target) => {
    fetch(`/api/update/usuario?nivel=true`, {
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

  delete = (userid, nivel) => {
    if(userid !== this.props.user.id && nivel<5 )
    {
      fetch(`/api/users/${userid}`, {
        method: 'delete'
      }).then( res => res.json() )
      .then( data => {
        if(data.response ===  "oll korrect")
        {
          this.props.fetchUsers();
          alert(`Se elimino a ${data.usuario}`)
        }
      })
    }
    else if(nivel === 5)
    {
      alert('No puedes eliminar a otro administrados');
    }
    else{
      alert('No puedes eliminar tu propio usuario');
    }
  }

	render(){
    const users = this.props.usersList.map( (value) =>
    {
      return (
        <tr key={value.id} className="user-table">
          <td><p>{value.id}</p></td>
          <td><p>{value.usuario}</p></td>
          <td className="number-column">
            <select className='' style={{display: 'block'}}  onChange={(e) => this.changeNivel(value.id, e.target)}>
              <option value="1" selected={value.nivel===1}>1</option>
              <option value="2" selected={value.nivel===2}>2</option>
              <option value="3" selected={value.nivel===3}>3</option>
              <option value="4" selected={value.nivel===4}>4</option>
              <option value="5" selected={value.nivel===5}>5</option>
            </select>
          </td>
          <td><p className='number-column' style={{minWidth: '110px', maxWidth:'110px'}}>{value.desde}</p></td>
          <td>{value.nombre}</td>
          <td><button onClick={() =>this.delete(value.id, value.nivel)}>
            <i className={`fa fa-ban red-hover`} style={{fontSize: '26px', color: '#424242'}}></i>
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
              <th>Eliminar</th>
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