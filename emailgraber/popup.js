document.getElementById('refresh').addEventListener('click', refreshEmails);
document.getElementById('copyAll').addEventListener('click', copyAllEmails);
document.getElementById('cleanEmails').addEventListener('click', cleanEmails);

function refreshEmails() {
  chrome.runtime.sendMessage({ request: 'getEmails' }, (response) => {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    updateEmailCount(response.emails.length);
    response.emails.forEach(email => {
      const li = document.createElement('li');
      const emailSpan = document.createElement('span');
      emailSpan.textContent = email;
      emailSpan.className = 'email';
      
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.className = 'copy-btn';
      copyBtn.addEventListener('click', () => {
        copyToClipboard(email);
      });

      li.appendChild(emailSpan);
      li.appendChild(copyBtn);
      emailList.appendChild(li);
    });
  });
}

function copyAllEmails() {
  chrome.runtime.sendMessage({ request: 'getEmails' }, (response) => {
    const emails = response.emails.join('\n');
    copyToClipboard(emails);
    showMessage('Emails copied to clipboard');
  });
}

function cleanEmails() {
  chrome.runtime.sendMessage({ request: 'cleanEmails' }, () => {
    const emailList = document.getElementById('emailList');
    emailList.innerHTML = '';
    updateEmailCount(0);
  });
}

function updateEmailCount(count) {
  const emailCount = document.getElementById('emailCount');
  emailCount.textContent = `Emails Collected: ${count}`;
}

function copyToClipboard(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function showMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.textContent = message;
  messageElement.style.position = 'fixed';
  messageElement.style.bottom = '10px';
  messageElement.style.left = '10px';
  messageElement.style.backgroundColor = '#4CAF50';
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px';
  messageElement.style.borderRadius = '5px';
  document.body.appendChild(messageElement);

  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, 3000);
}

// Initial load of emails
refreshEmails();

// Update email list dynamically when new emails are collected
chrome.runtime.onMessage.addListener((message) => {
  if (message.emails) {
    refreshEmails();
  }
});
