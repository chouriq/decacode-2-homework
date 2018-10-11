const path = require('path');
const fs = require('fs');

const pathToJSON = path.resolve(__dirname, 'index.json');
const data = fs.readFileSync(pathToJSON, 'utf8');

const parsedData = JSON.parse(data);

console.log('Количество пользователей: ' + parsedData.length);

const averageAge = parsedData.reduce((acc, item) => acc + item.age, 0)/parsedData.length;
console.log('Средний возраст пользователя: ' + parseInt(averageAge));

const dataFormatted = parsedData.reduce((acc, x) => acc + x.age + ' ' + x.name + ', ','');
console.log(dataFormatted.slice(0, dataFormatted.length - 2));

const painters = parsedData.filter((x) => x.skills.includes('Paint')).map((y) => y.name);
console.log(painters);