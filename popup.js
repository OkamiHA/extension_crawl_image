var allLinks = [];
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function downloadCheckedLinks() {
  for (var i = 0; i < allLinks.length; ++i) {
    chrome.downloads.download({
      url: allLinks[i].src,
      filename: allLinks[i].name
    });
    if (i % 50 === 0){
      await sleep(2000);
    }   
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
  document.getElementById("resultCrawler").innerHTML = "Finding images...";
  document.getElementById("resultCrawler").style.color = "blue";
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id },
      function (activeTabs) {
        var currentUrl = activeTabs[0].url;
        document.getElementById("currentUrl").value = currentUrl;
        if (currentUrl.toString().includes("wanderprints")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "./content-scripts/wanderprints-content.js", allFrames: true });
        }
        else if (currentUrl.toString().includes("yeahhcustom")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "./content-scripts/yeahhcustom-content.js", allFrames: true });
        }
        else if (currentUrl.toString().includes("atzprint")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "./content-scripts/atzprint-content.js", allFrames: true });
        }
        else if (currentUrl.toString().includes("bestie-inc")){
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "./content-scripts/bestie-inc-content.js", allFrames: true });
        }
        else {
          chrome.tabs.executeScript(
            activeTabs[0].id, { file: "./content-scripts/shoptify-content.js", allFrames: true });
        } 
      });
  });
};