var links = [].slice.apply(document.getElementsByTagName('a'));
var validClassAttribute = "snize-view-link";
links = links.filter(function (element) {
    var flag = false
    let classAttribute = element.getAttribute("class");
    if (classAttribute && classAttribute.includes(validClassAttribute)) {
        flag = true;
    }
    return flag;
}).map(function (element) {
    let productUrl = "https://yeahhcustom.com" + element.getAttribute("href");
    var data = {};
    fetch(productUrl).then(function (response) {
        // The API call was successful!
        return response.text();
    }).then(function (html) {

        // Convert the HTML string into a document object
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');

        // Get the image file
        listImgTag = [].slice.apply(doc.getElementsByTagName('img'));
        // listImgTag = listImgTag.filter(function (docElement) {
        //     let docFLag = false;
        //     if (docElement.getAttribute("data-srcset")) {
        //         docFLag = true;
        //     }
        //     return docFLag;
        // }).map(function (docElement) {
        //     const illegalCharacters = "\/:*?\"<>|";
        //     var imageAlt = docElement.getAttribute("alt");
        //     let dataImage = {};
        //     for (const illegalCharacter of illegalCharacters) {
        //         imageAlt = imageAlt.replace(illegalCharacter, "");
        //     }
        //     dataImage["name"] = imageAlt + ".jpeg";
        //     var imageSourceSets = docElement.getAttribute("data-srcset");
        //     if (imageSourceSets) {
        //         var listImageSourceSet = imageSourceSets.split(",");
        //         listImageSourceSet.sort();
        //         for (const imageSourceSet of listImageSourceSet) {
        //             var dataImageSource = imageSourceSet.trim().split(" ");
        //             var imageWidth = dataImageSource[dataImageSource.length - 1];
        //             imageWidth = imageWidth.replace("w", "").trim();
        //             if (Number(imageWidth) >= 1000) {
        //                 dataImage["src"] = "https:" + dataImageSource[0].trim();
        //                 return dataImage;
        //             }
        //         }
        //     }

        // });
        // if (listImgTag) {
        //     return listImgTag[0];
        // }
        data = {"src": listImgTag, "name":"Unknown"};
    });
    console.log(data);
    return data;
});
chrome.runtime.sendMessage(links);