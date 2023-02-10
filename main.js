/* eslint-disable no-shadow */
/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
/* eslint-disable no-cond-assign */
/* eslint-disable no-continue */
let words = [];

function censor() {
  chrome.storage.local.get(['words'], (result) => {
    const words = result.words || [];
    const queue = [document.body];
    const images = document.querySelectorAll('img');
    let curr;
    for (const image of images) {
      for (const word of words) {
        if (image
          .alt
          .toLowerCase()
          .includes(word.toLowerCase())) {
          image.remove();
        }
      }
      while (curr = queue.pop()) {
        for (const word of words) {
          if (curr.textContent.toLowerCase().match(word)) {
            for (let i = 0; i < curr.childNodes.length; i += 1) {
              switch (curr.childNodes[i].nodeType) {
                case Node.TEXT_NODE: // 3
                  for (const word of words) {
                    if (curr.childNodes[i]
                      .textContent
                      .toLowerCase()
                      .includes(word.toLowerCase())) {
                      curr.remove();
                    }
                  }
                  break;
                case Node.ELEMENT_NODE: // 1
                  queue.push(curr.childNodes[i]);
                  break;
              }
            }
          }
        }
      }
    }
  });
}

chrome.storage.local.get(['words'], function(result) {
  console.log(result);
  words = result.words || [];
  censor();
});

const form = document.createElement('form');
form.innerHTML = `
<div id="form-container">
  <h3>TRIGGER WARNING EXTENSION</h3>
  <form onsubmit="addWord(); return false;">
  <label for="word" id="word-label">Submitting when blank will remove all previously censored words</label><br>
  <input type="text" id="word" name="word" placeholder="Enter the word to censor here..."><br>
  <input type="submit" value="Submit" id="extension-submit-btn">
  </form>
</div>
`;

const style = document.createElement('style');
style.innerText = `
  #form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 500px;
    margin: 50px auto;
    border-radius: 10px;
    background-color: lightgray;
    padding: 10px;

  #extension-title {
    text-align: center;
  }

  #word-label {
    font-weight: bold;
    margin-bottom: -1rem;
  }

  #extension-submit-btn {
    padding: 10px 20px !important;
    border: none !important;
    border-radius: 4px !important;
    box-shadow: none !important;
    font-weight: bold !important;
  }
`;

document.head.appendChild(style);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputWord = document.querySelector('#word').value;
  if (inputWord !== '') {
    words.push(inputWord);
    chrome.storage.local.set({ words: words }, () => {
      console.log('Words updated to: ', words);
    });
  } else {
    chrome.storage.local.set({ words: [] }, () => {
      console.log('Words cleared!');
      location.reload();
    });
  }
  document.querySelector('#word').value = '';
  censor();
});
