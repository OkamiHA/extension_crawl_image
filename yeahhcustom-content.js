async function main(){
    var links = [];
    var allLinks = [].slice.apply(document.getElementsByTagName('a'));
    var validClassAttribute = "snize-view-link";
    var validLinks = allLinks.filter(function (element) {
        var flag = false
        let classAttribute = element.getAttribute("class");
        if (classAttribute && classAttribute.includes(validClassAttribute)) {
            flag = true;
        }
        return flag;
    }).map(function (element) {
        return productUrl = "https://yeahhcustom.com" + element.getAttribute("href");
    });
    for (const validLink of validLinks) {
        var response = await fetch(validLink);
        var html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, "text/html");
        var imageTag = [].slice.apply(doc.getElementsByTagName('img'));
        imageTag = imageTag.filter(function (element) {
            var flag = false
            if (element.getAttribute("srcset") && element.getAttribute("data-index") == 0){
              flag = true
            }
            return flag;
          }).map(function (element) {
            var dataImage = {};
            const illegalCharacters = "\/:*?\"<>|";
            var imageAlt = element.getAttribute("alt");
            for (const illegalCharacter of illegalCharacters){
              imageAlt = imageAlt.replace(illegalCharacter, "");
            }
            dataImage["name"] = imageAlt + ".jpeg";
            var imageSourceSets = element.getAttribute("srcset");
            if (imageSourceSets){
                var listImageSourceSet = imageSourceSets.split(",");
                listImageSourceSet.sort();
                for (const imageSourceSet of listImageSourceSet){
                    var dataImageSource = imageSourceSet.trim().split(" ");
                    var imageWidth = dataImageSource[dataImageSource.length - 1];
                    imageWidth = imageWidth.replace("w", "").trim();
                    if (Number(imageWidth) >= 1000){
                        dataImage["src"] = "https:" + dataImageSource[0].trim();
                        return dataImage;
                    }
                }
            }
        });
        links.push(imageTag[0]);
    }
    chrome.runtime.sendMessage(links);
}
main();
