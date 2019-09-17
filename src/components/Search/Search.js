import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Files from './Files';
import M from "materialize-css";

class Search extends Component { 
  state = 
  {
    fileField: null,
    currentFile: 0,
  }
	componentDidMount()
	{
    this.props.loadUser(JSON.parse(localStorage.getItem("user")));
    this.props.handleClick( (this.props.files.length !== 0)? this.props.files[0].dependency  : 0);
    this.props.modifyBar('a');
  }

  barWithin = (
    <div className="row" style={{marginBottom: '0px', borderBottom: '1px solid #424242'}}>

			<div className="col s1 valign-wrapper row" style={{fontSize: '18px', fontWeight: '600', lineHeight: '20px', padding: '5px', marginBottom: '0'}}>
        <button className="col s4" style={{width: '100%'}} onClick={(e) => this.props.goBack() }>
          <i className="fa fa-arrow-left grey-text text-darken-3"></i>
        </button>
        <button className="col s4" style={{width: '100%'}} 
        onClick={(e) => {
          console.log(this.props.files);
          this.props.handleClick( (this.props.files.length !== 0)? this.props.files[0].dependency  : 0);
          }
        }>
          <i className="fa fa-refresh grey-text text-darken-3"></i>
        </button>
        <button className="col s4" style={{width: '100%'}} 
        onClick={(e) => {
          this.props.goHome();
          }
        }>
          <i className="fa fa-home grey-text text-darken-3"></i>
        </button>
			</div>
      <div className="col s7 " style={{height: '100%', padding: '5px'}}>
        <p style={{fontSize: "16px", textAlign: "center"}}>Puedes acceder al CR desde 
        <span style={{fontSize: "16px", fontWeight: "bold"}}>{` http://${this.props.ip}:3000/`}</span></p>
      </div>
      		
      <div className="col s4 file-field input-field" style={{margin: '0', padding: '0', display: 'flex'}}>
        <div className="btn" style={{borderRadius: '0', boxShadow: 'none', height: '2.2rem', lineHeight: '2.2rem'}}>
          <span>Subir</span>
          <input onChange={(e) => this.onChange(e)} id='file' name="file" type="file" multiple />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" style={{margin: '0', border: 'none', height: '2.2rem'}} type="text" placeholder="Upload one or more files"/>
        </div>
        <button onClick={(e) => this.uploadFile()} id="button" className="btn waves-effect waves-light" style={{borderRadius: '0', boxShadow: 'none', height: '2.2rem', lineHeight: '2.2rem', minWidth: "85px", width:"21%"}} type="button">Submit</button>
      </div>
    </div>
  );
  onChange = (e) => {
    this.setState({fileField: e.target})
  }
  uploadFile = () =>
  {
    let formData = new FormData();
    formData.append('file', this.state.fileField.files[0]);
    fetch(`http://${this.props.ip}/api/file?whereTo=${this.props.files[0].dependency}`, {
      method: "POST",
      enctype: "multipart/form-data",
      body: formData
    })
    .then(res => res.json())
    .then(data => {this.props.handleClick(this.props.files[0].dependency)});
  }
  handleATag = (id) =>
  {
    this.setState({ currentFile : id });
    this.state.instance.open();
  }

	render(){
    let sidenav = document.querySelectorAll('.sidenav');
    let elems = document.querySelectorAll('.dropdown-trigger');
    let options = {
        edge: 'right',
        coverTrigger: false,
        constrainWidth: false
    };
    M.Sidenav.init(sidenav, options);
    M.Dropdown.init(elems, options);
		if(!JSON.parse(localStorage.getItem('user'))) return <Redirect to='/notlogged' />
    let content = <React.Fragment/> ;
    if(this.props.files.length > 0 && this.props.files[0].id !== 0) 
    {
      content = this.props.files.map( (f, index) => (
        <Files
          key={index}
          userid={this.props.id}
          file={f}	
          handleClick={this.props.handleClick}
          contextMenu={this.props.contextMenu}
          changeRep={this.props.changeRep}	
          getIcon={this.props.getIcon}
        />
      ));
    }
    else{
      content = (
        <div className="message">
          <h3 className="grey-text text-darken-3">No files inside this folder</h3>
            <br/>
          <i className="fa fa-wifi grey-text text-darken-3" style={{fontSize: '50px'}}></i>
        </div>
        )
    }

		return(
      <React.Fragment>
        {this.barWithin}
        <div style={{display: 'flex', flexWrap: 'wrap'}}>			
          {content}
        </div>
      </React.Fragment>
		)
	}
}

export default Search;