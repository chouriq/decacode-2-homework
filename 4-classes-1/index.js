const path = require('path');
const fs = require('fs');

// read file
const pathToFile = path.resolve(__dirname, 'products.csv');
const content = fs.readFileSync(pathToFile, 'utf8');

// split intoitems
const items = content.split(', ');

// constructor function
const Product = function(article) {
    const crossRate = 68.01;
    const value = article.replace('\n','').split(' ');
    this.title = value[1];
    this.rubles = value[0]
    this.dollars = (this.rubles/crossRate).toFixed(2);
};

// new array
const newItems = items.map((item) => new Product(item));

// new destination
const pathToFileToWrite = path.resolve(__dirname, 'result.json');

fs.writeFileSync(pathToFileToWrite, JSON.stringify(newItems, null, 4));