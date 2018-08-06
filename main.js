function gec(s){return document.getElementsByClassName(s);}
function gei(s){return document.getElementById(s);}
function clog(s){if(true)gei('log').innerHTML = s;}
function showLoader(){gei("siteloader").style.display = 'block';}
function hideLoader(){gei("siteloader").style.display = 'none';}
function escapeHtml(unsafe) {return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");}


function load() {
    var query = gei("searchField").value;
    checkAllButton.checked = false;
    resultTable.innerHTML ='';
    var html = "";
    var j=1;
    var closeHTML = '<img class="cBtn" height="20px" style="float:left;" src="close4.png" />';
    chrome.tabs.getAllInWindow(null, function(tabs){
        for (var i = 0; i < tabs.length; i++) {
            var item = tabs[i];
                console.log(item);
            if (query != null && query !="") {
                var regexp = new RegExp(query,'i')
                var title = item.title;
                var url = item.url;
                if ((title.search(regexp) !== -1) || (url.search(regexp) !== -1)){
                    html += '<tr id="td-'+j+'" class="cTabs" tid="'+item['id']+'" wid="'+item['windowId']+'" tindex="'+item['index']+'"><td width="45px">'+closeHTML+item['index']+'</td><td width="200px" style="text-align:center;">'+escapeHtml(item.title)+'</td><td width="300px">'+escapeHtml(item.url)+'</td></tr>';
                    j++;
                }
            } else {
                html += '<tr id="td-'+j+'" class="cTabs" tid="'+item['id']+'" wid="'+item['windowId']+'" tindex="'+item['index']+'"><td width="45px">'+closeHTML+item['index']+'</td><td width="200px" style="text-align:center;">'+escapeHtml(item.title)+'</td><td width="300px">'+escapeHtml(item.url)+'</td></tr>';
                j++;
            }
        }
        if(html != "") {
            html = '<tr><th></th><th>Title</th><th>Link</th></tr>'+html;
        }
        totalResult = (j-1) + " Found";
        clog(totalResult);
        resultTable.innerHTML =html;
        historyResultDiv.style.display = 'block';
        checkAllDiv.style.display = 'none';
        addEventTR();
        hideLoader();
    });
}

function onCloseClick(e) {
    chrome.tabs.remove()
}

function onRowClick(row) {
    console.log(row);
}

function addEventTR() {
    var tabs = gec("cTabs");
    for (var i = 0; i < tabs.length; i++) {
        tab = tabs[i];
        tab.onclick = function (e) {
            console.log(e);
            var element = e.target.parentElement;
            var tIndex = parseInt(element.getAttribute('tindex'));
            var wid = parseInt(element.getAttribute('wid'));
            if (wid!=null && tIndex != null) {
                console.log("clicked "+ wid+" - " +tIndex);
                chrome.tabs.highlight({"windowId": wid, "tabs": [tIndex]}, function (obj) {});
            }
        };
    }
    var closeBtns = gec("cBtn");
    for (var i = 0; i < closeBtns.length; i++) {
        closeBtn = closeBtns[i];
        closeBtn.onclick = function (e) {
            console.log(e);
            e.preventDefault();
            e.stopPropagation();
            var element = e.target.parentElement.parentElement;
            var tid = parseInt(element.getAttribute('tid'));
            console.log("clicked " +tid);
            chrome.tabs.remove(tid , function(obj) {
                setTimeout(load, 500);
            });
        }

    }
}

function addEventHref() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                chrome.tabs.create({active: true, url: location});
            };
        })();
    }
}

function searchTab() {

}

function deleteSelectedClick() {
      
}

function checkAllClick() {
}

document.addEventListener('DOMContentLoaded', function () {
    searchField = gei("searchField");
    searchButton = gei("searchButton");
    searchBookmarksBtn = gei("searchBookmarksBtn");
    historySearchDiv = gei("historySearchDiv");
    historyResultDiv = gei("historyResultDiv");
    resultTable = gei("resultTable");
    checkAllButton = gei("checkAll");
    checkAllDiv = gei("checkAllDiv");
    deleteSelected = gei("deleteSelected");
    searchButton.addEventListener("click" , searchTab);
    deleteSelected.addEventListener("click" , deleteSelectedClick);
    checkAllButton.addEventListener("click" , checkAllClick);
    searchField.onkeyup = function(){
        load();
    };
    load();
});