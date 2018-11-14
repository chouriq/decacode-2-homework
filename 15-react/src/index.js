import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router} from "react-router-dom";
import credentials from './credentials.json';

const googleParameters = {
    CLIENT_ID: credentials.client_id,
    API_KEY: credentials.api_key,
    DISCOVERY_DOCS: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
    SCOPES: 'https://www.googleapis.com/auth/spreadsheets',
};


// Компоненты Реакта создаются только
// После отработки создания клиента Google API
// Если клиент не авторизовался в Google API работа 
// все равно продолжается
const initClient = () =>
    window.gapi.client.init({
        apiKey: googleParameters.API_KEY,
        clientId: googleParameters.CLIENT_ID,
        // clientId: 'asdsd',
        discoveryDocs: googleParameters.DISCOVERY_DOCS,
        scope: googleParameters.SCOPES
    }).then(() => {
        
        ReactDOM.render(
            <Router>
                <App init='success'/>
            </Router>,
            document.getElementById('root'));
        console.log('google api client initiated');
    })
    .catch((e) => {
        console.log('google api client not initiated');
        console.log(e);
        ReactDOM.render(
            <Router>
                <App init='failure'/>
            </Router>,
            document.getElementById('root'));
    });

// Скрипт для работы с Google Api подключается 
// из html, объект gapi создается
// только после полной загрузки скрипта
const loadGoogleApi = () =>{
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";

    script.onload = () => {
        window.gapi.load('client:auth2', initClient);
    };
    document.body.appendChild(script);
}

loadGoogleApi();