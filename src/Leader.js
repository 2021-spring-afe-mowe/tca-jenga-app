import React from 'react';
import './App.css';

const Leader = (props) => {
  
  return (
    <div className={`row blue darken-1 lb-header valign-wrapper`}>
      <h4 className={`${props.h4textcol} lb-header-text m-0 p-0 ${props.atts}`}>{props.h4text}</h4>
      {props.moveButton}
      {props.jengaButton}
      {props.quitButton}
    </div>
  )    
}

export default Leader;