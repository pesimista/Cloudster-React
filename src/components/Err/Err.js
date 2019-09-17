import React from 'react';

const Err = () => {
	return(
		<div className="row center valign-wrapper" style={{height: '100%', marginBottom:'0',backgroundColor:'rgb(57,61,70)'}}>
    		<div className="col s12 m4 valign" style={{margin: 'auto',float: 'none'}}>
       			<div style={{marginBottom: '0'}} className="card grey lighten-3 black-text">
            		<div className="card-content">
                    	<span className="card-title">Lo sentimos!</span>
                    	<p>La página que estás buscando no existe.</p>
                	</div>
				</div>
			</div>
        </div> 
	)
}

export default Err;