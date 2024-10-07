import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { addFile } from '../db/blob.js';
export const generateFile = async (formData, userId) => {
  try {
    const source = await fs.readFile(path.join(process.cwd(), "/public/views/email/emailTemplate.hbs"), "utf8");
    const template = Handlebars.compile(source);
    const html = template({formData});

    const extension = 'html'
    const fileName = `/tmp/${formData.name}_${userId}.${extension}`;

    await fs.writeFile(fileName, html);
    const file = await fs.readFile(path.join(process.cwd(), fileName), "utf8");
    await addFile(formData.name, userId, file, extension);
    await fs.rm(fileName)

  } catch (error) {
    console.error('Error in generatePdf:', error);
    throw error;
  }
};