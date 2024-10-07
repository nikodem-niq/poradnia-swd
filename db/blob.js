import { put, list, del } from "@vercel/blob"
import { format } from "date-fns"

const formattedDate = format(new Date(), 'yyyy-MM-dd_HH-mm-ss')

export const addFile = async (name, userId, file, extension) => {
    await put(`/students/${userId}/${formattedDate}_${name}.${extension}`, file, { access: "public"} )
}

export const addFileToArchive = async (name, userId, file, extension) => {
    await put(`/archive/${userId}/${formattedDate}_${name}.${extension}`, file, { access: "public"} )
}

export const getFilesFromArchiveForUser = async (userId) => {
    const response = await list();
    const parsedResponse = response.blobs.filter(blob => blob.pathname.startsWith(`archive/${userId}/`));
    const mappedResponse = parsedResponse.map(blob => {return { name: blob.pathname.split(`archive/${userId}/`)[1], url: blob.url}})
    
    return mappedResponse;
}

export const getFilesForUser = async (userId) => {
    const response = await list();
    const parsedResponse = response.blobs.filter(blob => blob.pathname.startsWith(`students/${userId}/`));
    const mappedResponse = parsedResponse.map(blob => {return { name: blob.pathname.split(`students/${userId}/`)[1], url: blob.url}})
    
    return mappedResponse;
}

export const delFileByUrl = async (url) => {
    const response = await del(url);

    return response;
}

export const delAllFilesByUserId = async (userId) => {
    const pdfs = await getFilesForUser(userId)
    const response = await del(pdfs.map(pdf => pdf.url));

    return response;
}