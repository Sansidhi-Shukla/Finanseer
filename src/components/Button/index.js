import React from 'react';
import "./styles.css";
function Button({disabled , text,onClick,blue}) {
  return (
    <>
        <div 
            disabled = {disabled}
            className={blue?"button-blue button":'button'} 
            onClick={onClick}
        >
            {text}
        </div>
    </>
  )
}

export default Button
