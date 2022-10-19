import { getToken, getUserID } from 'services/token';

export function updateHeader(axios) {
    axios.interceptors.request.use(
        (req) => {
            const url = req.url;
            const method = req.method;

            const isRequestingLogin =
                (method === 'get' && url.includes('/user')) ||
                url.includes('/token');

            if (!isRequestingLogin) {
                const jwtToken = getToken();
                const userID = getUserID();

                // ? Changes to lowercase anyway
                req.headers['Authorization'] = `Bearer ${jwtToken}`;
                req.headers['userID'] = `${userID}`;
            }

            return req;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
}
