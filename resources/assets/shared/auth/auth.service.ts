import { Injectable, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrentUser } from './current-user';
import { Toast } from '../ui/toast.service';
import { User } from '../types/models/User';
import { Observable } from 'rxjs';
import { Settings } from '../config/settings.service';
import { AppHttpClient } from '../http/app-http-client.service';
import {BackendResponse} from '../types/backend-response';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        protected httpClient: AppHttpClient,
        protected currentUser: CurrentUser,
        protected router: Router,
        protected route: ActivatedRoute,
        protected toast: Toast,
        protected zone: NgZone,
        protected config: Settings,
    ) {}

    /**
     * Log user in with specified credentials.
     */
    public login(credentials: Object): BackendResponse<{data: string}> {
        return this.httpClient.post('auth/login', credentials);
    }

    /**
     * Register a new user.
     */
    public register(credentials: Object): BackendResponse<{data: string}> {
        return this.httpClient.post('auth/register', credentials);
    }

    /**
     * Log current user out.
     */
    public logOut() {
        this.httpClient.post('auth/logout').subscribe(() => {
            this.currentUser.clear();
            this.router.navigate(['/login']);
        });
    }

    /**
     * Send password reset link to user via email.
     */
    public sendPasswordResetLink(credentials: Object): Observable<{ data: string }> {
        return this.httpClient.post('auth/password/email', credentials);
    }

    /**
     * Reset user password.
     */
    public resetPassword(credentials: Object): Observable<{ data: User }> {
        return this.httpClient.post('auth/password/reset', credentials);
    }

    /**
     * Get URI user should be redirect to after login.
     */
    public getRedirectUri(): string {
        if (this.currentUser.redirectUri) {
            const redirectUri = this.currentUser.redirectUri;
            this.currentUser.redirectUri = null;
            return redirectUri;
        } else if (this.currentUser.isAdmin()) {
            return this.config.get('app.auth.adminRedirectUri');
        } else {
            return this.config.get('app.auth.redirectUri');
        }
    }
}
