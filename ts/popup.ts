// Open a new tab as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function (): void {
  // chrome.tabs.create({url: 'html/map.html'});
  chrome.windows.create({ url: 'html/map.html' });
});