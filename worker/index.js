export default {
    fetch(request) {
        const url = new URL(request.url);
        if (url.pathname.startsWith("/api/")) {
            return fetch("https://grain-backend-qq3a.onrender.com" + url.pathname + url.search, request);
        }
        return new Response(null, { status: 404 });
    },
};