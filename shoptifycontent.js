var links = [].slice.apply(document.getElementsByTagName('img'));
var prefixImageId = "ProductCardImage-collection-template";
links = links.filter(function (element) {
  var flag = false
  if (element.getAttribute("id")){
    if (element.getAttribute("data-src") && element.getAttribute("id").includes(prefixImageId)) {
      flag = true;
    }
    if (element.getAttribute("data-srcset") && element.getAttribute("id").includes(prefixImageId)){
      flag = true;
    }
  }
  return flag;
}).map(function (element) {
  // Return an anchor's href attribute, stripping any URL fragment (hash '#').
  // If the html specifies a relative path, chrome converts it to an absolute
  // URL.
  var dataImage = {};
  const illegalCharacters = "\/:*?\"<>|";
  var imageAlt = element.getAttribute("alt");
  for (const illegalCharacter of illegalCharacters){
    imageAlt = imageAlt.replace(illegalCharacter, "");
  }
  dataImage["name"] = imageAlt + ".jpeg";
  var imageSourceSet = element.getAttribute("data-srcset");
  var imageSource = element.getAttribute("data-src");
  var dataWidths = element.getAttribute("data-widths").replace("[", "").replace("]", "");
  var listWidth = dataWidths.split(",").map(Number);
  var validWidth = 0;
  for (const width of listWidth){
    if (width >= 1000){
      validWidth = width;
      break;
    }
  }
  if (imageSourceSet) {
    var listSourceSet = imageSourceSet.split(",");
    for (const urlSourceSet of listSourceSet){
      if (urlSourceSet.endsWith(validWidth.toString() + "w")){
        dataImage["src"] = "https:" + urlSourceSet.trim().split(" ")[0];
        return dataImage;
      }
    }
  }
  if (imageSource) {
    dataImage["src"] = "https:" + imageSource.replace("{width}", validWidth);
    return dataImage;

  }
});
chrome.runtime.sendMessage(links);