var allLinks = [];
function downloadCheckedLinks() {
  for (var i = 0; i < allLinks.length; ++i) {
    chrome.downloads.download({
      url: visibleLinks[i].src,
      filename: visibleLinks[i].name
    });   
  }
  alert("Download success!");

}


chrome.runtime.onMessage.addListener(function (links) {
  var resultCrawler = "Find " + links.length + " image(s) in this site";
  document.getElementById("resultCrawler").innerHTML = resultCrawler;
  chrome.browserAction.setBadgeText({text: links.length.toString()});
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
        document.getElementById("currentUrl").value = activeTabs[0].url;
        chrome.tabs.executeScript(
          activeTabs[0].id, { file: "shoptifycontent.js", allFrames: true });
      });
  });
};