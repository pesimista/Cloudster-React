import React from 'react';
import { NavLink } from "react-router-dom";
import View from "../SF/Media/intropag.png";

export const Welcome = () => {
	return(
		<div className="white-text" style={{overflowY: 'hidden', backgroundColor: 'rgb(57,62,70)', borderBottom: '20px solid #66bb6a', height: '100%'}}>
    <nav className="green lighten-1" role="navigation">
      <div className="nav-wrapper container">
        <ul>
          <li><NavLink to="Login" style={{fontSize: '18px', fontWeight: '600'}}>Iniciar Sesión</NavLink></li>
          <li><NavLink to="Register" style={{fontSize: '18px', fontWeight: '600'}}>Registrarse</NavLink></li>
        </ul>
      </div>
      </nav>
    <div>
      <div>
        <h1 className="header center orange-text text-lighten-1" style={{fontWeight: '600'}}>
          <i className="fa fa-wifi"></i>Cognitive Realm
        </h1>
        <div className="row center">
          <h5 className="header col s12 light">Una forma sencilla de compartir tus archivos sin limites de plataforma.</h5>
        </div>
        <br/><br/>
      </div>
      <div className="container">
          <div className="section">
              <img src={View} className="z-depth-5" alt="pag" style={{width: '100%', overflow:'hidden'}}/>
          </div>
      </div>
    </div>
		</div>
	)
}