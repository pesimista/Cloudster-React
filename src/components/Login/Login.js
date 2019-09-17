import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { NavLink, withRouter } from "react-router-dom";
import M from "materialize-css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signInUser: '',
      signInPassword: '',
      wrong: 'grant',
      block: false
    }
  }
  componentDidMount(){
		M.AutoInit();
	}

  handleLogin = () => {
    fetch('/api/login', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        nombre: this.state.signInUser,
        usuario: this.state.signInUser,
        password: this.state.signInPassword
      })
    })
    .then(res => res.json() )
    .then(data =>{    
      this.onTry(data.response); 
      if(data.response === 'Grant access')
      {
        localStorage.setItem("user", JSON.stringify(data.user));
        this.props.history.push('search');
      }
      else if(data.response === 'Contraseña incorrecta')
      {
        
      }
      else{
        console.log("reason 2: " , data.response);
      }
    })
    .catch(err => console.log("ERROR" ,err) );
  }
  
  onUserChange = (event) => {
    this.setState({signInUser: event.target.value});
  }

  onPasswordChange = (event) => {
    this.setState({signInPassword: event.target.value});
  }

  onTry = (response) => {
    if(response === 'Grant access')
    {
      this.setState({wrong: 'grant'});
    }
    else if(response === 'Contraseña incorrecta!')
    {
      this.setState({wrong: 'ci'});
    }
    else if(response === 'Bloqueado por multiples intentos fallidos')
    {
      this.setState({block: true});
      this.setState({wrong: 'grant'});
    }
    else{
      this.setState({wrong: 'un'});
    }
  }

  render(){
    M.AutoInit();
    if(JSON.parse(localStorage.getItem('user'))) return <Redirect to='/search' />
    const { wrong, block, signInUser, signInPassword } = this.state;
	  return(
			<div className="row center valign-wrapper" style={{height: '100%', marginBottom:'0',backgroundColor:'rgb(57,61,70)'}}>
    		<div className="col s10 m6 l4 valign" style={{margin: 'auto',float: 'none'}}>
       		<div style={{marginBottom: '0'}} className="card grey lighten-3 black-text">
        		<div className="card-content">
            	<span className="card-title">{this.state.message || 'Inicia Sesión'}</span>
            	<p>Comienza a compartir archivos</p>
          	</div>
          	<div className="card-action" style={{borderColor: 'gray'}}>
            	<section className="row valign-wrapper">
              	<div className="col s10 ">
                	<div className="row">
                  	<div className="input-field col s12">
                      <input 
                      disabled = {
                        block
                      }
                      id="user" 
                      type="text" 
                      onChange={this.onUserChange}
                      />
                      <label htmlFor="user">Nombre de usuario</label>
                      <p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
                      {   wrong === 'grant' ? '' 
                        : wrong === 'ci' ? ''
                        : 'El usuario no existe'
                      } </p>
                     	</div>
                  </div>
                  <div className="row" style={{marginBottom:'0'}}>
                    <div className="input-field col s12">
                      <input 
                      disabled = {
                        block
                      }
                      id="password" 
                      type="password" 
                      onChange={this.onPasswordChange}
                      />
                      <label  
                      className="tooltipped" 
                      data-position="top" 
                      data-tooltip="Debe ser mayor a cinco (5) carácteres." 
                      htmlFor="password">Password</label>
                      <p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
                      {   wrong === 'grant' ? '' 
                        : wrong === 'ci' ? 'Contraseña incorrecta'
                        : ''
                      } </p>
                      <p style={{fontSize: '0.8rem', color: '#B53E3E'}} className="left"> 
                      {   block ? 'Has sido bloqueado debido a múltiples intentos fallidos. Por favor haz click en olvidé mi contraseña.' 
                        : ''
                      } </p>
                    </div>
                  </div>
                </div>
                <div className="col s2">
                  <button
                   disabled = {
                     block ||
                     signInUser.length === 0 || 
                     signInPassword.length < 6
                   }
                   onClick={this.handleLogin}
                   className="btn waves-effect waves-light" style={{background: 'rgb(239,113,71)', height: '120px', width: '55px'}}>
                    <i className="fa fa-arrow-right"></i>
                  </button>
                </div>
              </section>          
            </div>
          </div>
          <div className="z-depth-2 underlogin" style={{padding: '10px 20px', background: 'rgb(239,113,71)'}}>
            <NavLink to="/recover" className="left"  style={{color: '#eee'}}>Olvide mi contraseña</NavLink>
            <NavLink to="/register" className="right" style={{color: '#eee'}}>Registrate!</NavLink>
            <div style={{clear: 'both'}}></div>
          </div>
        </div>
      </div> 
	   )
  }
}

export default withRouter(Login);