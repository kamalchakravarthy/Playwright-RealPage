import fs = require('fs/promises');

export async function createFile(filename: string, initialContent: string) {
    try {
        await fs.writeFile(filename, initialContent);
        console.log(`File "${filename}" created successfully.`);
    } catch (err) {
        console.error('Error creating the file:', err);
    }
}

export async function appendToFile(filename: string, additionalContent: string) {
    try {
        await fs.appendFile(filename, additionalContent);
        console.log('Content appended successfully.');
    } catch (err) {
        console.error('Error appending to the file:', err);
    }
}

export async function readFileContent(filename: string) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        console.log('File content:');
        console.log(data);
    } catch (err) {
        console.error('Error reading the file:', err);
    }
}

export async function deleteFile(fileAbsPath) {
    try {
        await fs.unlink(fileAbsPath);
        console.log('File deleted successfully!');
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('File not present.');
        } else {
            console.error('Error deleting the file:', err);
        }
    }
}
