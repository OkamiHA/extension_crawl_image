console.log("content started");
chrome.runtime.onMessage.addListener(StartDownload);
var ImgDiv= document.getElementById('SearchResultsGrid').getElementsByClassName('styles__image--G1zaZ styles__productImage--3ZNPD styles__rounded--Mb445 styles__fluid--1Qsjf');
console.log(ImgDiv.length);
chrome.runtime.sendMessage({
  from:"content",
  txt:"loaded"
});
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
      for (img of ImgDiv){		
      	var ImgURL = Magni(img.src);
    		var ImgName = img.alt;
        console.log(ImgName);
        console.log(ImgURL);
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
        var nextLI=document.getElementsByClassName('Pagination__namedLinkContainer--3tpXL Pagination__nextPage--hEGxJ');
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
        var nextLink=nextLI[0].getElementsByClassName('Pagination__namedLink--1dOFn');
        if (nextLink[0]==null) {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.redbubble.com/"
          });
          alert("down xong rồi");
          return;
        }
        if (nextLink[0].href=="https://www.redbubble.com/") {
          chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.redbubble.com/"
          });
          alert("down xong rồi");
          return;
        }
        chrome.runtime.sendMessage({
          from:"content",
          txt:"continue",
          remain: mes.remain-1,
          url: nextLink[0].href
        });
      }else{
        chrome.runtime.sendMessage({
            from:"content",
            txt:"finished",
            remain: 0,
            url: "https://www.redbubble.com/"
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
  if (url.indexOf(",front")!=-1){
    if (url.indexOf("/ctkr,")!=-1){
      url=url.substring(0,url.lastIndexOf("/")+1);
      url=url+"/ctkr,x3200,front,black-c,550,650,1000,1000-bg,ffffff.jpg";
    }else if(url.indexOf("/gptr,")!=-1||url.indexOf("/ssrco,chiffon_top,")!=-1){
      url=url.substring(0,url.lastIndexOf("/")+1);
      url=url+"/gpt,mens,750x1000,black,small-pad,1001x1000,f8f8f8.jpg";
    }else{
      var collorcode=url.substring(0,url.lastIndexOf(",front"));
      var collorcode=collorcode.substring(collorcode.lastIndexOf(",")+1);
      url=url.substring(0,url.lastIndexOf("/")+1);
      //url=url+"ssrco,classic_tee,mens,"+collorcode+",front_alt,square_product,1000x1000.jpg";
      url=url+"ssrco,slim_fit_t_shirt,flatlay,"+collorcode+",front,wide_portrait,1041x1041-bg,ffffff.u2.jpg";
    }
  }else if (url.indexOf("/poster,")!=-1){
    url=url.substring(0,url.lastIndexOf("/")+1);
    url=url+"pp,950x950-pad,1000x1000,ffffff.jpg";
  }else{
    url=url.replace(",f8f8f8-pad,",",ffffff-pad,");
    url=url.replace(",f8f8f8.",",ffffff.");
  	url=url.replace("600x600","1000x1000");
  	url=url.replace("x600-bg","x1000-bg");
  	url=url.replace("600,600-bg","1000,1000-bg");
  }
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