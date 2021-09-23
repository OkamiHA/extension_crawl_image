var links = [].slice.apply(document.getElementsByTagName('img'));
links = links.filter(function (element) {
  var flag = false
  if (element.getAttribute("data-srcset")) {
    flag = true
  }
  return flag;
}).map(function (element) {
  var dataImage = {};
  var imageAlt = element.getAttribute("alt")
  imageAlt = imageAlt.replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<")
    .replace(/&quot;/g, "\"").replace(/&#39;/g, "\'").replace(/[\/:*?\"<>|]/g, "");
  dataImage["name"] = imageAlt + ".jpeg";
  var imageSourceSets = element.getAttribute("data-srcset");
  if (imageSourceSets) {
    var listImageSourceSet = imageSourceSets.split(",");
    listImageSourceSet.sort();
    for (const imageSourceSet of listImageSourceSet) {
      var dataImageSource = imageSourceSet.trim().split(" ");
      var imageWidth = dataImageSource[dataImageSource.length - 1];
      imageWidth = imageWidth.replace("w", "").trim();
      if (Number(imageWidth) >= 1000) {
        dataImage["src"] = "https:" + dataImageSource[0].trim();
        return dataImage;
      }
    }
  }
});
chrome.runtime.sendMessage(links);