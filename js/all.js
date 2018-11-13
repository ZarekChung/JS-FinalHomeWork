var getArrayList = [];
var info = {};
var btn = document.querySelector(".send");
btn.addEventListener('click', createList, false);
updateList();


function reload() {
    let sRestult = document.querySelector(".result");
    sRestult.className = 'send basic';

    let str = '';
    str = '<H3>看結果</H3>';

    btn.innerHTML = str;
    btn.addEventListener('click', createList, false);
}
function updateList() {
    let toDoList = [];
    let getList = localStorage.getItem('mylist');

    if (getList) {
        getArrayList = JSON.parse(getList);
        showList();
        let list = document.querySelector(".list");
        list.addEventListener('click', deleteList, false);
        let content = document.querySelector(".content-title");

        if (getArrayList.length > 0 && !document.querySelector('.delete')) {
            let delBtn = document.createElement('input');
            delBtn.type = 'button';
            delBtn.value = '刪除全部';
            delBtn.className = 'delete';

            content.appendChild(delBtn);
            let del = document.querySelector(".delete");
            del.addEventListener('click', deleteList, false);
        } else if (getArrayList.length == 0) {
            let str = `<h1>BMI紀錄</h1>`;
            content.innerHTML = str;
        }
    } else {
        getArrayList = toDoList;

    }
}

function deleteList(e) {
    if (e.target.nodeName === 'INPUT') {
        let num = e.target.parentNode.parentNode.dataset.num;
        if (num) {
            getArrayList.splice(num, 1);
        } else {
            getArrayList = [];
        }
        let newStr = JSON.stringify(getArrayList);
        localStorage.setItem('mylist', newStr);
        updateList();
    }
}

function showList() {
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
        info.sRestult = "正常";
        info.class = "resultOK";
        info.icons = "iconOK";
    }
    info.strBmi = BMI;

    let sRestult = document.querySelector(".send");
    sRestult.className = 'result';
    sRestult.className += ' ' + info.class;

    let strMsg = '';
    strMsg = `<h3>` + info.strBmi + `</h3><p>BMI</p>`
    sRestult.innerHTML = strMsg;

    let iconElement = document.createElement('img');
    let spanElement = document.createElement('span');

    iconElement.className = 'icons';
    iconElement.className += ' ' + info.icons;
    iconElement.src = 'images/icons_loop.png';

    spanElement.textContent = info.sRestult;
    btn.appendChild(iconElement);
    btn.appendChild(spanElement);

    let sReload = document.querySelector(".result");
    btn.removeEventListener('click', createList, false);
    sReload.addEventListener('click', reload, false);
}

function createList() {
    let strHeight = document.querySelector(".height").value;
    let strWeight = document.querySelector(".weight").value;

    if (!strWeight || !strWeight) {
        alert("你有欄位沒有輸入喔!!!");
        document.querySelector(".height").focus();
        return
    }
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

