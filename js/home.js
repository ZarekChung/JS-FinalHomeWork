//取來源資料
var xhr = new XMLHttpRequest();
xhr.open('get', 'https://data.kcg.gov.tw/api/action/datastore_search?resource_id=92290ee5-6e61-456f-80c0-249eae2fcc97', true);
xhr.send(null);
const category = [];
var markers = [];
//記錄當前點擊 google window
var currentInfoWindow = '';
const strMapLink = 'http://maps.google.co.in/maps?hl=zh-TW&q=';
//google map
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.63961, lng: 120.30211 },
        zoom: 12
    });
}

var goTop = document.querySelector(".gotop");
goTop.addEventListener('click', function () {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
});

function updateMap(list) {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    for (let index = 0; index < list.length; index++) {
        addMapMark(list[index]);
    }
}
function addMapMark(objList) {
    let str = {};
    let place = {};
    place.lat = parseFloat(objList.lat);
    place.lng = parseFloat(objList.lng);
    str.map = map;
    str.title = objList.name;
    str.position = place;
    str.icon = "images/icons_pin.png";

    let marker = new google.maps.Marker(str);

    let contentHtml = `<div class="scrollbar" id="style-1">
   <div class="wrap"><div class="header"><a target="_blank" href="` + strMapLink + str.title + `"><img src="images/gmap.png"/></a> <h3>` + str.title + `</h3>
   <div class="clearfix"></div> </div>
   <div class="content"><img src='`+ objList.pic + `'/><div class="row"><h4>地址</h4><span>` + objList.add + `</span></div> 
    <div class="row"><h4>電話</h4><span>` + objList.tel + `</span></div></div>
    </div>
    </div>`;

    let infowindow = new google.maps.InfoWindow({
        content: contentHtml,
        maxWidth: 500
    });

    let bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.position);

    marker.addListener('click', function (e) {
        let bounds = new google.maps.LatLngBounds();
        bounds.extend(marker.position);
        if (currentInfoWindow != '') {
            currentInfoWindow.close();
            currentInfoWindow = '';
        }
        infowindow.open(map, marker);
        currentInfoWindow = infowindow;
        //針對單點設定為中心
        map.setCenter(this.getPosition());
        map.setZoom(14);
    });
    //針對多點設定中心
    map.fitBounds(bounds);
    map.setZoom(12);

    markers.push(marker);
}
//init data
function showInitLists(dataSum) {
    //dropdown list
    let ul = document.querySelector(".slct");
    let str = '';
    for (let i = 0; i < dataSum.length; i++) {
        if (i == 0) {
            str += '<option value=' + i + '>' + "--請選擇行政區--" + '</option>'
        } else {
            str += '<option value=' + i + '>' + dataSum[i].region + '</option>';
        }
    }
    ul.innerHTML = str;

    //熱門行政區
    let strRegion = document.querySelector(".region");
    let sortArray = dataSum.sort(function (a, b) {
        return a.count < b.count ? 1 : -1;
    });
    let strR = '';
    for (let j = 0; j < 4; j++) {
        strR += ' <li data-num="' + j + '" class="item' + j + '"><h3>' + sortArray[j].region + '(' + sortArray[j].count + ')' + '</h3></li>';
    }
    strRegion.innerHTML = strR;
}

function showItems(selected) {
    let div = document.querySelector(".conetext");
    let str = '';
    let list = category;

    if (selected) {
        list = category.filter(function (item) {
            return item.region == selected;
        });
        let title = document.querySelector(".title h2");
        title.textContent = list[0].region;
    }
    // console.log(list);
    for (let i = 0; i < list.length; i++) {
        str += `<div class="spot">
        <div class="pic">
        <h3>`+ list[i].name + `</h3>
        <img src="`+ list[i].pic + `"/>
        </div>
        <div class="info">
        <p class="detail"><img src="images/icons_clock.png"/>`+ list[i].opentime + `</p>
        <p class="detail"><img src="images/icons_pin.png"/>`+ list[i].add + `</p>
        <p class="tel"><img src="images/icons_phone.png"/>`+ list[i].tel + `</p><p class="ticket"><img src="images/icons_tag.png">` + list[i].ticket + `</p>
        </div>
        </div>`;
        if (i == list.length - 1) {
            str += ` <div class="clearfix"></div>`;
        }
    }
    div.innerHTML = str;
    updateMap(list);
}
function showSelectItems(e) {
    //取得select 的區域
    if (e.target.selectedIndex == 0) {
        showItems();
    } else {
        let selected = e.target.options[e.target.selectedIndex].text;
        showItems(selected);
    }
}

//熱門行政區
function shoePopItems(e) {
    let num = e.target.nodeName;
    if (num !== "UL") {
        let selected = e.target.textContent;
        selected = selected.substring(0, selected.indexOf("("))
        showItems(selected);
    } else {
        return;
    }
}
xhr.onload = function () {
    let str = JSON.parse(xhr.responseText);
    //先列出全部的區域
    let result = str.result.records;
    console.log(result);
    for (let index = 0; index < result.length; index++) {
        let item = {};
        item.region = result[index].Zone;
        item.name = result[index].Picdescribe1;
        let tmpUrl = (result[index].Picture1);
        item.pic = tmpUrl.substring(0, tmpUrl.indexOf("&"), "");
        item.opentime = result[index].Opentime;
        item.add = result[index].Add;
        item.tel = result[index].Tel;
        item.ticket = result[index].Ticketinfo;
        item.lat = result[index].Py;
        item.lng = result[index].Px;
        category.push(item);
    }
    const dataSum = category.reduce(function (items, item) {
        const temp = items.find(function (data) {
            return data.region === item.region
        });
        if (temp) {
            temp.count++
        } else {
            items.push({
                region: item.region,
                count: 1
            })
        }
        return items;
    }, []);
    console.log('dataSum', dataSum)

    showInitLists(dataSum);
    showItems();

    //綁定select事件
    let select = document.querySelector(".select");
    select.addEventListener('change', showSelectItems, false);

    //綁定人氣景點
    let list = document.querySelector(".region");
    list.addEventListener('click', shoePopItems, false);
}


