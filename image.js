const fs = require("fs");               // write files
const path = require('path');           // reading file extension
const sizeOf = require('image-size');   // reading image sizes
const glob = require("glob");           // reading multiple wildcard directories


glob("src/images/**/*", function (err, files) {
    if (err) console.error(err);

    let fileData = [];

    files.map((file) => {
        let ext = path.extname(file);
        if (ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".svg") {
            let folder = file.split('/')[2];
            let fileName = file.split('/')[3].split('.').slice(0, -1).join('.');
            let variableName = fileName.replace(/-/g,'_');
            let width = sizeOf(file).width;
            let height = sizeOf(file).height;
            fileData.push({ file, folder, fileName, variableName, width, height, ext });
            console.log("\x1b[32m", file, "\x1b[0m");
        }
    });

    writeCode(fileData);
});


function writeCode(fileData) {
    let _html = "";
    let _css = "";
    let _variables = "";
    let _selectors = "";
    let _js = "";
    let current_folder;


    fileData.map(({ file, folder, fileName, variableName, width, height, ext }) => {
        if (current_folder === folder) {
            _html += `<div id="frame_${variableName}" class="pos-abs hide"></div>\n`
            _css += `#frame_${variableName} { \n\u0020\u0020width: ${width}px;\n\u0020\u0020height: ${height}px;\n\u0020\u0020background-image: url(${fileName + ext});\n\u0020\u0020background-size: ${width}px ${height}px;\n\u0020\u0020top: 0;\n\u0020\u0020left: 0;\n}\n`
            _variables += `let $frame_${variableName};\n`
            _selectors += `$frame_${variableName} = document.getElementById("frame_${variableName}");\n`
        }
        if (current_folder !== folder) {
            current_folder = folder;
            _html += `\n/* ${folder} */\n<div id="frame_${variableName}" class="pos-abs hide"></div>\n`
            _css += `\n\n\n\n/* ${folder} */\n#frame_${variableName} { \n\u0020\u0020width: ${width}px;\n\u0020\u0020height: ${height}px;\n\u0020\u0020background-image: url(${fileName + ext});\n\u0020\u0020background-size: ${width}px ${height}px;\n\u0020\u0020top: 0;\n\u0020\u0020left: 0;\n}\n`
            _variables += `\n// ${folder}\nlet $frame_${variableName};\n`
            _selectors += `\n// ${folder}\n$frame_${variableName} = document.getElementById("frame_${variableName}");\n`
        }
    });

    _js += _variables + _selectors;


    fs.writeFile('./src/data/_images.html', _html, (err) => {
        if (err) console.error(err)
    });
    fs.writeFile('./src/data/_images.css', _css, (err) => {
        if (err) console.error(err)
    });
    fs.writeFile('./src/data/_images.js', _js, (err) => {
        if (err) console.error(err)
    });
}

