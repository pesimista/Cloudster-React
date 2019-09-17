import React from 'react';
import { NavLink } from "react-router-dom";


const plsLog = () => {
	return(
		<div className="row center valign-wrapper" style={{height: '100%', marginBottom:'0',backgroundColor:'rgb(57,61,70)'}}>
    		<div className="col s12 m4 valign" style={{margin: 'auto',float: 'none'}}>
       			<div style={{marginBottom: '0'}} className="card grey lighten-3 black-text">
            		<div className="card-content">
                    	<span className="card-title">Lo sentimos!</span>
                    	<p style={{marginBottom: '5px'}}> Debes iniciar sesión para visitar esta página.</p>
						<div className="card-action">
							<NavLink style={{color: 'rgb(255,167,38)', marginRight: '30px'}} to='login'>Iniciar Sesión</NavLink>
                        	<NavLink style={{color: 'rgb(255,167,38)'}} to='register'>Registrarse</NavLink>
						</div>
                        
                	</div>
				</div>
			</div>
        </div> 
	)
}

export default plsLog;