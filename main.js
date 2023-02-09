/* eslint-disable no-restricted-syntax */
/* eslint-disable default-case */
/* eslint-disable no-cond-assign */
/* eslint-disable no-continue */
const words = ['howdy'];

function censor() {
  console.log('censor function called');
  console.log(words);
  const queue = [document.body];
  let curr;
  const images = document.querySelectorAll('img');
  for (const image of images) {
    for (const word of words) {
      if (image.alt.toLowerCase().match(word)) {
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
                if (curr.childNodes[i].textContent.toLowerCase().match(word)) {
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

function popupFunction() {
  console.log('popup func running');
  // document.querySelector('form').addEventListener('submit', (e) => {
  // e.preventDefault();
  const word = document.querySelector('#word').value;
  document.querySelector('#word').value = '';
  console.log(word);
  words.push(word);
  censor();
  // });
}

// document.getElementById('submit_button').addEventListener('click', popupFunction());
censor();
