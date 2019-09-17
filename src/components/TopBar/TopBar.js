import React, { Component } from 'react';

class TopBar extends Component{
	render(){
    let search = {
      padding: '5px', 
      height: '95%',
      border: '1px solid #eee', 
      width: '180px', 
      color: '#eee', 
      borderRadius: '10px', 
      marginBottom: '0'
    }
	return(
		<section id="topBar" className="col s12 row grey darken-3" style={{marginBottom: '0px', marginLeft:'55px'}}>
			<div className="sol col s8 l8 hide-on-small-only">
				<div className="col s6 l4 hide-on-small-only valign-wrapper" style={{fontSize: '18px', fontWeight: '600', lineHeight: '20px', padding: '5px'}}>
					<i className="fa fa-wifi"></i> Cognitive Realm
				</div>	
				{this.props.show === 'a' ?
				<div className="col s6 l8">
					<input 
						className="center-align" 
						style={search} 
						type="search" 
						name="search" 
						id="search" 
						placeholder="Buscar archivos"
						onChange={(e) => this.props.searchFileChange(e)}
					/>
					<button>
						<i className="fa fa-search" style={{marginLeft: '3px', fontSize: '25px'}}></i>
					</button>
				</div> 
				: this.props.show === 'b' ? 
				<div className="col s6 l8">
					<input 
						className="center-align" 
						style={search} 
						type="search" 
						name="search" 
						id="search" 
						placeholder="Buscar usuarios"
						onChange={(e) => this.props.searchUserChange(e)}
					/>
					<button>
						<i className="fa fa-search" style={{marginLeft: '3px', fontSize: '25px'}}></i>
					</button>
				</div>
				: ''
			}
				
			  </div>
      		
        <div className="sol col s4 l4 hide-on-small-only">
          <span className="right" style={{fontSize: '18px', marginRight: '20px',lineHeight: '20px', padding: '5px'}}>
            <i className={"fa fa-user text-lighten-1 " + (this.props.user.nivel === 5 ? 'orange-text' : 'green-text')} style={{fontSize: '20px',marginRight: '5px'}}></i>
            {this.props.user.usuario}     
          </span>
        </div>
     	</section>
	)
	}
}

export default TopBar;