import React, { Component } from 'react';
import Buttons from './Buttons';

class Sidebar extends Component {
	render(){
	const { buttons, adminButton, user, signout, modifyBar } = this.props;
	return(
		<div id="leftBar" className="center-align" >
			{buttons.map(button => (
				<Buttons 
					key={button.id} 
					button={button}
					signOut={signout}
					modifyBar={modifyBar}
				/>
			))}
			{(user.nivel === 5) ? 
				<Buttons 
					key={adminButton.id} 
					button={adminButton}
				/>
				: ''
			}
		</div>
	)
}
}

export default Sidebar;