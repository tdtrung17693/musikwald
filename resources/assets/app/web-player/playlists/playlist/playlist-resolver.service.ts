import {Injectable} from '@angular/core';
import {Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import {Playlists} from '../playlists.service';
import {PlaylistService} from '../playlist.service';
import {Player} from '../../player/player.service';
import {Settings} from 'shared/config/settings.service';
import {WebPlayerState} from '../../web-player-state.service';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {BackendResponse} from '../../../../shared/types/backend-response';

@Injectable()
export class PlaylistResolver implements Resolve<BackendResponse<{playlist: PlaylistService}>> {

    constructor(
        private playlists: Playlists,
        private player: Player,
        private settings: Settings,
        private router: Router,
        private state: WebPlayerState,
        public images: WebPlayerImagesService,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<BackendResponse<{playlist: PlaylistService}>> {
        this.state.loading = true;

        const id = +route.paramMap.get('id');
        const playlist = new PlaylistService(this.playlists, this.player, this.settings, this.images);

        return playlist.init(id).then(response => {
            this.state.loading = false;
            response.playlist = playlist;
            return response;
        }).catch(() => {
            this.state.loading = false;
            this.router.navigate(['/']);
        }) as any;
    }
}
