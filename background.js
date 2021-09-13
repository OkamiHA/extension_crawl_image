console.log("background started");
let pending = new Map();
let dirs = new Map();
let files = new Map();
var downloadremaining=0;
chrome.downloads.onChanged.addListener(function(info){
	if (info.state&&info.state.current!='in_progress'){
		downloadremaining--;
	}
});

chrome.runtime.onMessage.addListener(async function(request,sender){
	console.log(sender);
	console.log(request);
	if (request.from=="content"){
		if (request.txt=="loaded"){
			if (pending[sender.tab.id]!=null&&pending[sender.tab.id]>0){
				downloadImg(sender.tab.id,pending[sender.tab.id]);
			}
			pending[sender.tab.id]=0;
		}else if (request.txt=="continue"){
			pending[sender.tab.id]=request.remain;
			while (downloadremaining>0){
				console.log(downloadremaining);
				await sleep(1000);
			}
			chrome.tabs.update(sender.tab.id, {url: request.url});
		}else if (request.txt=="finished"){
			pending[sender.tab.id]=0;
		}else if (request.txt=="download"){
			while(downloadremaining>3){
				console.log(downloadremaining);
	        	await sleep(200);
	        }
			try{
				downloadremaining++;
				console.log(request.ImgName);
				chrome.downloads.download({
		            url:      request.ImgURL,
		            filename: dirs[sender.tab.id]+clearIll(request.ImgName,dirs[sender.tab.id])+getExt(request.ImgURL),
		            saveAs:   false
		        });
			}
	        catch(ex){
	        	downloadremaining--;
	        	console.log("error:"+ex+"\n\tAt"+dirs[sender.tab.id]+clearIll(request.ImgName,dirs[sender.tab.id])+getExt(request.ImgURL));
	        }
	    	//send msg
	   			chrome.tabs.sendMessage(sender.tab.id,{
	   				from: "background",
					txt: "download started"
	   			});
		}
	}else if (request.from=="popup"){
		if (request.txt=="getsimg"){
			pending[request.tab]=request.remain;
			if (request.folder!=null)
				dirs[request.tab]=request.folder+"\\";
			else
				dirs[request.tab]="";
			downloadImg(request.tab,pending[request.tab]);
		}
	}
});

function downloadImg(tab,type){
	var msg = {
		from: "background",
		txt: "getsimg",
		remain:type
	}
	chrome.tabs.sendMessage(tab,msg);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
function clearIll(name,dir){
	var ill="<>:\"\\/|?*"+String.fromCharCode(173);
	for (var char in ill){
		name=name.replaceAll(char,"");
	}
	while (name[0]==' '){
		name=name.substring(1);
	}
	if (files[(dir+name).hashCode()]!=null){
		files[(dir+name).hashCode()]++;
		return name+" Version "+files[(dir+name).hashCode()];
	}else{
		files[(dir+name).hashCode()]=0;
		return name;
	}
}
String.prototype.hashCode = function(){
	var thisstring=this.toLowerCase();
    var hash = 0;
    for (var i = 0; i < thisstring.length; i++) {
        var character = thisstring.charCodeAt(i);
        hash = ((hash<<5)-hash)+character;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}
function getExt(url){
	var res=url.substring(url.lastIndexOf("."));
	if (res.indexOf("?")!=-1)
		res=res.substring(0,res.indexOf("?"));
	return res;
}