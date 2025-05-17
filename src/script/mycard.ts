import { Buffer } from 'buffer';

interface MyCardSSOUser {
    token : string;
    id : number;
    username : string;
    email : string;
    avatar : string;
}

class MyCard {
    user : MyCardSSOUser;
    id : number = -1;
    token : string = '';
    username : string = '';
    email : string = '';
    avatar : string = 'https://cdn02.moecube.com:444/accounts/default_avatar.jpg';

    constructor() {
        const ssoString = new URLSearchParams(window.location.search).get('sso');
        const loginString = ssoString || window.localStorage.getItem('mycardLogin');
        if (loginString) {
            window.localStorage.setItem('mycardLogin', loginString);
            const decodedLoginString = Buffer.from(loginString, 'base64').toString();
            const params = new URLSearchParams(decodedLoginString);
            // @ts-ignore
            this.user = Object.fromEntries(params);
            this.token = this.user.token;
            this.id = this.user.id
            this.username = this.user.username;
            this.email = this.user.email;
            this.avatar = this.user.avatar;
        }
    }

    login() {
        const loginUrl = (callbackUrl : string) => {
            let params = new URLSearchParams();
            params.set('return_sso_url', callbackUrl);
            const payload = Buffer.from(params.toString()).toString('base64');
            const url = new URL('https://accounts.moecube.com/signin');
            params = url['searchParams'];
            params.set('sso', payload);
            return url.toString();
        };
        const currentUrl = window.location.href;
        window.location.replace(loginUrl(currentUrl));
    }

    logout() {
        window.localStorage.removeItem('mycardLogin');
        window.location.replace(window.location.href.replace(/\/\?.*/, ''))
    }
}

const Mycard = new MyCard();
export default Mycard;