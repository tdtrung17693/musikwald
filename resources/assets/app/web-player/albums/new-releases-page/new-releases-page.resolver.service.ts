import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Album} from '../../../models/Album';
import {WebPlayerState} from '../../web-player-state.service';
import {Albums} from '../albums.service';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {BackendResponse} from '../../../../shared/types/backend-response';

@Injectable()
export class NewReleasesPageResolver implements Resolve<BackendResponse<{albums: Album[]}>> {
    constructor(
        private albums: Albums,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BackendResponse<{albums: Album[]}> {
        this.state.loading = true;
        return this.albums.getNewReleases().pipe(
            catchError(() => {
                this.state.loading = false;
                this.router.navigate(['/']);
                return EMPTY;
            }),
            mergeMap(response => {
                this.state.loading = false;
                if (response.albums) {
                    return of(response);
                } else {
                    this.router.navigate(['/']);
                    return EMPTY;
                }
            })
        );
    }
}
