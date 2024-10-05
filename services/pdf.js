import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';

export const generatePdf = async (formData) => {
  try {
    const source = fs.readFileSync(path.join(process.cwd(), "/public/views/email/emailTemplate.hbs"), "utf8");
    const template = Handlebars.compile(source);
    const html = template({formData});

    const pdfOptions = {
      "format": "A4",
      "orientation": "landscape",
      "border" : "0px"
    }

    const pdfBuffer = new Promise((resolve, reject) => {
      pdf.create(html, pdfOptions).toBuffer((err, buffer) => {
        if(err) reject();
        resolve(buffer);
      })
    })
    const pdfFile = await pdfBuffer;

    console.log('PDF generated successfully. Buffer length:', pdfBuffer.length);
    
    return pdfFile;
  } catch (error) {
    console.error('Error in generatePdf:', error);
    throw error;
  }
};