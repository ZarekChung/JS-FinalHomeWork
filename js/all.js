var getArrayList = [];
var info = {};
var btn = document.querySelector(".send");
btn.addEventListener('click', createList, false);
updateList();


function reload() {
    let str = '';
    str = '<input type="button" class="button" value="看結果">';
    btn.innerHTML = str;
}
function updateList() {
    let toDoList = [];
    let getList = localStorage.getItem('mylist');

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
        getArrayList.splice(num, 1);
        var newStr = JSON.stringify(getArrayList);
        localStorage.setItem('mylist', newStr);
        updateList();
    }
}

function showList() {
    // console.log("getArrayList", getArrayList);
    let ul = document.querySelector(".list");
    let str = '';

    for (let i = 0; i < getArrayList.length; i++) {
        str += `
        <li data-num="` + i + `">
        <div class="row">
        <input type="button" value="刪除">
        <div class="tag `+ getArrayList[i].icons + `" >
        </div>
        <span id="restult">`+ getArrayList[i].sRestult + `</span>
         <span>BMI</span>
         <p>`+ getArrayList[i].strBmi + `</p>
         <span>weight</span>
         <p>`+ getArrayList[i].weight + `</p>
         <span>height</span>
         <p>`+ getArrayList[i].height + `</p>
         <h3>`+ getArrayList[i].date + `</h3>
         <div class="clearfix"></div>
        </div>
        </li>
        `
    }
    ul.innerHTML = str;

}
function getBMI(height, weight, info) {
    let tempH = height / 100;
    let BMI = (weight / (tempH * tempH)).toFixed(2);

    if (BMI < 18.5) {
        info.sRestult = "過輕";
        info.class = "resultLow";
        info.icons = "iconLow";
    } else if (BMI > 39) {
        info.sRestult = "重度肥胖";
        info.class = "result-too-heigh";
        info.icons = "icon-too-heigh";
    } else if (BMI > 34) {
        info.sRestult = "中度肥胖";
        info.class = "result-over-heigh";
        info.icons = "icon-over-heigh";
    } else if (BMI > 29) {
        info.sRestult = "輕度肥胖";
        info.class = "result-over-heigh";
        info.icons = "icon-over-heigh";
    } else if (BMI > 24) {
        info.sRestult = "過重";
        info.class = "resultheigh";
        info.icons = "icon-heigh";
    } else {
        info.sRestult = " 正常";
        info.class = "resultOK";
        info.icons = "iconOK";
    }
    info.strBmi = BMI;

    let sRestult = document.querySelector(".button");
    sRestult.className = 'result';
    sRestult.className += ' ' + info.class;

    sRestult.value = 'BMI is ' + info.strBmi + info.sRestult;

    let iconElement = document.createElement('img');
    iconElement.className = 'icons';
    iconElement.className += ' ' + info.icons;
    iconElement.src = 'images/icons_loop.png';
    btn.appendChild(iconElement);
    btn.addEventListener('focusout', reload, false);
}

function createList() {
    let strHeight = document.querySelector(".height").value;
    let strWeight = document.querySelector(".weight").value;
    let today = new Date();
    let mm = today.getMonth() + 1;

    info.height = strHeight;
    info.weight = strWeight;
    info.date = today.getDate() + "-" + mm + "-" + today.getFullYear();

    //計算BMI
    getBMI(strHeight, strWeight, info);
    //儲存
    //Object.keys(info).length after IE9
    getArrayList.push(info);

    let listStr = JSON.stringify(getArrayList);
    localStorage.setItem('mylist', listStr);
    updateList();

    let Height = document.querySelector(".height");
    Height.value = '';
    let Weight = document.querySelector(".weight");
    Weight.value = '';
}

