// db.js
const fs = require('fs');
const path = require('path');

const pathToJSON = path.resolve(__dirname, 'index.json');

// database
const db = {

    // Получаем продукты
    get: (callback) => {
        fs.readFile(pathToJSON, 'utf8', (error, contents) => {
            callback(JSON.parse(contents));
        });
    },

    // Сохраняем новый предмет
    save: (item, callback) => {
        fs.readFile(pathToJSON, 'utf8', (error, contents) => {

            const data = JSON.parse(contents);

            // Три поля всегда присутствуют
            const newItem = {'id': 'id', 'title':'title', 'count':0};

            // Новый item может содержать любые дополнительные поля
            // Присваиваем новому item номер id = последний + 1
            Object.assign(newItem, item);
            const lastId = data.slice(-1)[0].id;
            newItem["id"] = String(parseInt(lastId) + 1);

            data.push(newItem);

            fs.writeFile(pathToJSON, JSON.stringify(data, '', 2), 'utf8', (error, contents) => {
                callback(newItem);
            });
        });
    },

    // Обновление информации
    update: (id, newData, callback) => {
        fs.readFile(pathToJSON, 'utf8', (error, contents) => {
 
            let data = JSON.parse(contents);
            let updatedItem;

            // Так как база данных - файл без случайного доступа, то приходится проходить все items
            // поле id - игнорируем
            // остальные поля меняем в соответствии с запросом
            // поля id, title и count - нестираемые
            // Также можем добавлять новые поля
            // стираем те поля, в которых указано null
            data = data.map(item => {
                if (item.id === id) {
                    Object.assign(item, newData);
                    item.id = id;

                    Object.keys(item).forEach(key => {
                        switch (key) {
                            case 'id': 
                            case 'title':
                            case 'count':
                                break;
                            default:
                                if (item[key]===null) delete item[key];
                        }
                    });
                    updatedItem = item;;
                }
                return item;
            });

            fs.writeFile(pathToJSON, JSON.stringify(data, '', 2), 'utf8', (error, contents) => {
                callback(updatedItem);
            });
        });
    },

    // Удаление
    delete: (id, callback) => {
        fs.readFile(pathToJSON, 'utf8', (error, contents) => {
            const data = JSON.parse(contents);

            const updatedData = data.filter(el => el.id !== id);

            fs.writeFile(pathToJSON, JSON.stringify(updatedData, '', 2), 'utf8', (error, contents) => {
                callback();
                });
            });
        }
};

module.exports = db;