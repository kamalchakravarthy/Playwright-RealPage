import * as fs from 'fs';
import * as archiver from 'archiver';

/**
 * Zips the specified directory.
 * 
 * @param source The source directory containing the files to zip.
 * @param out The output path for the zip file.
 */
async function zipDirectory(source: string, out: string): Promise<void> {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(out);

    return new Promise((resolve, reject) => {
        archive
            .directory(source, false)
            .on('error', err => reject(err))
            .pipe(stream);

        stream.on('close', () => resolve());
        archive.finalize();
    });
}

const sourceDir = './test-results/reports'; // Update this path
const outputPath = './test-results/reports.zip'; // Update this path

zipDirectory(sourceDir, outputPath)
    .then(() => console.log('Report zipped successfully.'))
    .catch(err => console.error('Error zipping report:', err));