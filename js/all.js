var getArrayList = [];
var info = {};
var btn = document.querySelector(".send");
btn.addEventListener('click', createList, false);
updateList();

function updateList() {
    var toDoList = [];
    var getList = localStorage.getItem('mylist');

    if (getList) {
        getArrayList = JSON.parse(getList);
        showList();
        var list = document.querySelector(".list");
        list.addEventListener('click', deleteList, false);
    } else {
        getArrayList = toDoList;
    }
}

function deleteList(e) {
    if (e.target.nodeName === 'INPUT') {
        var num = e.target.parentNode.parentNode.dataset.num;
        // console.log(num); 
        getArrayList.splice(num, 1);
        var newStr = JSON.stringify(getArrayList);
        localStorage.setItem('mylist', newStr);
        updateList();
    }
}

function showList() {
    var ul = document.querySelector(".list");
    var str = '';

    for (var i = 0; i < getArrayList.length; i++) {
        str += '<li data-num="' + i + '"><div ><input type="button" value="刪除"><div style="width: 20px;height: 40px; background-color:' + getArrayList[i].color + '"></div> BMI:' + getArrayList[i].strBmi + '身高:' + getArrayList[i].height + '體重:' + getArrayList[i].weight + ' ' + getArrayList[i].date + '</div></li>'
    }
    ul.innerHTML = str;

}
function getBMI(height, weight) {
    var tempH = height / 100;
    var BMI = (weight / (tempH * tempH)).toFixed(2);
    return BMI;
}
function createList() {
    var strHeight = document.querySelector(".height").value;
    var strWeight = document.querySelector(".weight").value;
    var today = new Date();
    var mm = today.getMonth() + 1;
    info.height = strHeight;
    info.weight = strWeight;
    info.date = today.getDate() + "-" + mm + "-" + today.getFullYear();
    //計算BMI
    info.strBmi = getBMI(strHeight, strWeight);
    if (info.strBmi < 18.5) {
        info.sRestult = " 過輕";
        info.color = "#31BAF9";
    } else if (info.strBmi > 25) {
        info.sRestult = " 過重";
        info.color = "#FF982D";
    } else {
        info.sRestult = " 正常";
        info.color = "#86D73F";
    }
    var sRestult = document.querySelector(".button");
    sRestult.setAttribute('style', 'background-color:' + info.color);
    sRestult.value = 'BMI is ' + info.strBmi + info.sRestult;

    //儲存
    //Object.keys(info).length after IE9
    getArrayList.push(info);

    var listStr = JSON.stringify(getArrayList);
    localStorage.setItem('mylist', listStr);
    updateList();

    var Height = document.querySelector(".height");
    Height.value = '';
    var Weight = document.querySelector(".weight");
    Weight.value = '';
}

