import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import M from "materialize-css";
import { NavLink } from "react-router-dom";
class Register extends Component {
	constructor(props) {
        super(props);
        this.state = {
      registerUsername: '',
      userExist: false,
			registerNombre: '',
			registerPassword: '',
			registerPasswordTwo: '',
			pregunta1:  '1',
			respuesta1: '',
			pregunta2:  '2',
			respuesta2: '',
			Q: [{
				id: 1,
				pregunta: "Cuál es el nombre de tu mejor amigo?"
				},
				{
				  id: 2,
				  pregunta: "Cuál es la ciudad donde naciste?"
				},
				{
				  id: 3,
				  pregunta: "Cómo se llamaba tu primera mascota?"
				},
				{
				  id: 4,
				  pregunta: "Cuál es tu color favorito?"
				},
				{
				  id: 5,
				  pregunta: "Cuál es el segundo nombre de tu madre?"
				}]
        }
	}

	componentDidMount(){
		M.AutoInit();
	}
	
	onUserChange = (event) => {
        this.setState({registerUsername: event.target.value});
	}
	onNombreChange = (event) => {
        this.setState({registerNombre: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({registerPassword: event.target.value});
	}

    onPasswordTwoChange = (event) => {
		this.setState({registerPasswordTwo: event.target.value});
	}
	
	handleChange1 = ( e ) =>{
		this.setState({ pregunta1: e.target.value })
	}
	handleChange2 = ( e ) =>{
		this.setState({ pregunta2: e.target.value })
	} 
	updateRes1 = (event) => {
		this.setState({respuesta1: event.target.value});
	} 
	updateRes2 = (event) => {
		this.setState({respuesta2: event.target.value});
	} 
	handleRegister = () => {
    fetch('/api/register', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
		nombre : this.state.registerNombre,
		password : this.state.registerPassword,
		usuario: this.state.registerUsername,
		pregunta1: parseInt(this.state.pregunta1),
		pregunta2: parseInt(this.state.pregunta2),
		respuesta1: this.state.respuesta1,
		respuesta2: this.state.respuesta2
      })
    })
    .then(res => res.json() )
    .then(data =>{     
      if(data.response === 'Grant access')
      {
        localStorage.setItem("user", JSON.stringify(data.user));
        this.props.history.push('search');
        this.setState({userExist: false})
      }
      else if(data.response === 'El nombre de usuario ya existe!'){
        this.setState({userExist: true})
      }
	  else
	  {
		alert(data.response);
	  }	  
    })
    .catch(err => console.log("ERROR" ,err) );
  }

	render() {
		if(JSON.parse(localStorage.getItem('user'))) return <Redirect to='/search' />
		M.AutoInit();
		const { registerUsername, registerNombre, registerPassword, registerPasswordTwo, respuesta1, respuesta2, pregunta1, pregunta2, userExist } = this.state;
		const { onUserChange, onPasswordChange, onPasswordTwoChange, handleChange1, handleChange2 } = this; 

		const preguntas = this.state.Q.map( P => {
			console.log(P.id , P.pregunta);
			return <option value={P.id}> {P.pregunta} </option>
		});

		return(
			<div className="row center valign-wrapper" style={{backgroundColor:'rgb(57,61,70)', marginBottom:'0', height: '100%'}}>
				<div className="col s12 m10 valign" style={{margin: 'auto', float: 'none'}}>
					<div style={{marginBottom: '0px'}} className="card grey lighten-3 black-text">
						<div className="card-content">
							<span className="card-title">Registrarse</span>
							<p>Comienza a compartir archivos</p>
						</div>	
						<div className="card-action" style={{borderColor: 'gray'}}>
							<section className="row">
								<div className="row col s12 m6" style={{borderRight: '1px solid gray'}}>																	
									<div className="input-field col s12">
										<input id="username" onChange={onUserChange} type="text" className="validate"/>
										<label 
										className="tooltipped" 
										data-position="top" 
										data-tooltip="Nombre que será mostrado públicamente. No puede ser modificado." 
										htmlFor="username">
											Nombre de usuario*											
										</label>
                    <p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
                      {   userExist  ? 'El nombre de usuario ya existe.' : '' 
                      } </p>
									</div>
									<div className="input-field col s12">
										<input id="nombre" onChange={this.onNombreChange} type="text" className="validate"/>
										<label 
										className="tooltipped" 
										data-position="top" 
										data-tooltip="Nombre que solo será mostrado para el usuario y administrador" 
										htmlFor="nombre">
											Nombre y Apellido*
										</label>
									</div>
									<div className="input-field col s12">
										<input id="pass" onChange={onPasswordChange} type="password" className="validate"/>
										<label 
										className="tooltipped" 
										data-position="top" 
										data-tooltip="Debe ser mayor a cinco (5) carácteres." 
										htmlFor="pass">
											Contraseña*
										</label>
									</div>
									<div className="input-field col s12">
										<input id="passtwo" onInput={onPasswordTwoChange} type="password" className="validate"/>
										<label htmlFor="passtwo">Repetir contraseña*
										</label>
										<p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
										{	registerPasswordTwo.length > 6 ? 
											registerPasswordTwo !== registerPassword ? 'Las contraseñas no coinciden' : '' : ''}
										</p>									
									</div>
								</div>
								<div className="row col s12 m6">
									<div className="input-field col s12">
										<select id="pregunta1" value={this.state.pregunta1} onChange={handleChange1}>
											{preguntas}
										</select>
										<div>
											<input id="respuesta1" onChange={this.updateRes1} type="text"/>
											<label htmlFor="respuesta1">Respuesta #1</label>
										</div>
									</div>
									<div className="input-field col s12">
										<select id="pregunta2" value={this.state.pregunta2} onChange={handleChange2}>
											{preguntas}
										</select>
										<div>
											<input id="respuesta2" onChange={this.updateRes2} type="text"/>
											<label htmlFor="respuesta2">Respuesta #2</label>
											<p style={{fontSize: '0.8rem', color: '#B53E3E', position: 'absolute'}} className="left"> 
											{	respuesta1.length !== 0 ? 
												respuesta1 === respuesta2 ? 'Las respuestas no pueden ser iguales.' 
												: '' 
												: ''} </p>
											<p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
											{	pregunta1 === pregunta2 ? 'Las preguntas no pueden ser iguales.' : ''}
											</p>
										</div>
									</div>
								</div>
								<div className="col s12" style={{textAlign: 'center'}}>
									<button 
										disabled = {
											registerUsername.length === 0  ||
											registerNombre.length === 0 ||
											registerPasswordTwo.length < 6  || 
											respuesta1.length === 0 ||
											respuesta2.length === 0 ||
											registerPasswordTwo !== registerPassword ||
											pregunta1 === pregunta2 ||
											respuesta1 === respuesta2
										}
										className="btn waves-effect waves-light"
										name="action" 
										style={{background: 'rgb(239,113,71)', height: '55px', width: '120px', justifyContent: 'center', alignItems: 'center'}}
										onClick={this.handleRegister}
										>
										<i className="fa fa-arrow-right"></i>
									</button>
								</div>				
							</section>                    
						</div>
					</div>
					<div className="z-depth-2 underlogin" style={{padding: '10px 20px', background: 'rgb(239,113,71)'}}>
						<NavLink to="login" style={{marginRight: '0', color: '#eee'}}>
							Ya tienes cuenta? Inicia Sesión!
						</NavLink>
						<div style={{clear: 'both'}}></div>
					</div>
				</div>
			</div>
		)
	}
}

export default Register;