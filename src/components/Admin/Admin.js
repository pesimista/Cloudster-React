import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import ShowFiles from './ShowFiles';
import ShowUsers from './ShowUsers';
import M from "materialize-css";

class Admin extends Component {
	constructor(props) {
		super(props);
		this.state = {
		  show: 0,
		  filesList: [],
		  usersList: []
		}
  }
  
  fetchUsers = () => {
    fetch('/api/users')
    	.then(res => res.json())
    	.then(users => {
		this.setState({
			usersList: users
		});
		});
  }
	componentDidMount() {
    this.fetchUsers();

		fetch('/api/allFiles')
		.then(res => res.json())
		.then(files => {
		this.setState({
			filesList: files
		});
		});
		this.props.modifyBar('a');
    }
	render(){
		
		if(!localStorage.getItem('user'))
		{
			return (<Redirect to='/notlogged' />);
		} else if ( JSON.parse(localStorage.getItem('user')).nivel !== 5){
			return (<Redirect to='/search' />);
		}
		let tabs = document.querySelectorAll('.tabs');    
		M.Tabs.init(tabs);
		const { getIcon, modifyBar } = this.props;
		const { usersList, filesList,  } = this.state;
		const filteredFiles = filesList.filter(f => {
			return f.name.toLowerCase().includes(this.props.searchFileField.toLowerCase())
			})
		const filteredUsers = usersList.filter(u => {
			return u.nombre.toLowerCase().includes(this.props.searchUserField.toLowerCase()) || u.usuario.toLowerCase().includes(this.props.searchUserField.toLowerCase())
			})
		return(
			<div className="main row" style={{}}>
				<div className="col s12" style={{padding: '0', marginBottom:'5px'}} >
					<ul className="tabs">
						<li className="tab col s6"><a className="active green-text text-lighten-1" href="#files" onClick={() => this.props.modifyBar('a')}>Archivos</a></li>
						<li className="tab col s6"><a className="green-text text-lighten-1" href="#users" onClick={() => this.props.modifyBar('b')}>Usuarios</a></li>
					</ul>	
				</div>
				
				<div id="files">
					<ShowFiles
					filesList={filteredFiles}
					getIcon={getIcon}
					modifyBar={modifyBar}
					/>
				</div>

				<div id="users">
					<ShowUsers
          fetchUsers={this.fetchUsers}
          user={this.props.user}
					usersList={filteredUsers} 
					modifyBar={modifyBar}
					/>
				</div>
				<div className="clearfix"></div>
				
			</div>
			)
	}
}

export default Admin;