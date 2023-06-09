const fs = require('fs');
var os = require('os');
const readFilePromise = (filename) => {
      console.log('Platform: ' + os.platform());
};

// Using the Promise
readFilePromise('example.txt');
//   .then((data) => {
//     console.log('File content:', data);
//   })
//   .catch((err) => {
//     console.error('Error:', err);
//   });
