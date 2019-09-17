import React  from 'react';
import { NavLink } from "react-router-dom";

const Files = (props) => {
  const { handleClick, contextMenu, changeRep } = props;
  const { id, name, ext, isFile, lastModified, size, nivel } = props.file;
  const content = (
		<React.Fragment>
			<img src={props.getIcon(isFile, ext)} alt={ext}/>
      <p className="item-text grey-text text-darken-4" style={{overflowWrap: 'break-word'}}>
        { name.length > 30 ? name.substring(0,27) + '...' + ext : name }
			</p>
		</React.Fragment>
    );
  if(!isFile){
     return (
      <div onClick={(e) => handleClick(id)} onContextMenu={(e) => contextMenu(e)} className="file" style={{cursor: 'pointer'}}>
        {content}
      </div>
  );}
  else {
    return (
      <div>
        <a data-target={`dropdown${id}`} className="file dropdown-trigger" onContextMenu={(e) => contextMenu(e)}>
          {content}
        </a>
        <ul id={`dropdown${id}`} class='dropdown-content'>
          <li><a href={`http://${props.serverIp}:6969/api/download/${id}?user=${props.userid}`}>Descargar</a></li>
          { !props.getIcon(isFile, ext).includes('zerosize')? <li><NavLink to="Reproductor" onClick={() => changeRep(id)}>Visualizar</NavLink></li> : ''}
          <li><a data-target={`slide-out${id}`} class="sidenav-trigger">Información</a></li>
        </ul>
        <div id={`slide-out${id}`} className="card center-align sidenav" >
          <div className="card-content" style={{padding: "6px"}}>
              <img src={props.getIcon(isFile, ext)} alt={ext} height="128px" width="128px"/>
              <h5>{name}</h5>
          </div>
          <div className="card-action">
              <span className="left">Extensión: </span>
              <span className="right">{ext}</span>
              <br style={{margin: '5px 0'}} />
              <span className="left" >Última modificación: </span>
              <span className="right" >{lastModified}</span>
              <br style={{margin: '5px 0'}} />
              <span className="left" >Tamaño: </span>
              <span className="right" >{size}</span>
              <br style={{margin: '5px 0'}} />              
              <span className="left" >Nivel: </span>
              <span className="right" >{nivel}</span>
          </div>
        </div>  
      </div>     
  );}
}

export default Files;