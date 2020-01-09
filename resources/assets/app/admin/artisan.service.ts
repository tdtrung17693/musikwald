import {Injectable} from '@angular/core';
import {AppHttpClient} from 'shared/http/app-http-client.service';
import {BackendResponse} from 'shared/types/backend-response';

@Injectable({
    providedIn: 'root'
})
export class ArtisanService {
    constructor(private http: AppHttpClient) {}

    public call(payload: {command: string, params?: {[key: string]: string|number}}): BackendResponse<void> {
        return this.http.post('artisan/call', payload);
    }
}
