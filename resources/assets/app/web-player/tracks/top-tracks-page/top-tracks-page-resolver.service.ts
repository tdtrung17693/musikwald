import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {WebPlayerState} from '../../web-player-state.service';
import {Tracks} from '../tracks.service';
import {Track} from '../../../models/Track';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {BackendResponse} from '../../../../shared/types/backend-response';

@Injectable()
export class TopTracksPageResolver implements Resolve<BackendResponse<{tracks: Track[]}>> {

    constructor(
        private tracks: Tracks,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BackendResponse<{tracks: Track[]}> {
        this.state.loading = true;
        return this.tracks.getTop().pipe(
            catchError(() => {
                this.state.loading = false;
                this.router.navigate(['/']);
                return EMPTY;
            }),
            mergeMap(response => {
                this.state.loading = false;
                if (response.tracks) {
                    return of(response);
                } else {
                    this.router.navigate(['/']);
                    return EMPTY;
                }
            })
        );
    }
}
