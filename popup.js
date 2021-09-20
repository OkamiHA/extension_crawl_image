var allLinks = [];
function downloadCheckedLinks() {
  for (var i = 0; i < allLinks.length; ++i) {
    chrome.downloads.download({
      url: allLinks[i].src,
      filename: allLinks[i].name
    });   
  }
  if (allLinks.length > 0){
    var resultDownload = "Download success!";
    document.getElementById("resultDownload").innerHTML = resultDownload;
  }
}



chrome.runtime.onMessage.addListener(function (links) {
  var resultCrawler = "Find " + links.length + " image(s) in this site";
  document.getElementById("resultCrawler").innerHTML = resultCrawler;
  chrome.browserAction.setBadgeText({text: links.length.toString()});
  console.log(links);
  if (links.length > 0) {
    document.getElementById("resultCrawler").style.color = "green";
  }
  else {
    document.getElementById("resultCrawler").style.color = "red";
  }
  for (var dataLink of links) {
    console.log(dataLink);
    allLinks.push(dataLink);
  }
});


window.onload = function () {
  document.getElementById("download0").onclick = downloadCheckedLinks;

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id },
      function (activeTabs) {
        var currentUrl = activeTabs[0].url;
        document.getElementById("currentUrl").value = currentUrl;
        if (currentUrl.toString().includes("wanderprints")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "wanderprintscontent.js", allFrames: true });
        }
        if (currentUrl.toString().includes("yeahhcustom")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "yeahhcustom-content.js", allFrames: true });
        }
        else {
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "shoptifycontent.js", allFrames: true });
        } 
      });
  });
};