const { mdToPdf } = require('md-to-pdf');
const fs = require('fs');
const path = require('path');


function ensureFolder(targetPath) {
    const resolvedPath = path.resolve(targetPath);

    if (!fs.existsSync(resolvedPath)) {
        fs.mkdirSync(resolvedPath, { recursive: true });
        console.log("📁 Created folder:", resolvedPath);
    } else {
        console.log("✔ Folder already exists:", resolvedPath);
    }
    return resolvedPath;
}

function getMarkdownFilesRecursive(dir) {
    const absolutePath = path.resolve(dir);
    let results = [];

    fs.readdirSync(absolutePath, { withFileTypes: true }).forEach(entry => {
        const fullPath = path.join(absolutePath, entry.name);

        if (entry.isDirectory()) {
            results = results.concat(getMarkdownFilesRecursive(fullPath));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
	    if( fullPath.indexOf('node_modules') == -1 ){
	       results.push(fullPath);
	    }
        }
    });

    return results;
}

const inputPath = process.argv[2];

let inputPdfPath = process.argv[3];

if( inputPdfPath ){
  const absolutePath = ensureFolder(inputPdfPath);
  inputPdfPath = absolutePath + "\\" ;
}

if (!inputPath) {
    console.error("Usage: node script.js <folder_path>");
    process.exit(1);
}

const mdFiles = getMarkdownFilesRecursive(inputPath);

// PDF configuration for better formatting
const pdfConfig = {
    pdf_options: {
        format: 'A4',
        margin: {
            top: '20mm',
            right: '15mm',
            bottom: '20mm',
            left: '15mm'
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">HRMS Documentation</div>',
        footerTemplate: '<div style="font-size: 10px; text-align: center; width: 100%; color: #666;"><span class="pageNumber"></span> / <span class="totalPages"></span></div>'
    },
    stylesheet: `pdf-style.css`
};

function toTitleCase(str, pad = ' ', join = ' ') {
    if (!str) {
      return ""; // Handle empty or null strings
    }
    return str
      .toLowerCase() // Convert the entire string to lowercase
      .split(pad) // Split the string into an array of words
      .map((word) => {
        // Capitalize the first letter of each word
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(join); // Join the words back into a string
}

async function convertToPdf() {
    console.log('Starting PDF conversion...\n');
    
    for (const mdFile of mdFiles) {
        try {
            const mdPath = path.resolve(mdFile);
            let pdfPath = mdPath.replace('.md', '.pdf');
            const pdfFileName = pdfPath.substring(pdfPath.lastIndexOf('\\') + 1);
            const pdfFile = toTitleCase(pdfFileName,'_','');
            pdfPath = pdfPath.replace(pdfFileName, pdfFile);
            if( inputPdfPath ){
                pdfPath = inputPdfPath + pdfFile;
            }
            if (!fs.existsSync(mdPath)) {
                console.log(`⚠️  File not found: ${mdFile}`);
                continue;
            }
            
            console.log(`Converting: ${mdFile}...${pdfFile}`);

            pdfConfig.pdf_options.headerTemplate = `<div style="font-size: 10px; text-align: center; width: 100%; color: #666;">${pdfFileName}</div>`;
            
            const pdf = await mdToPdf({ path: mdPath }, pdfConfig);
            if (pdf) {
                fs.writeFileSync(pdfPath, pdf.content);
                console.log(`✅ Created: ${pdfPath}\n`);
            } else {
                console.log(`❌ Failed to convert: ${mdFile}\n`);
            }
        } catch (error) {
            console.error(`❌ Error converting ${mdFile}:`, error.message);
        }
    }
    
    console.log('Conversion complete!');
}

convertToPdf().catch(console.error);

