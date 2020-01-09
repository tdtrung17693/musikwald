import {environment} from '@env/environment';
import {InjectionToken} from '@angular/core';

export const COMMON_CONFIG = new InjectionToken<Config[]>('APP_CONFIG');

export interface NavbarDropdownItem {route: string;
    name: string;
    icon: string;
    permission?: string;
    role?: string;
}


export const DEFAULT_CONFIG: Config = {
    environment: environment.production ? 'production' : 'dev',
    assetsPrefix: null,
    auth: {
        // Route users should be redirected to after successful login.
        redirectUri: '/',
        // route to redirect user if homepage is set to
        // login/register but user is already logged in.
        fallbackRedirectUri: null,
        // Route admins should be redirected to after successful login.
        adminRedirectUri: '/',
        // color for login/register page buttons and checkbox
        color: 'accent',
    },
    accountSettings: {
        hideNavbar: false,
    },
    demo: {
        email: 'admin@admin.com',
        password: 'admin',
    },
    customPages: {
        hideNavbar: false,
    }
};

export interface Config {
    [key: string]: any;

    // scrollbar
    forceCustomScrollbar?: boolean;

    // backend stuff
    base_url?: string;
    version?: string;
    'homepage.type'?: string;
    'homepage.value'?: string;
    'logging.sentry_public'?: string;
    'dates.format'?: string;
    'ads.disable'?: boolean;
    menus?: string;
    'i18n.enable'?: boolean;
    'branding.site_name'?: string;
    'toast.default_timeout'?: number;

    //  config
    environment?: 'production'|'dev';
    assetsPrefix?: string|null;
    auth?: {
        redirectUri?: string,
        fallbackRedirectUri?: string,
        adminRedirectUri?: string,
        color?: 'accent'|'primary',
    };
    accountSettings?: {
        hideNavbar?: boolean,
    };
    navbar?: {
        defaultPosition: string,
        dropdownItems: NavbarDropdownItem[],
    };
    demo?: {
        email?: string,
        password?: string,
    };
    admin?: {
        analytics?: {stats: {name: string, icon: string}[]},
        ads?: {slot: string, description: string}[],
        pages: {name: string, icon: string, route: string, permission: string}[],
        settingsPages?: {name: string, route: string}[],
    };
}
