import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';
import { FAQ_DATA, NOTICE_DATA, RULE_DATA } from './test-data.constant';
import PDFDocument from 'pdfkit';
import pptxgen from 'pptxgenjs';
import { Document, Packer, Paragraph, HeadingLevel } from 'docx';
const TEST_DATA_DIR = path.join(__dirname, 'testData');

function createTxtFiles() {
  const txtDir = path.join(TEST_DATA_DIR, 'txt');
  fs.mkdirSync(txtDir, { recursive: true });

  const faqText = [FAQ_DATA.txt.title, '', ...FAQ_DATA.txt.items.map((i) => `${i.q}\n${i.a}`)].join(
    '\n\n'
  );
  fs.writeFileSync(path.join(txtDir, 'faq.txt'), faqText, 'utf-8');

  fs.writeFileSync(path.join(txtDir, 'notice.txt'), NOTICE_DATA.txt.body, 'utf-8');

  const ruleText = [
    RULE_DATA.txt.title,
    '',
    ...RULE_DATA.txt.chapters.flatMap((c) => [
      c.title,
      ...c.articles.map((a) => `${a.num} ${a.content}`),
    ]),
  ].join('\n\n');
  fs.writeFileSync(path.join(txtDir, 'rule.txt'), ruleText, 'utf-8');

  console.log('Created TXT files');
}

function createMdFiles() {
  const mdDir = path.join(TEST_DATA_DIR, 'md');
  fs.mkdirSync(mdDir, { recursive: true });

  const faqMd = [
    `# ${FAQ_DATA.md.title}`,
    '',
    ...FAQ_DATA.md.items.map((i) => `## ${i.q}\n\n${i.a}`),
  ].join('\n\n');
  fs.writeFileSync(path.join(mdDir, 'faq.md'), faqMd, 'utf-8');

  const noticeMd = [
    `# ${NOTICE_DATA.md.title}`,
    '',
    `## ${NOTICE_DATA.md.subtitle}`,
    '',
    NOTICE_DATA.md.body,
  ].join('\n\n');
  fs.writeFileSync(path.join(mdDir, 'notice.md'), noticeMd, 'utf-8');

  const ruleMd = [
    `# ${RULE_DATA.md.title}`,
    '',
    ...RULE_DATA.md.chapters.flatMap((c) => [
      `## ${c.title}`,
      '',
      ...c.articles.map((a) => `${a.num} ${a.content}`),
    ]),
  ].join('\n\n');
  fs.writeFileSync(path.join(mdDir, 'rule.md'), ruleMd, 'utf-8');

  console.log('Created MD files');
}

function createPdfFiles() {
  const pdfDir = path.join(TEST_DATA_DIR, 'pdf');
  fs.mkdirSync(pdfDir, { recursive: true });

  const fontPath = 'C:\\Windows\\Fonts\\simhei.ttf';

  function createPdf(content: string, fileName: string, title: string) {
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(path.join(pdfDir, fileName)));
    doc.font(fontPath);
    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(content);
    doc.end();
  }

  const faqPdf = [FAQ_DATA.pdf.title, '', ...FAQ_DATA.pdf.items.map((i) => `${i.q}\n${i.a}`)].join(
    '\n\n'
  );
  createPdf(faqPdf, 'faq.pdf', FAQ_DATA.pdf.title);

  createPdf(NOTICE_DATA.pdf.body, 'notice.pdf', NOTICE_DATA.pdf.title);

  const rulePdf = [
    RULE_DATA.pdf.title,
    '',
    ...RULE_DATA.pdf.articles.map((a) => `${a.num} ${a.content}`),
  ].join('\n\n');
  createPdf(rulePdf, 'rule.pdf', RULE_DATA.pdf.title);

  console.log('Created PDF files (using SimHei font)');
}

async function createDocxFiles() {
  const docxDir = path.join(TEST_DATA_DIR, 'docx');
  fs.mkdirSync(docxDir, { recursive: true });

  const faqDocx = [
    FAQ_DATA.docx.title,
    '',
    ...FAQ_DATA.docx.items.map((i) => `${i.q}\n${i.a}`),
  ].join('\n\n');
  const doc1 = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: FAQ_DATA.docx.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: faqDocx }),
        ],
      },
    ],
  });
  fs.writeFileSync(path.join(docxDir, 'faq.docx'), await Packer.toBuffer(doc1));

  const doc2 = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: NOTICE_DATA.docx.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: NOTICE_DATA.docx.body }),
        ],
      },
    ],
  });
  fs.writeFileSync(path.join(docxDir, 'notice.docx'), await Packer.toBuffer(doc2));

  const ruleDocx = [
    RULE_DATA.docx.title,
    '',
    ...RULE_DATA.docx.articles.map((a) => `${a.num} ${a.content}`),
  ].join('\n\n');
  const doc3 = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({ text: RULE_DATA.docx.title, heading: HeadingLevel.HEADING_1 }),
          new Paragraph({ text: ruleDocx }),
        ],
      },
    ],
  });
  fs.writeFileSync(path.join(docxDir, 'rule.docx'), await Packer.toBuffer(doc3));

  console.log('Created DOCX files');
}

