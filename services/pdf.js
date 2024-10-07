import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { addFile, addFileToArchive } from '../db/blob.js';
export const generateFile = async (formData, userId) => {
  try {
    const source = await fs.readFile(path.join(process.cwd(), "/public/views/email/emailTemplate.hbs"), "utf8");
    const template = Handlebars.compile(source);
    const html = template({formData});

    const extension = 'html'

    await addFile(formData.name, userId, html, extension);
    await addFileToArchive(formData.name, userId, html, extension);

  } catch (error) {
    console.error('Error in generatePdf:', error);
    throw error;
  }
};