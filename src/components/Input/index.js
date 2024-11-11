import React, {setState , state}  from 'react';
import "./styles.css";

function Input({type , label , state , setState , placeholder}) {
  return (
    <>
        <div>
            <p className='label-input'>{label}</p>
            <input 
                type = {type}
                value={state} 
                placeholder={placeholder}
                onChange={(e)=>setState(e.target.value)} 
                className='custom-input'
            />
        </div>
    </>
  )
}

export default Input
