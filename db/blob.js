import { put, list, del } from "@vercel/blob"

export const addPdf = async (name, userId, pdf) => {
    await put(`/students/${userId}/${name}.pdf`, pdf, { access: "public"} )
}

export const getPdfsForUser = async (userId) => {
    const response = await list();
    const parsedResponse = response.blobs.filter(blob => blob.pathname.startsWith(`students/${userId}/`));
    const mappedResponse = parsedResponse.map(blob => {return { name: blob.pathname.split(`students/${userId}/`)[1], url: blob.url}})
    
    return mappedResponse;
}

export const delPdfByUrl = async (url) => {
    const response = await del(url);

    return response;
}

export const delAllPdfsByUserId = async (userId) => {
    const pdfs = await getPdfsForUser(userId)
    const response = await del(pdfs.map(pdf => pdf.url));

    return response;
}