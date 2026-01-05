
# Markdown to PDF Converter

A Node.js utility that converts markdown files to styled PDF documents recursively.

## Features

- Recursive markdown file discovery
- Professional PDF formatting with headers and footers
- Custom CSS styling for consistent output
- Batch conversion with error handling
- Configurable output directory

## Installation

```bash
npm install
```

## Usage

```bash
node convert_md_to_pdf.js <input_folder> [output_folder]
```

### Examples

```bash
# Convert all .md files in current folder
node convert_md_to_pdf.js ./docs

# Convert and save PDFs to specific folder
node convert_md_to_pdf.js ./docs ./output
```

## Configuration

- **PDF Format**: A4 with 15-20mm margins
- **Styling**: Defined in `pdf-style.css`
- **Header/Footer**: Automatic page numbering and document title

## Files

- `convert_md_to_pdf.js` - Main conversion script
- `pdf-style.css` - PDF styling rules
- `package.json` - Dependencies
