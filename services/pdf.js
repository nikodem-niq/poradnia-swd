import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';

export const generatePdf = async (formData) => {
  try {
    // Read and compile the Handlebars template
    const source = fs.readFileSync(path.join(process.cwd(), "/public/views/email/emailTemplate.hbs"), "utf8");
    const template = Handlebars.compile(source);
    const html = template({formData});

    // Launch a new browser instance
    const browser = await puppeteer.launch({
      headless: "new",  // Use new headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'] // Needed for some server environments
    });

    // Create a new page
    const page = await browser.newPage();

    // Set the HTML content of the page
    await page.setContent(html, {
      waitUntil: 'networkidle0' // Wait until the network is idle
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: {
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px'
      }
    });

    // Close the browser
    await browser.close();

    console.log('PDF generated successfully. Buffer length:', pdfBuffer.length);
    
    return pdfBuffer;
  } catch (error) {
    console.error('Error in generatePdf:', error);
    throw error;
  }
};