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
        arr[i - 1] = tmp;        
    }
    return arr;    
}

function onlyBudget(arr) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].pop()) {
            res.push(arr[i]);
        }
    }
    return res;
}

students = fs.readFileSync('students.csv', 'utf-8');
students = onlyBudget(convertData(students.toString()));


for (var i = 0; i < students.length; i++) {
    students[i] = [
        students[i][0],
        avarege(students[i].slice(1))
    ];
}

students.sort(function (a,b) {
    return b[1] - a[1];    
});

function avarege(arr) {
    var sum = 0,
        qty = arr.length;
    for (var i = 0; i < qty; i++) {
        sum += arr[i];        
    }
    return sum/qty;
}


min = students[students.length - 1][1];
for (var i = 0; i < students.length; i++) {
    res += students[i][0] + ',' + students[i][1].toFixed(3) + '\r\n';    
}

qtyS40 = Math.round(40 * students.length / 100);
console.log('Первые 40% студентов рейтинга');
console.log(students.slice(0,qtyS40));
console.log('Минимальный балл для получения стипендии', min);

fs.writeFileSync('rating.csv', res);
