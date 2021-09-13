$( document ).ready(function() {
	var	currentTab;
	chrome.tabs.query({active: true, currentWindow: true},function(tabs){   
		currentTab = tabs[0];
	});
	$("#pagenum").change(function() {
		$( "#bt_one" ).html($("#pagenum").val()+" Pages");
	});
    $( "#bt_one" ).click(function() {
	  	chrome.runtime.sendMessage({
          	from:"popup",
          	txt:"getsimg",
          	folder:$("#Folder").val(),
          	remain:toInt($("#pagenum").val()),
          	tab: currentTab.id
        });
	});
	$( "#bt_all" ).click(function() {
		chrome.runtime.sendMessage({
          	from:"popup",
          	txt:"getsimg",
          	folder:$("#Folder").val(),
          	remain: 100000000,
          	tab: currentTab.id
        });
	});
});

function toInt(num){
	var res= parseInt(num);
	if (isNaN(res)){
		res=0;
	}
	return res;
}