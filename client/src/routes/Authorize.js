import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { getGoogleAuthURL } from 'API';

export default function Authorize() {
    React.useEffect(async () => {
        const url = window.location.href;
        console.log(url);

        if (url.includes('code')) {
            console.log('XDDDDDD');
        } else {
            const authURL = await getGoogleAuthURL().then((response) => {
                return response;
            });

            window.location.href = authURL;
        }
    }, []);

    return <div></div>;
}
