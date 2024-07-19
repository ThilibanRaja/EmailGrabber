let allEmails = new Set();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.emails) {
    message.emails.forEach(email => allEmails.add(email));
    saveEmails();
  }

  if (message.request === 'getEmails') {
    loadEmails(() => {
      sendResponse({ emails: Array.from(allEmails) });
    });
    return true; // Indicates async response
  }

  if (message.request === 'cleanEmails') {
    allEmails.clear();
    chrome.storage.local.remove('collectedEmails', () => {
      sendResponse({});
    });
    return true; // Indicates async response
  }
});

function saveEmails() {
  chrome.storage.local.set({ collectedEmails: Array.from(allEmails) });
}

function loadEmails(callback) {
  chrome.storage.local.get('collectedEmails', (result) => {
    if (result.collectedEmails) {
      allEmails = new Set(result.collectedEmails);
    }
    callback();
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
  }
});
