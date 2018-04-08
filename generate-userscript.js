const constants = require('./constants');
const fs = require('fs');
const path = require('path');

relPath = p => path.resolve(__dirname, p);

let fileContents = fs.readFileSync(relPath('./src/echo720.user.js'), {
    encoding: 'utf-8'
});

for (const [from, to] of Object.entries(constants)) {
    fileContents = fileContents.replace(new RegExp(from, 'g'), to);
}

fs.writeFileSync(relPath('./dist/echo720.user.js'), fileContents); 
fs.copyFileSync(relPath('./src/main.css'), relPath('./dist/main.css'));