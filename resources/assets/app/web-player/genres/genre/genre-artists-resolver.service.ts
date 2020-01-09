import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Genres} from '../genres.service';
import {Artist} from '../../../models/Artist';
import {Genre} from '../../../models/Genre';
import {PaginationResponse} from 'shared/types/pagination-response';
import {WebPlayerState} from '../../web-player-state.service';
import {catchError, mergeMap} from 'rxjs/operators';
import {EMPTY, of} from 'rxjs';
import {BackendResponse} from '../../../../shared/types/backend-response';

@Injectable()
export class GenreArtistsResolver implements Resolve<BackendResponse<{genre: Genre, artists: PaginationResponse<Artist>}>> {

    constructor(
        private genres: Genres,
        private router: Router,
        private state: WebPlayerState
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): BackendResponse<{genre: Genre, artists: PaginationResponse<Artist>}> {
        this.state.loading = true;
        const name = route.paramMap.get('name');

        return this.genres.get(name).pipe(
            catchError(() => {
                this.state.loading = false;
                this.router.navigate(['/genres']);
                return EMPTY;
            }),
            mergeMap(response => {
                this.state.loading = false;

                if (response.artists) {
                    return of(response);
                } else {
                    this.router.navigate(['/genres']);
                    return EMPTY;
                }
            })
        );
    }
}
