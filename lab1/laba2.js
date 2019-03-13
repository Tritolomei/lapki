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

