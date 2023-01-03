async function get(url, headers) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth')}`,
            ...headers
        }
    });
    if (response.status === 403 || response.status === 401) {
        window.location.href = "/login";
        return;
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
}

async function post(url, body, headers) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${localStorage.getItem('auth')}`,
            "Content-Type": "application/json",
            ...headers
        },
        body: JSON.stringify(body)
    });
    if (response.status === 403 || response.status === 401) {
        window.location.href = "/login";
        return;
    }
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    return data;
}


export { get, post };