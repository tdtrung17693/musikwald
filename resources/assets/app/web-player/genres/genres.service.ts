import {Injectable} from '@angular/core';
import {AppHttpClient} from 'shared/http/app-http-client.service';
import {Genre} from '../../models/Genre';
import {Artist} from '../../models/Artist';
import {PaginationResponse} from 'shared/types/pagination-response';
import {BackendResponse} from '../../../shared/types/backend-response';

@Injectable()
export class Genres {
    constructor(private httpClient: AppHttpClient) {}

    public getPopular(): BackendResponse<{genres: Genre[]}> {
        return this.httpClient.get('genres/popular');
    }

    public create(params: Partial<Genre>): BackendResponse<{genre: Genre}> {
        return this.httpClient.post('genres', params);
    }

    public update(id: number, params: Partial<Genre>): BackendResponse<{genre: Genre}> {
        return this.httpClient.put('genres/' + id, params);
    }

    public delete(ids: number[]): BackendResponse<void> {
        return this.httpClient.delete('genres', {ids});
    }

    public get(name: string, params = {}): BackendResponse<{genre: Genre, artists: PaginationResponse<Artist>}> {
        return this.httpClient.get(`genres/${name}`, params);
    }
}
