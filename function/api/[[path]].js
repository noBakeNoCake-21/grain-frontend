const API_URL = "https://grain-backend-qq3a.onrender.com";

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);

    // Build the backend URL by stripping /api
    const targetUrl = API_URL + url.pathname.replace("/api", "") + url.search;

    // Create a new Request object to forward everything as-is
    const backendRequest = new Request(targetUrl, {
        method: request.method,               // GET, POST, PUT, DELETE...
        headers: request.headers,             // forward all headers
        body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
        redirect: "manual",
    });

    // Fetch from backend
    const response = await fetch(backendRequest);

    // Return response back to the client (streaming-friendly)
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
}