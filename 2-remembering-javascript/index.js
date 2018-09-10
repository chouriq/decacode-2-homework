let list_arguments = process.argv;
if (list_arguments.length<3) console.log('Not enough arguments.')
else {
    let array_elements = list_arguments.slice(2).map(parseFloat);
    console.log(array_elements);
    let sum_of_elements = 0;
    for (let i=0;i<array_elements.length;sum_of_elements += array_elements[i++]);
    console.log('Сумма: ' + sum_of_elements);
    console.log('Среднее арифметическое: ' + sum_of_elements/array_elements.length);
}