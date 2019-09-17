import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import M from "materialize-css";

class ProfileSettings extends Component {
	constructor(props) {
        super(props);
        this.state = {
			changeNombre: '',
			changePassword: '',
			changePasswordTwo: '',
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
	handleUpdateUser = () => {
		fetch('http://localhost:6969/api/update', {
		  method: 'post',
		  headers: {'Content-Type': 'application/json'},
		  body: JSON.stringify({
			id : this.props.user.id,
			nombre : this.state.changeNombre,
			password : this.state.changePassword,
			pregunta1: parseInt(this.state.pregunta1),
			pregunta2: parseInt(this.state.pregunta2),
			respuesta1: this.state.respuesta1,
			respuesta2: this.state.respuesta2,
			confirmpassword: this.state.changePasswordTwo
		  })
		})
		.then(res => res.json() )
		.then(data =>{     
		  if(data.response === 'Grant access')
		  {
			localStorage.setItem("user", JSON.stringify(data.user));
			this.props.history.push('search');
		  }
		  else
		  {
			alert(data.response);
		  }	  
		})
		.catch(err => console.log("ERROR" ,err) );
	  }
	componentDidMount(){
	let elems = document.querySelectorAll('select');  
	let tool = document.querySelectorAll('.tooltipped');
	M.FormSelect.init(elems);
	M.Tooltip.init(tool);
	M.AutoInit();
	}
	onNombreChange = (event) => {
        this.setState({changeNombre: event.target.value});
    }

    onPasswordChange = (event) => {
        this.setState({changePassword: event.target.value});
	}

    onPasswordTwoChange = (event) => {
		this.setState({changePasswordTwo: event.target.value});
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
	render(){
		let tool = document.querySelectorAll('.tooltipped');
		M.Tooltip.init(tool);
		M.AutoInit();
	const {  onPasswordChange, onPasswordTwoChange, handleChange1, handleChange2, updateRes1, updateRes2 } = this; 
	const { respuesta1, respuesta2, pregunta1, pregunta2, changePassword, changePasswordTwo } = this.state;
	const { nombre } = this.props.user;

	const preguntas = this.state.Q.map( P => {
		console.log(P.id , P.pregunta);
		return <option value={P.id}> {P.pregunta} </option>
	});

  	if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />
	return(	
		<div className="row center valign-wrapper" style={{ marginBottom: "0",backgroundColor:'rgb(57,61,70)'}}>
		  <div className="col s12 m6" style={{margin: 'auto'}}>
			<div style={{marginBottom: '0px'}} className="card grey lighten-3 black-text">
				<div className="card-content" style={{padding: '6px'}}>
					<span className="card-title" style={{margin: '0'}}>Público</span>
				</div>
				<div className="card-action" style={{borderColor: 'gray'}}>
					<section className="row valign-wrapper" style={{margin: '0', borderBottom: '1px solid rgba(160,160,160,0.2)'}}>
					<div className="col s12">
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<input placeholder={nombre} id="name" type="text" className="validate" onChange={this.onNombreChange}/>
							<label className="active" for="name">Nombre y Apellido*</label>
						</div>
						</div>
					</div>
					</section>					
				</div>
				<div className="card-content" style={{padding: '6px'}}>
					<span className="card-title" style={{margin: '0'}}>Privado</span>
				</div>
				<div id="priv-card" className="card-action" style={{borderColor: 'gray'}}>
					<section className="row valign-wrapper" style={{margin: '0'}}>
					<div className="col s12">
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<input placeholder="********" id="password" type="password" className="validate" onChange={onPasswordChange}/>
							<label 
							className="tooltipped active" 
							data-position="top" 
							data-tooltip="Nueva contraseña. No puede ser igual a la anterior. Debe ser mayor a cinco (5) carácteres." 
							for="password">
								Nueva contraseña*
							</label>
						</div>
						</div>
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<select className="col s10 input-field" id="pregunta1" value={this.state.pregunta1} onChange={handleChange1}>
								{preguntas}
							</select>
						</div>
						</div>
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<input id="respuesta1" onChange={updateRes1} type="text"/>
							<label htmlFor="respuesta1">Respuesta #1</label>
						</div>
						</div>
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<select className="col s10 input-field" id="pregunta2" value={this.state.pregunta2} onChange={handleChange2}>
								{preguntas}
							</select>
						</div>
						</div>
						<div className="row valign-wrapper">
						<div className="input-field col s12">
							<input id="respuesta2" onChange={updateRes2} type="text"/>
							<label htmlFor="respuesta2">Respuesta #2</label>
							<p style={{fontSize: '0.8rem', color: '#B53E3E', position: 'absolute'}} className="left"> 
							{	respuesta1.length !== 0 ? 
								respuesta1 === respuesta2 ? 'Las respuestas no pueden ser iguales.' 
								: '' 
								: ''} </p>
							<p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="right"> 
							{	pregunta1 === pregunta2 ? 'Las preguntas no pueden ser iguales.' : ''}
							</p>
						</div>
						</div>
					</div>
					</section>
				</div>	
				<div className="card-action">
					<section className="row valign-wrapper" style={{margin: '0'}}>
						<div className="col s12">
							<div className="row valign-wrapper">
								<div className="input-field col s12">
									<input 
									placeholder="********" 
									id="password2" 
									type="password" 
									className="validate" 
									onChange={onPasswordTwoChange}/>
									<label 
									className="tooltipped active" 
									data-position="top" 
									data-tooltip="Contraseña actual."
									for="password2">
										Confirmar contraseña*
									</label>
									<p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="right"> 
									{	changePassword.length > 0 ? changePassword === changePasswordTwo ? 'La nueva contraseña no puede ser igual a la anterior.' : '' : ''}
									</p>
								</div>
							</div>
							<div className="row valign-wrapper">
								<button 
									disabled = {
										(changePassword.length > 0 && changePassword.length < 6) ||
                    changePassword === changePasswordTwo ||
										changePasswordTwo.length < 6 ||
										pregunta1 === pregunta2 ||
										((respuesta1 === respuesta2) && respuesta1.length > 0 )
									}
									onClick={this.handleUpdateUser}
									className="col s3 m12 btn">
									Guardar Cambios
								</button>
							</div>
						</div>			
					</section>	
				</div>						 			  
			</div>
		  </div>
		</div>	  
	)
	}
}

export default ProfileSettings;