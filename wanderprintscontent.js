var links = [].slice.apply(document.getElementsByTagName('img'));
links = links.filter(function (element) {
  var flag = false
  if (element.getAttribute("data-srcset")) {
    flag = true
  }
  return flag;
}).map(function (element) {
  var dataImage = {};
  const illegalCharacters = "\/:*?\"<>|";
  var imageAlt = element.getAttribute("alt")
  imageAlt = imageAlt.replaceAll('&amp;', "&").replaceAll('&gt;', ">").replaceAll('&lt;', "<")
    .replaceAll('&quot;', "\"").replaceAll('&#39;', "\'");
  for (const illegalCharacter of illegalCharacters) {
    imageAlt = imageAlt.replaceAll(illegalCharacter, "");
  }
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