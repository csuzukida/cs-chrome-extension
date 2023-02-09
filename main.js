/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
/* eslint-disable no-cond-assign */
/* eslint-disable no-continue */
const words = [];

function censor() {
  const queue = [document.body];
  let curr;
  const images = document.querySelectorAll('img');
  for (const image of images) {
    for (const word of words) {
      if (image.alt.toLowerCase().includes(word.toLowerCase())) {
        image.remove();
      }
    }
  }

  while (curr = queue.pop()) {
    for (const word of words) {
      if (curr.textContent.toLowerCase().match(word)) {
        for (let i = 0; i < curr.childNodes.length; i += 1) {
          switch (curr.childNodes[i].nodeType) {
            case Node.TEXT_NODE: // 3
              for (const word of words) {
                if (curr.childNodes[i].textContent.toLowerCase().includes(word.toLowerCase())) {
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
censor();

const title = document.createElement('h3');
title.setAttribute('id', 'extension-title');
title.innerText = 'TRIGGER WARNING EXTENSION';

const form = document.createElement('form');
form.innerHTML = `
<div class="form-container">
  <form onsubmit="addWord(); return false;">
  <label for="word" id="word-label">Word to censor:</label><br>
  <input type="text" id="word" name="word"><br>
  <input type="submit" value="Submit" id="extension-submit-btn">
  </form>
</div>
`;

const style = document.createElement('style');
style.innerText = `
  .form-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #extension-title {
    text-align: center;
  }

  #word-label {
    font-weight: bold;
    margin-bottom: -1rem;
  }

  #extension-submit-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    box-shadow: none;
    font-weight: bold;
  }
`;

document.head.appendChild(style);
document.body.appendChild(title);
document.body.appendChild(form);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const inputWord = document.querySelector('#word').value;
  if (inputWord !== '') words.push(inputWord);
  document.querySelector('#word').value = '';
  censor();
});
