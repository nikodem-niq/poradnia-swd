import { put, list, del } from "@vercel/blob"

export const addFile = async (name, userId, file, extension) => {
    await put(`/students/${userId}/${name}.${extension}`, file, { access: "public"} )
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