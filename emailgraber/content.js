const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

function grabEmails() {
  const emails = document.body.innerText.match(emailRegex) || [];
  if (emails.length > 0) {
    chrome.runtime.sendMessage({ emails });
  }
}

window.onload = () => {
  grabEmails();
};

new MutationObserver(grabEmails).observe(document.body, {
  childList: true,
  subtree: true
});

window.addEventListener('load', grabEmails);
window.addEventListener('scroll', grabEmails);
