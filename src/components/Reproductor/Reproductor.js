import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Reproductor extends Component {
  componentDidMount(){
	this.props.modifyBar('c');
  }
  render(){
	if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />
	const {idRep} = this.props;
	if(idRep)
	{
		return(
			<main  className="main col s12 row" style={{position: 'relative', backgroundColor: 'rgb(127,127,127)',height: '95%', marginBottom: '0px', padding: '0px'}}>
				<iframe  style={{width: '100%', height: '100%'}} src={`http://${this.props.ip}:6969/api/files/${idRep}`} title="Reproductor"></iframe>
			</main>
		)
	} else 
	{
		return(
			<div className="row center valign-wrapper" style={{height: '95.8%', marginBottom:'0',backgroundColor:'rgb(57,61,70)'}}>
				<div className="col s12 m4 valign" style={{margin: 'auto',float: 'none'}}>
					<div style={{marginBottom: '0'}} className="card grey lighten-3 black-text">
						<div className="card-content">
							<span className="card-title">Aún no hay nada para visualizar!</span>
							<p>Te invitamos a seleccionar un archivo de la pantalla de búsqueda.</p>
						</div>
					</div>
				</div>
			</div> 
		)
		}
	}
	
}

export default Reproductor;