const path = require('path');
const fs = require('fs');

const b2cDir = path.join(__dirname, '..', 'templates', 'java-b2c');
const standardDir = path.join(__dirname, '..', 'templates', 'java-standard');

readDirectory(b2cDir, standardDir);

function readDirectory(fromDir, toDir) {
    try {
        const files = fs.readdirSync(fromDir);

        files.forEach((file) => {
            const filePath = path.join(fromDir, file);
            const stats = fs.statSync(filePath);

            if (stats.isFile()) {
                const targetFilePath = filePath.replace(fromDir, toDir);
                const content = fs.readFileSync(filePath, 'UTF-8');
                const targetContent = content
                    .replaceAll('/{packageName}/condition/', '/condition/{packageName}/')
                    .replaceAll('/{packageName}/domain/', '/domain/{packageName}/')
                    .replaceAll('.${packageName}.condition', '.condition.${packageName}')
                    .replaceAll('.${packageName}.domain', '.domain.${packageName}');
                writeFileSync(targetFilePath, targetContent)
            } else if (stats.isDirectory()) {
                // 递归读取子目录
                readDirectory(filePath);
            }
        });
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

function writeFileSync(filePath, fileContent) {
    const directoryPath = path.dirname(filePath);

    try {
        fs.mkdirSync(directoryPath, {recursive: true});
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }

    fs.writeFileSync(filePath, fileContent, 'UTF-8');
}
