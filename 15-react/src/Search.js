import React, { Component } from 'react';

const text1 = `Поиск рецептов по ключевым словам/ингредиентам`;
const text2 = `Ничего не найдено`;
const text3 = `Рецепты:`;
const text4 = `Найти`;
const text5 = `Описание рецепта`;
const text6 = `добавить в избранное`;
const text7 = ` поиск...`
const text8 = ` в избранном`;
const URL = `https://cors-anywhere.herokuapp.com/http://www.recipepuppy.com/api?q=`;

class Search extends Component {

    constructor(props) {
        super(props);
        this.onClickSearch = this.onClickSearch.bind(this);
        this.onClickAddToFavs = this.onClickAddToFavs.bind(this);
    }
   
    // Поиск занимает какое-то время, поэтому во время выполнения запроса к API
    // показывается сообщение о том, что идет запрос
    onClickSearch(e) {
        e.preventDefault();

        this.props.getInformationText(text7,'Search');

        // можно использовать state, но получается очень много обновлений
        const searchItem = document.querySelector('input').value;
        
        fetch(URL + searchItem)
            .then((response) => {return response.json();})
            .then((data) => {
                if (data.results.length ===0)
                    return this.props.getItemsToApp(data.results, searchItem, text2);
                else
                    return this.props.getItemsToApp(data.results, searchItem, text3);
                })
            .catch(e => console.log(e));
    }

    onClickAddToFavs(e, item) {
        e.preventDefault();
        this.props.addFavsToApp(item);
    }

    // Рендеринг элементов происходит по одной схеме (class=searchForm) с компонентом Favorite
    // для однообразности интерфейса
    render() {
        return (
            <div>
                <div className='searchForm'>
                    <div>{text1}</div>
                    <form>
                        <input type='text' placeholder={this.props.searchWord} name={text4}  />
                        <button type='submit' onClick={this.onClickSearch}>{text4}</button>
                        <div className='waiting'>{this.props.informationText}</div>
                    </form>
                </div>
                <h3>{this.props.searchResult}</h3>
                <ul>
                    {this.props.items.map(item =>
                        <li className='search' key={item.href}>
                            <h4>{item.title}</h4>
                            <p className={item.thumbnail === '' ? 'hide' : 'show'}><img src={item.thumbnail} alt={'<' + item.title + '>'} /></p>
                            <p>{item.ingredients}</p>
                            <p><a href={item.href} rel='noopener noreferrer' target='_blank'>{text5}</a></p>
                            {this.props.favsKeys.includes(item.href)?
                                <p className='inFavs'>{text8}</p>
                                :<p className='fav' onClick={(e) => { return this.onClickAddToFavs(e, item) }}>{text6}</p>
                            }
                        </li>
                        )}
                </ul>
            </div>
        );
    }
};

export default Search;