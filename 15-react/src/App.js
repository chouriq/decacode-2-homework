import React, { Component } from 'react';
import {Route, Link } from "react-router-dom";
import Favorite from './Favorite';
import Search from './Search';

const text1 = `Поиск`;
const text2 = `Избранное`;
const text3 = `Что ищем?`;
const EMPTY = ``;

// Загрузка данных из localStorage
const favsOnLoad = JSON.parse(window.localStorage.getItem('favs')) || [];
const favsKeysOnLoad = favsOnLoad.map((elem) => elem.href) || [];


// Состояния хранится только в App
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      favs: favsOnLoad,
      favsKeys: favsKeysOnLoad,
      searchWord: text3,
      informationTextSearch: EMPTY,
      informationTextFavs: EMPTY,
      isGoogleApiAvailable: props.init ==='success'?true:false,
      isGoogleUserAuthorized: window.gapi.auth2.getAuthInstance().isSignedIn.get()
    }
  }

  // Информационные сообщения
  getInformationText = (text, source) => {
    if (source === 'Search')
      this.setState({
        informationTextSearch: text
      })
    else
      this.setState({
        informationTextFavs: text
      })
  }

  // Обновление статуса пользователя(залогинен, нет)
  receiveLogonStatus = (isGoogleUserAuthorized) => {
    this.setState({isGoogleUserAuthorized:isGoogleUserAuthorized});
  }

  // Получение данных из поиска
  getItemsFromSearch = (itemsFromSearch, searchWord, informationText) => {
    this.setState({
        items: itemsFromSearch,
        searchWord: searchWord,
        informationTextSearch: informationText})
  };

  // Добавление рецепта в избранное
  // Ключ - href
  addFavsFromSearch = (item) => {
    this.setState({
      favs: this.state.favs.filter((elem) => (elem.href !== item.href)).concat(item),
      favsKeys: this.state.favsKeys.filter((elem) => (elem !== item.href)).concat(item.href)
    });
  }


  // Удаление рецепта из избранного
  // Ключ - href
  removeFavsFromFavs = (item) => {
    this.setState({
      favs:  this.state.favs.filter((elem) => (elem.href !== item.href)),
      favsKeys: this.state.favsKeys.filter((elemHref) => (elemHref !== item.href))
    });
  }

  // Загрузка избранного из Google листа
  // Если пустой - то обнуление избранного
  loadFavsFromGoogleSheets = (items) => {
    if (items.length>0)
    this.setState({
      favs: items.map((elem) => {
        if (elem.length === 4)
          return {'title': elem[0], 'href': elem[1], 'ingredients': elem[2], 'thumbnail':elem[3]}
        else
          return {'title': elem[0], 'href': elem[1], 'ingredients': elem[2], 'thumbnail':''}}),
      favsKeys: items.map((elem) => elem[1])
    })
    else
    this.setState({
      favs: [],
      favsKeys: []
    })
  }

  // При каждом обновлении - запись в localStorage
  // для синхронизации данных
  render() {
    window.localStorage.setItem('favs', JSON.stringify(this.state.favs));
    return (
       <main className='main'>
          <Link className='link' to="/">{text1}</Link>
          <Link className='link' to="/favs/">{text2}</Link>
          <Route 
            path="/favs/" 
            render= {(props) =>
              <Favorite
                favs={this.state.favs}
                informationText={this.state.informationTextFavs}
                isGoogleApiAvailable={this.state.isGoogleApiAvailable}
                isGoogleUserAuthorized = {this.state.isGoogleUserAuthorized}

                removeFavsFromApp = {this.removeFavsFromFavs}
                loadFavsFromGoogleSheets = {this.loadFavsFromGoogleSheets}
                receiveLogonStatus = {this.receiveLogonStatus}
                getInformationText={this.getInformationText}

              />}
          />
          <Route
            path="/" exact
            render={(props) =>
                <Search
                    items={this.state.items}
                    favsKeys={this.state.favsKeys}
                    searchWord={this.state.searchWord}
                    informationText={this.state.informationTextSearch}

                    getInformationText={this.getInformationText}
                    getItemsToApp={this.getItemsFromSearch}
                    addFavsToApp={this.addFavsFromSearch}
                    />}
          />
        </main>
    );
  }
};

export default App;
