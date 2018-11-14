import React, { Component } from 'react';
import credentials from './credentials.json';

const spreadsheetId = credentials.spreadsheet_id;
const range = 'Sheet1!A2:Z1000';

const text = {
  1:'Синхронизация с Google Sheets',
  2:'Авторизоваться',
  3:'Выйти',
  4:'Сохранить',
  5:'Загрузить',
  6:'Избранные рецепты:',
  7:'удалить из избранного',
  8:'Описание рецепта',
  9:'signed in',
  10:'logged out',
  11: `избранное сохранено в Google`,
  12: `избранное загружено из Google`,
  13: '',
  14: 'в избранном ничего нет',
  // 15: 'произошел логин в Google',
  // 16: 'произошел выход из Google',
  // 17: 'удален элемент'
}

class Favorite extends Component {

  constructor(props) {
    super(props);
    this.onClickRemoveFromFavs = this.onClickRemoveFromFavs.bind(this);
    this.getGoogleData = this.getGoogleData.bind(this);
    this.saveDataToGoogle = this.saveDataToGoogle.bind(this);
    this.handleAuthClick = this.handleAuthClick.bind(this);
    this.handleSignoutClick = this.handleSignoutClick.bind(this);
    this.updateSigninStatus = this.updateSigninStatus.bind(this);
    window.gapi.auth2.getAuthInstance().isSignedIn.listen(this.updateSigninStatus);
  }

  onClickRemoveFromFavs(e, item) {
    e.preventDefault();
    this.props.removeFavsFromApp(item);
    // this.props.getInformationText(text[17],'Favs')
  }

  updateSigninStatus(isGoogleUserAuthorized) {
    this.props.receiveLogonStatus(isGoogleUserAuthorized);
    if (isGoogleUserAuthorized) {
      console.log(text[9]); 
    } else {
      console.log(text[10]);
    }
  }

  handleAuthClick(e) {
      window.gapi.auth2.getAuthInstance().signIn();
      // this.props.getInformationText(text[15],'Favs')
  }

  handleSignoutClick(e) {
      window.gapi.auth2.getAuthInstance().signOut();
      // this.props.getInformationText(text[16],'Favs')
  }

  getGoogleData() {
    window.gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    }).then((response) => {
      if (response.result.values) {
        this.props.loadFavsFromGoogleSheets(response.result.values);
        this.props.getInformationText(text[12],'Favs')
      }
      else {
        this.props.loadFavsFromGoogleSheets([])
        this.props.getInformationText(text[14],'Favs')
      }
    }, function (response) {
      console.log(response);
    });
  }

  // Сохранение данных в Google Sheets
  // - сначала стираются все ячейки
  // - затем записывается всё избранное
  saveDataToGoogle() {
    const valueInputOption = 'RAW';
    const clearValueBody = {};
    const valueRangeBody = {
      "values": this.props.favs.map((elem) => {
        return [elem.title, elem.href, elem.ingredients, elem.thumbnail]
      })
    }
    const paramsClear = {spreadsheetId: spreadsheetId, range: range};
    const paramsUpdate = { spreadsheetId: spreadsheetId, range: range, valueInputOption: valueInputOption };
    const requestClear = window.gapi.client.sheets.spreadsheets.values.clear(paramsClear, clearValueBody);
    const requestUpdate = window.gapi.client.sheets.spreadsheets.values.update(paramsUpdate, valueRangeBody);
    requestClear.then((response) => {
      console.log(response.result);
      requestUpdate.then((response) => {
        this.props.getInformationText(text[11],'Favs')
        console.log(response.result)
      },(reason) => {
        console.error(reason.result);
      })
    }, (reason) => {
      console.error(reason.result);
    });
  }

  componentDidMount() {
    this.props.getInformationText('','Favs')
  }

 // Рендеринг элементов происходит по одной схеме с компонентом Search
 // для однообразности интерфейса
  render() {
    return (
      <div>
        <div className='searchForm'>
          <div>{text[1]}</div> 
          <div className='sheets'>
            <button disabled={!this.props.isGoogleApiAvailable}
                    style={this.props.isGoogleUserAuthorized?{display: 'none'}:{display:'block'}}
                    onClick={(e) => this.handleAuthClick(e)}
                    >{text[2]}</button>
            <button style={this.props.isGoogleUserAuthorized?{display: 'block'}:{display:'none'}} onClick={(e) => this.handleSignoutClick(e)}>{text[3]}</button>
            <button style={this.props.isGoogleUserAuthorized?{display: 'block'}:{display:'none'}} onClick={this.saveDataToGoogle}>{text[4]}</button>
            <button style={this.props.isGoogleUserAuthorized?{display: 'block'}:{display:'none'}} onClick={this.getGoogleData}>{text[5]}</button>
          </div>
          <div className='waiting'>{this.props.informationText}</div>
        </div>
        <h3>{text[6]}</h3>
        <ul>
          {this.props.favs.map(item =>
            <li className='favs' key={item.href}>
              <h4>{item.title}</h4>
              <p className={item.thumbnail === '' ? 'hide' : 'show'}><img src={item.thumbnail} alt={'***' + item.title + '***'} /></p>
              <p>{item.ingredients}</p>
              <p><a href={item.href} rel='noopener noreferrer' target='_blank'>{text[8]}</a></p>
              <p className='fav' onClick={(e) => { return this.onClickRemoveFromFavs(e, item) }}>{text[7]}</p>
            </li>)}
        </ul>
      </div>
    );
  }
};

export default Favorite;