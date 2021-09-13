// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This extension demonstrates using chrome.downloads.download() to
// download URLs.

var allLinks = [];
var visibleLinks = [];

// Display all visible links.
function showLinks() {
  var linksTable = document.getElementById('links');
  while (linksTable.children.length > 1) {
    linksTable.removeChild(linksTable.children[linksTable.children.length - 1])
  }
  for (var i = 0; i < visibleLinks.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var col1 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'check' + i;
    col0.appendChild(checkbox);
    col1.innerText = visibleLinks[i].src;
    col1.style.whiteSpace = 'nowrap';
    col1.onclick = function () {
      checkbox.checked = !checkbox.checked;
    }
    row.appendChild(col0);
    row.appendChild(col1);
    linksTable.appendChild(row);
  }
}

// Toggle the checked state of all visible links.
function toggleAll() {
  var checked = document.getElementById('toggle_all').checked;
  for (var i = 0; i < visibleLinks.length; ++i) {
    document.getElementById('check' + i).checked = checked;
  }
}

// Download all visible checked links.
function downloadCheckedLinks() {
  for (var i = 0; i < visibleLinks.length; ++i) {
    if (document.getElementById('check' + i).checked) {
      chrome.downloads.download({
        url: visibleLinks[i].src,
        filename: visibleLinks[i].name
      });
    }
  }
}

// Add links to allLinks and visibleLinks, sort and show them.  send_links.js is
// injected into all frames of the active tab, so this listener may be called
// multiple times.
chrome.runtime.onMessage.addListener(function (links) {
  console.log(links);
  var resultCrawler = "Find " + links.length + " image(s) in this site";
  document.getElementById("resultCrawler").innerHTML = resultCrawler;
  if (links.length > 0) {
    document.getElementById("resultCrawler").style.color = "green";
  }
  else {
    document.getElementById("resultCrawler").style.color = "red";
  }
  console.log(resultCrawler);
  for (var dataLink of links) {
    console.log(dataLink);
    allLinks.push(dataLink);
  }
  visibleLinks = allLinks;
  showLinks();
});
window.onload = function () {
  document.getElementById('toggle_all').onchange = toggleAll;
  document.getElementById('download0').onclick = downloadCheckedLinks;

  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query({ active: true, windowId: currentWindow.id },
      function (activeTabs) {
        document.getElementById("currentUrl").value = activeTabs[0].url;
        chrome.tabs.executeScript(
          activeTabs[0].id, { file: 'shoptifycontent.js', allFrames: true });
      });
  });
};