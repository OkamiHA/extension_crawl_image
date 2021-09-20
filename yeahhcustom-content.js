var links = [].slice.apply(document.getElementsByTagName('a'));
var validClassAttribute = "snize-view-link";
links = links.filter(function (element) {
    var flag = false
    let classAttribute = element.getAttribute("class");
    if (classAttribute && classAttribute.includes(validClassAttribute)) {
        flag = true;
    }
    return flag;
}).map(async function (element) {
    let productUrl = "https://yeahhcustom.com" + element.getAttribute("href");
    const response = await fetch(productUrl);
    const html = await response.text();
    // Convert the HTML string into a document object
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    // Get the image file
    listImgTag = [].slice.apply(doc.getElementsByTagName('img'));
    return { "src": listImgTag, "name": "Unknown" };
});
chrome.runtime.sendMessage(links);