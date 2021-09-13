console.log("content started");
chrome.runtime.onMessage.addListener(StartDownload);
var ImgDiv= document.querySelectorAll('div[data-search-results]');
if (ImgDiv[0]!=null)
  ImgDiv=ImgDiv[0].querySelectorAll('a.listing-link[data-palette-listing-image]');
else
  ImgDiv=null;
if (ImgDiv!=null){
  console.log(ImgDiv.length);
  chrome.runtime.sendMessage({
    from:"content",
    txt:"loaded"
  });
}
var unstarted_download=0;
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function StartDownload(mes,sender,sendRes){
  console.log(mes);
  if (mes.from=="background"){
  	if (mes.txt== "getsimg"){
      console.log("download start");
      window.scrollTo({
          top: 0,
          left: 0
        }); 
      await sleep(200);
      
      var Scrltop=0;
      var max=document.body.scrollHeight;
      while (Scrltop<max){
            Scrltop=Scrltop+500;
            window.scrollTo({
              top: Scrltop,
              left: 0
            }); 
            await sleep(50);
      }
      ImgDiv=document.querySelectorAll('div[data-search-results]')[0].querySelectorAll('a.listing-link[data-palette-listing-image]');
      for (img of ImgDiv){		
      	var ImgURL = Magni(img.querySelectorAll('img')[0].src);
    		var ImgName = img.title;
        console.log(ImgName);
        unstarted_download++;
        chrome.runtime.sendMessage({
          from:"content",
          txt:"download",
          ImgURL:ImgURL,
          ImgName:ImgName
        });
        while (unstarted_download>3){
          await sleep(200);
        }
      }
      while (unstarted_download>0){
        await sleep(1000);
      }
      if (mes.remain > 1){
        await sleep(200);
        var nextLI=document.querySelectorAll('div.appears-ready[data-search-pagination]');
        if (nextLI[0]==null) {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.redbubble.com/"
          });
          alert("down xong rồi");
          return;
        }
        var nextLink=nextLI[0].querySelectorAll('div.wt-show-xs.wt-hide-lg');
        if (nextLink[0]==null) {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.etsy.com/"
          });
          alert("down xong rồi");
          return;
        }
        var nextA=nextLink[0].querySelectorAll('a');
        if (nextA[1]==null) {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.etsy.com/"
          });
          alert("down xong rồi");
          return;
        }
        if (nextA[1].href=="") {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.etsy.com/"
          });
          alert("down xong rồi");
          return;
        }
        chrome.runtime.sendMessage({
          from:"content",
          txt:"continue",
          remain: mes.remain-1,
          url: nextA[1].href
        });
      }else{
        chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.etsy.com/"
          });
        alert("down xong rồi");
      }
  	}else if(mes.txt== "download started"){ 
      unstarted_download--;
      console.log(unstarted_download);
    }
  }
}
function Magni(url){
  if (url.indexOf("/il/")!=-1){
      url= "https://i.etsystatic.com/20301156/r"+url.substring(url.indexOf("/il/"));
    }
    url=url.replace("/il_340x270.","/il_1000xN.");
	return url;
}
function downloadURI(url, name) {
    if (!url) {
      throw new Error("Resource URL not provided! You need to provide one");
    }
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const blobURL = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobURL;
        a.style = "display: none";

        if (name && name.length) a.download = name;
        document.body.appendChild(a);
        a.click();
      })
      .catch();
  };