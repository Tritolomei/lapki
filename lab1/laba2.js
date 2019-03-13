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
