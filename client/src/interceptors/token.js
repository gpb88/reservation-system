export function updateHeader(axios) {
    axios.interceptors.request.use(
        (req) => {
            if (!req.url.includes('user') && req.method !== 'get') {
                const jwtToken = JSON.parse(localStorage.getItem('token'));
                req.headers['authorization'] = jwtToken;
            }
            return req;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