function createXlsxFiles() {
  const xlsxDir = path.join(TEST_DATA_DIR, 'xlsx');
  fs.mkdirSync(xlsxDir, { recursive: true });

  const wb1 = XLSX.utils.book_new();
  const ws1 = XLSX.utils.aoa_to_sheet([FAQ_DATA.xlsx.headers, ...FAQ_DATA.xlsx.rows]);
  XLSX.utils.book_append_sheet(wb1, ws1, 'FAQ');
  XLSX.writeFile(wb1, path.join(xlsxDir, 'faq.xlsx'));

  const wb2 = XLSX.utils.book_new();
  const ws2 = XLSX.utils.aoa_to_sheet([NOTICE_DATA.xlsx.headers, ...NOTICE_DATA.xlsx.rows]);
  XLSX.utils.book_append_sheet(wb2, ws2, '公告');
  XLSX.writeFile(wb2, path.join(xlsxDir, 'notice.xlsx'));

  const wb3 = XLSX.utils.book_new();
  const ws3 = XLSX.utils.aoa_to_sheet([RULE_DATA.xlsx.headers, ...RULE_DATA.xlsx.rows]);
  XLSX.utils.book_append_sheet(wb3, ws3, '规定');
  XLSX.writeFile(wb3, path.join(xlsxDir, 'rule.xlsx'));

  console.log('Created XLSX files');
}

function createXlsFiles() {
  const xlsDir = path.join(TEST_DATA_DIR, 'xls');
  fs.mkdirSync(xlsDir, { recursive: true });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([FAQ_DATA.xls.headers, ...FAQ_DATA.xls.rows]);
  XLSX.utils.book_append_sheet(wb, ws, 'FAQ');
  XLSX.writeFile(wb, path.join(xlsDir, 'faq.xls'));

  console.log('Created XLS files');
}

function createPptxFiles() {
  const pptxDir = path.join(TEST_DATA_DIR, 'pptx');
  fs.mkdirSync(pptxDir, { recursive: true });

  const pptx1 = new pptxgen();
  pptx1.addSlide().addText(FAQ_DATA.pptx.title, { fontSize: 28, bold: true, align: 'center' });
  FAQ_DATA.pptx.slides.forEach((s) => {
    pptx1.addSlide().addText(s.title, { fontSize: 20, bold: true });
    pptx1.addSlide().addText(s.content, { fontSize: 14 });
  });
  pptx1.writeFile({ fileName: path.join(pptxDir, 'faq.pptx') });

  const pptx2 = new pptxgen();
  pptx2.addSlide().addText(NOTICE_DATA.pptx.title, { fontSize: 28, bold: true, align: 'center' });
  NOTICE_DATA.pptx.slides.forEach((s) => {
    pptx2.addSlide().addText(s.title, { fontSize: 20, bold: true });
    pptx2.addSlide().addText(s.content, { fontSize: 14 });
  });
  pptx2.writeFile({ fileName: path.join(pptxDir, 'notice.pptx') });

  const pptx3 = new pptxgen();
  pptx3.addSlide().addText(RULE_DATA.pptx.title, { fontSize: 28, bold: true, align: 'center' });
  RULE_DATA.pptx.slides.forEach((s) => {
    pptx3.addSlide().addText(s.title, { fontSize: 20, bold: true });
    pptx3.addSlide().addText(s.content, { fontSize: 14 });
  });
  pptx3.writeFile({ fileName: path.join(pptxDir, 'rule.pptx') });

  console.log('Created PPTX files');
}

async function main() {
  console.log('Generating test data files...');
  console.log('Target directory:', TEST_DATA_DIR);

  createTxtFiles();
  createMdFiles();
  createPdfFiles();
  await createDocxFiles();
  createXlsxFiles();
  createXlsFiles();
  createPptxFiles();

  console.log('\nAll test data files generated successfully!');
  console.log(`Files are located in: ${TEST_DATA_DIR}`);

  const dirs = ['txt', 'md', 'pdf', 'docx', 'xlsx', 'xls', 'pptx'];
  for (const dir of dirs) {
    const dirPath = path.join(TEST_DATA_DIR, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath);
      console.log(`\n${dir}/: ${files.join(', ')}`);
    }
  }
}

// oxlint-disable-next-line unicorn/prefer-top-level-await
main().catch(console.error);
