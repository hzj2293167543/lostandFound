import { Injectable } from '@nestjs/common';
import { PDFParse } from 'pdf-parse';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import * as officeparser from 'officeparser';

export interface ParsedDocument {
  content: string;
  fileName: string;
  mimeType: string;
}

@Injectable()
export class DocumentParserService {
  async parseFile(buffer: Buffer, fileName: string, mimeType: string): Promise<ParsedDocument> {
    const ext = fileName.toLowerCase().split('.').pop();

    switch (ext) {
      case 'txt':
      case 'md':
        return this.parseText(buffer, fileName, mimeType);
      case 'pdf':
        return await this.parsePdf(buffer, fileName, mimeType);
      case 'docx':
        return await this.parseDocx(buffer, fileName, mimeType);
      case 'xlsx':
      case 'xls':
        return this.parseExcel(buffer, fileName, mimeType);
      case 'pptx':
        return this.parsePptx(buffer, fileName, mimeType);
      default:
        return { content: buffer.toString('utf-8'), fileName, mimeType };
    }
  }

  private parseText(buffer: Buffer, fileName: string, mimeType: string): ParsedDocument {
    const content = buffer.toString('utf-8');
    return { content, fileName, mimeType };
  }

  private async parsePdf(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ParsedDocument> {
    const parser = new PDFParse(buffer);
    const result = await parser.getText();
    return { content: result.text, fileName, mimeType };
  }

  private async parseDocx(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ParsedDocument> {
    const result = await mammoth.extractRawText({ buffer });
    return { content: result.value, fileName, mimeType };
  }

  private parseExcel(buffer: Buffer, fileName: string, mimeType: string): ParsedDocument {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheets: string[] = [];

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const csv = XLSX.utils.sheet_to_csv(sheet);
      sheets.push(`=== Sheet: ${sheetName} ===\n${csv}`);
    }

    return { content: sheets.join('\n\n'), fileName, mimeType };
  }

  private async parsePptx(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<ParsedDocument> {
    const parsed = await officeparser.parseOffice(buffer);
    const text = typeof parsed === 'string' ? parsed : JSON.stringify(parsed);
    return { content: text, fileName, mimeType };
  }
}
