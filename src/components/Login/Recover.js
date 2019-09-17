import React, { Component } from 'react';
import { NavLink, withRouter } from "react-router-dom";

class Recover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario:   '',
      phase: 0,
      pregunta1:  '',
      respuesta1: '',
      pregunta2:  '',
      respuesta2: '',
      password: '',
			passwordTwo: ''
    }
  }
  onUserChange = (event) => {
    this.setState({usuario: event.target.value});
  } 
  updateRes1 = (event) => {
    this.setState({respuesta1: event.target.value});
  } 
  updateRes2 = (event) => {
    this.setState({respuesta2: event.target.value});
  } 
  onPasswordChange = (event) => {
    this.setState({password: event.target.value});
	}
  onPasswordTwoChange = (event) => {
		this.setState({passwordTwo: event.target.value});
  }

  handleUsername = ( e ) => {
    fetch(`http://localhost:6969/api/questions/${this.state.usuario}`, {
    })
    .then(res => res.json())
    .then( data => {
      this.setState({
        phase: 1,
        pregunta1: data.user.pregunta1,
        pregunta2: data.user.pregunta2
      })
    })
    .catch(e => console.log(e) );
  }
  handleQuestions = ( e ) =>{
    // console.log(this.state);
    fetch('http://localhost:6969/api/checkQuestions', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        usuario: this.state.usuario,
        respuesta1: this.state.respuesta1,
        respuesta2: this.state.respuesta2
      })
    })
    .then(res => res.json() )
    .then(data =>{    
      console.log(data.response);
      if(data.response === 'Grant access')
      {
        this.setState({phase: 2});
      }
    })
    .catch(err => console.log("ERROR" ,err) );
  }
  changePassword = (e) =>
  {
    if(this.state.password === this.state.passwordTwo)
    {
      fetch('http://localhost:6969/api/password', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        type: 'cors',
        body: JSON.stringify({
          usuario: this.state.usuario,
          password: this.state.password,
          withUser: true
        })
      })
      .then(res => res.json() )
      .then(data =>{    
        console.log(data.response);
        if( data.response.endsWith('exitosa') )
        {
          console.log(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          alert(data.response);
          this.props.history.push('search');
        }
      })
      .catch(err => console.log("ERROR" ,err) );
    }
  }

  usernameField = (
  <React.Fragment>
    <div className="col s12 ">
      <div className="row">
        <div className="input-field col s12">
          <input id="user" type="text" onChange={this.onUserChange}/>
          <label htmlFor="user">Nombre de usuario</label>
        </div>
      </div>
    </div>
    <div className="col s12" style={{textAlign: 'center'}}>
      <button
        onClick={this.handleUsername}
        className="btn waves-effect waves-light" style={{background: 'rgb(239,113,71)', height: '55px', width: '120px'}}>
        <i className="fa fa-arrow-right"></i>
      </button>
    </div>
  </React.Fragment>)

  render(){
		return(
      <div className="row center valign-wrapper" style={{height: '100%', marginBottom:'0', backgroundColor:'rgb(57,61,70)'}}>
        <div className="col s10 m8 l3 valign" style={{margin: 'auto',float: 'none'}}>
          <div style={{marginBottom: '0'}} className="card grey lighten-3 black-text">
            <div className="card-content">
              <span className="card-title">Recuperar contraseña</span>
              <p>Comienza a compartir archivos</p>
            </div>
            <div className="card-action" style={{borderColor: 'gray'}}>
              <section className="row">
                {(this.state.phase === 0)? this.usernameField :
                (this.state.phase===1)? <React.Fragment>
                  <div className="col s12 row">
                    <div className="input-field col s12">
                      <input id="pregunta1" type="text" onChange={this.updateRes1}/>
                      <label htmlFor="pregunta1">{this.state.pregunta1}</label>
                    </div>
                    <div className="input-field col s12">
                      <input id="pregunta2" type="text" onChange={this.updateRes2}/>
                      <label htmlFor="pregunta2">{this.state.pregunta2}</label>
                    </div>
                  </div>
                  <div className="col s12" style={{textAlign: 'center'}}>
                    <button
                      onClick={this.handleQuestions}
                      className="btn waves-effect waves-light" style={{background: 'rgb(239,113,71)', height: '55px', width: '120px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </React.Fragment> :

                <React.Fragment>
                  <div className="col s12 row">
                    <div className="row">
                      <div className="input-field col s12">
                        <input id="pass" onChange={this.onPasswordChange} type="password" className="validate"/>
                        <label htmlFor="pass">Nueva Contraseña</label>
                      </div>
                    </div>
                    <div className="row">
                      <div className="input-field col s12">
                        <input id="passtwo" onChange={this.onPasswordTwoChange} type="password" className="validate"/>
                        <label htmlFor="passtwo">Repita la nueva contraseña</label>
                        <p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> { 
                          this.state.password !== this.state.passwordTwo ? 'Las contraseñas no coinciden' : ''} 
                        </p>
                      </div>
                    </div>  
                    <button
                      onClick={this.changePassword}
                      className="btn waves-effect waves-light" style={{background: 'rgb(239,113,71)', height: '55px', width: '120px'}}>
                      <i className="fa fa-arrow-right"></i>
                    </button>
                  </div>
                </React.Fragment>
                }
              </section>          
            </div>
          </div>
          <div className="z-depth-2 underlogin" style={{padding: '10px 20px', background: 'rgb(239,113,71)'}}>
            <NavLink to="/Login" className="left"  style={{color: '#eee'}}>Inicia sesión!</NavLink>
            <NavLink to="/register" className="right" style={{color: '#eee'}}>Registrate!</NavLink>
            <div style={{clear: 'both'}}></div>
          </div>
        </div>
      </div> 
      )
  }
}

export default withRouter( Recover );