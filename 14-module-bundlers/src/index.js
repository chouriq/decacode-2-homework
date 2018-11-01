const React = require('react');
const ReactDOM = require('react-dom');

require('./index.css');

const imgURL = 'https://assets.chucknorris.host/img/avatar/chuck-norris.png';
const imgALT = 'CHUCK NORRIS avatar';
const apiURL = 'https://api.chucknorris.io/jokes/random';

const element = (
  <div className = 'content'>
      <img src = {imgURL} alt={imgALT}/>
      <button type='button' onClick={()=>fetch(apiURL)
          .then(response => {return response.json()})
          .then(data => ReactDOM.render(data.value, document.getElementById('joke')))}>Ask Chuck</button>
      <div id='joke'></div>
  </div>
);

ReactDOM.render(element, document.getElementById('root'));