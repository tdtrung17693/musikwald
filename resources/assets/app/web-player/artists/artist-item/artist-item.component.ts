import {Component, Input, OnDestroy, ViewEncapsulation} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Player} from '../../player/player.service';
import {Artist} from '../../../models/Artist';
import {ArtistService} from '../artist.service';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {Toast} from '../../../../shared/ui/toast.service';

@Component({
    selector: 'artist-item',
    templateUrl: './artist-item.component.html',
    styleUrls: ['./artist-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'media-grid-item', '[class.active]': 'playing()'},
})
export class ArtistItemComponent implements OnDestroy {

    /**
     * Scroll container for lazy loading images.
     */
    @Input() scrollContainer: HTMLElement;

    /**
     * Artist to be displayed.
     */
    @Input() artist: Artist;

    /**
     * ArtistItemComponent Constructor
     */
    constructor(
        public urls: WebPlayerUrls,
        private artistService: ArtistService,
        private player: Player,
        public wpImages: WebPlayerImagesService,
        private toast: Toast,
    ) {}

    ngOnDestroy() {
        this.artistService.destroy();
    }

    /**
     * Check if artist is playing.
     */
    public playing() {
        return this.artistService.playing(this.artist);
    }

    /**
     * Play all artist tracks.
     */
    public play() {
        this.player.stop();
        this.player.state.buffering = true;
        this.artistService.init(this.artist.id, {top_tracks: true}).then(() => {
            this.artistService.play();
        }, () => this.toast.open('Could not load artist. Please try again later.'));
    }

    /**
     * Pause the player.
     */
    public pause() {
        this.player.pause();
    }
}
