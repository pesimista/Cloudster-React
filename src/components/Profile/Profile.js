import React, { Component } from 'react';
import { NavLink, Redirect } from "react-router-dom";

class Profile extends Component {
  componentDidMount(){
	this.props.modifyBar('c');
  }
  render(){
    if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />
    const { nombre, nivel, email, desde, usuario } = this.props.user;
  	return(
  		<div className="row center valign-wrapper" style={{marginBottom: "0", height: '95.8%',backgroundColor:'rgb(57,61,70)'}}>
    			<div className="col s8 m6 l5 valign" style={{margin: "auto",float: 'none'}}>
      			<div className="card">
        				<div className="card-content" style={{padding: "6px"}}>
          				<span className="card-title" >Perfil</span>
        				</div>
            			<div className="card-action">
             				<div className="row">
                				<div className="col s12 center" >
                  				<h3 style={{marginTop: "0px"}}>
                            {usuario}
                          </h3>
                  				<h3>
                  					<span style={{padding: "0px 18px", border: "4px solid " + (nivel === 5 ? 'rgb(255,167,38)' : "#66bb6a"), borderRadius:"50%"}}>
                            {nivel}
                            </span>
                  				</h3>
                  				<span>Nivel de jerarquía</span>
								          {nivel === 5 ? <h5> ADMIN </h5> : ''}
                  				<hr style={{margin: "10px 0px 30px 0px", color: ' ' + (nivel === 5 ? 'rgb(255,167,38)' : "#66bb6a")}}/>
                  				<h5>
                            {nombre}    
                          </h5>
                  				<span>
                            {email}
                          </span> 
                  				<br/>
                  				<span>
                            Miembro desde: {desde}
                          </span>
                          <hr style={{margin: "30px 0px", color: (nivel === 5 ? 'rgb(255,167,38)' : "#66bb6a")}}/>
                          <NavLink style={{marginLeft: '20px'}} to='profilesettings'><button className="btn waves-effect waves-light">Configuración</button></NavLink>
                				</div>
              			</div>
            			</div>
      			</div>
   		 	</div>
  		</div>     		
  	)
  }
}

export default Profile;