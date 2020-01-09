import {Injectable} from '@angular/core';
import {AppHttpClient} from 'shared/http/app-http-client.service';
import {Observable} from 'rxjs';
import {Album} from '../../models/Album';
import {BackendResponse} from '../../../shared/types/backend-response';

@Injectable()
export class Albums {
    constructor(private httpClient: AppHttpClient) {}

    public get(id: number): BackendResponse<{album: Album}> {
        return this.httpClient.get('albums/' + id);
    }

    public getPopular(): BackendResponse<{albums: Album[]}> {
        return this.httpClient.get('albums/popular');
    }

    public getNewReleases(): BackendResponse<{albums: Album[]}> {
        return this.httpClient.get('albums/new-releases');
    }

    /**
     * Create a new album.
     */
    public create(payload: object): Observable<Album> {
        return this.httpClient.post('albums', payload);
    }

    /**
     * Update existing album.
     */
    public update(id: number, payload: object): Observable<Album> {
        return this.httpClient.put('albums/'+id, payload);
    }

    /**
     * Delete specified albums.
     */
    public delete(ids: number[]) {
        return this.httpClient.delete('albums', {ids});
    }
}
