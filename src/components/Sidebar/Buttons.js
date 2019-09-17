import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

class Buttons extends Component {
	render() {
		const { dir, value, id } = this.props.button;

		if(id===5)
		{
			return(
				<NavLink to={dir} className={(id === 5 ? 'logout-btn' : '')} >
					<button className="tab leftBar-Button" onClick={() => this.props.signOut()}>
						<i className={value}></i>
					</button>
				</NavLink>
			)
		}

		return(
			<NavLink to={dir} >
				<button className="tab leftBar-Button">
					<i className={value}></i>
				</button>
			</NavLink>
		)
	}
}

export default Buttons;