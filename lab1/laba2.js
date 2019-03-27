var fs = require('fs'),
    res = '',
    min, students, qtyS40;

function convertData(str) {
    var arr = [], tmp, l;
    str = str.split('\n');
    for (var i = 1; i < str.length; i++) {
        tmp = str[i].split(',');
        l = tmp.length - 1;
        for (var j = 1; j < l; j++) {
            tmp[j] = parseFloat(tmp[j]);            
        }
        tmp[l] = tmp[l] === 'TRUE';
        let output = {
            name : tmp[0],
            marksArray : tmp.slice(1,tmp.length - 2),
            budget :  tmp[tmp.length - 1]
        }
        arr[i - 1] = output;        
    }
    return arr;
}

function onlyBudget(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].budget) {
            res.push(arr[i]);
        }
    }
    return res;
}

students = fs.readFileSync('students.csv', 'utf-8');
students = onlyBudget(convertData(students.toString()));


for (var i = 0; i < students.length; i++) {
    students[i] = {
        name : students[i].name,
        average : avarege(students[i].marksArray)
    };
}

students.sort(function (a,b) {
    return b.average - a.average;    
});

function avarege(arr) {
    var sum = 0,
        qty = arr.length;
    for (var i = 0; i < qty; i++) {
        sum += arr[i];        
    }
    return sum/qty;
}


min = students[students.length - 1].average;
for (var i = 0; i < students.length; i++) {
    res += students[i].name + ',' + students[i].average.toFixed(3) + '\r\n';    
}

qtyS40 = Math.round(40 * students.length / 100);
console.log('Первые 40% студентов рейтинга');
console.log(students.slice(0,qtyS40));
console.log('Минимальный балл для получения стипендии', min);

fs.writeFileSync('rating.csv', res);
