/**
 * Created by IntelliJ IDEA.
 * User: aamirsyed
 * Date: 06/06/14
 * Time: 3:20 PM
 * To change this template use File | Settings | File Templates.
 */
function gec(s){return document.getElementsByClassName(s);}
function gei(s){return document.getElementById(s);}

function clog(s)
{
    if(true)
        gei('log').innerHTML = s;
}
function searchChange()
{
    alert("change");
}

function searchHistory()
{
    showLoader();
    var search = gei("searchField").value;
    //historyResultDiv.innerHTML += search;
    var limit = 10000;
    chrome.history.search({
                'text': search, // Return every history item....
                'startTime': 0, // that was accessed less than one week ago.
                'maxResults' : limit
            },populateSearchResults);
    return true;
}
function checkAllResults(){

}
function populateSearchResults(items)
{
    checkAllButton.checked = false;
    resultTable.innerHTML ='';
    var html = "";
    var j=1;
    for(var i  in items)
    {
        var item = items[i];
        html += '<tr id="td-'+j+'"><td width="10px" style="text-align:center;"><input id="'+j+'" name="act" type="checkbox" value="'+item.url+'" /></td><td width="460px"><a href="'+item.url+'">'+item.url+'</a></td><td width="30px" style="text-align:center;">'+item.visitCount+'</td></tr>';
        j++;
    }

    if(html != "")
        html = '<tr><th>Select Box</th><th>Link</th><th>count</th></tr>'+html;
    totalResult = (j-1)+ " Found";
    clog(totalResult);
    resultTable.innerHTML =html;
    historyResultDiv.style.display = 'block';
    checkAllDiv.style.display = 'block';
    addEventHref();
    hideLoader();
}

function checkAllClick(){
    var checkboxes = new Array();
    checkboxes = document.getElementsByName('act');
    for (var i in checkboxes) {
        var checkbox = checkboxes[i];
        if(checkAllButton.checked)
            checkbox.checked = true;
        else
            checkbox.checked = false;

    }

}
function deleteSelectedClick(){
    showLoader();
    var checkboxes = [];
    checkboxes = document.getElementsByName('act');
    var loop = checkboxes.length;
    var processed=0;
    for (var i = 0;i<loop;i++) {
        processed++;
        var checkbox = checkboxes[i];
        if(checkbox.checked)
        {
            chrome.history.deleteUrl({
                url: checkbox.value
            });
            //var tr = gei('td-'+checkbox.id);
            //tr.parentNode.removeChild(tr);
        }
    }
    searchHistory();
    clog("t:"+loop +",p:"+processed);
}

function showLoader()
{
   gei("siteloader").style.display = 'block';
}

function hideLoader()
{
    gei("siteloader").style.display = 'none';
}

function searchBookmarks()
{
    var search = gei("searchField").value;
    var limit = 10000;
    chrome.bookmarks.search(search
            ,populateBookMarkSearchResults);
    return true;
}

function populateBookMarkSearchResults(items)
{
    checkAllButton.checked = false;
    resultTable.innerHTML ='';
    var html = "";
    var j=1;
    for(var i  in items)
    {
        var item = items[i];
        html += '<tr id="td-'+j+'"><td ></td><td width="200px" style="text-align:center;">'+item.title+'</td><td width="300px"><a href="'+item.url+'"> '+item.url+'</a></td></tr>';
        j++;
    }
    if(html != "")
        html = '<tr><th></th><th>Title</th><th>Link</th></tr>'+html;
    totalResult = (j-1) + " Found";
    clog(totalResult);
    resultTable.innerHTML =html;
    historyResultDiv.style.display = 'block';
    checkAllDiv.style.display = 'none';
    addEventHref();
    hideLoader();

}

function openURLinNewTab(url)
{
    alert("here");
    chrome.tabs.create({url:url});//, function(){});
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


document.addEventListener('DOMContentLoaded', function () {
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
});

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
    searchButton.addEventListener("click" , searchHistory);
    searchBookmarksBtn.addEventListener("click" , searchBookmarks);
    deleteSelected.addEventListener("click" , deleteSelectedClick);
    checkAllButton.addEventListener("click" , checkAllClick);

    /*
     historySearchDiv.innerHTML+='<input type="text" id="searchField" />';
     var input = document.createElement('input');
     input.type = "button";
     input.value ="search";
     input.addEventListener("click" , searchHistory);*/
//    historySearchDiv.appendChild(input);
});