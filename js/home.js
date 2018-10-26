
//取來源資料
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
var category = [];

function showList() {
    var ul = document.querySelector(".slct");
    var str = '';

    for (var i = 0; i < category.length; i++) {
        str += '<option value=' + i + '>' + category[i] + '</option>'
    }
    ul.innerHTML = str;

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

xhr.onload = function () {

    var str = JSON.parse(xhr.responseText);
    //先列出全部的區域
    var result = str.result.records;
    console.log(result);

    for (let index = 0; index < result.length; index++) {
        category.push(result[index].Zone);
    }
    category = category.filter(onlyUnique);
    showList();
}


