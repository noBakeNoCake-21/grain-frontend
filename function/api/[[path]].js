const API_URL = "https://grain-backend-qq3a.onrender.com";

export async function onRequest(context) {
    const url = new URL(context.request.url);

    const targetUrl = API_URL + url.pathname + url.search;

    return fetch(targetUrl, context.request);
}