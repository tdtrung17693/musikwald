import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router} from '@angular/router';
import {LibraryUploadedTracks} from '../uploaded-tracks.service';
import {Track} from 'app/models/Track';
import {PaginationResponse} from 'shared/types/pagination-response';
import {WebPlayerState} from 'app/web-player/web-player-state.service';

@Injectable()
export class LibraryUploadedResolver implements Resolve<PaginationResponse<Track>> {

    constructor(
        private uploadedTracks: LibraryUploadedTracks,
        private router: Router,
        private state: WebPlayerState,
    ) {
    }

    resolve(route: ActivatedRouteSnapshot): Promise<PaginationResponse<Track>> {
        this.state.loading = true;

        if (this.uploadedTracks.alreadyFetched) {
            this.state.loading = false;
            return new Promise(resolve => resolve());
        }

        return this.uploadedTracks.fetch().toPromise().then(response => {
            this.state.loading = false;

            if (response) {
                return response;
            } else {
                this.router.navigate(['/']);
                return null;
            }
        }).catch(() => {
            this.state.loading = false;
            this.router.navigate(['/']);
        }) as any;
    }
}
