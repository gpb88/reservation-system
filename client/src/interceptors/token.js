import { getToken } from 'services/token';

export function updateHeader(axios) {
    axios.interceptors.request.use(
        (req) => {
            if (req.method !== 'get') {
                const jwtToken = getToken();

                req.headers['authorization'] = jwtToken;
            }

            return req;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
