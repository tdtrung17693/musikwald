import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Track} from '../../../models/Track';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Player} from '../../player/player.service';
import {TrackContextMenuComponent} from '../track-context-menu/track-context-menu.component';
import {FormattedDuration} from '../../player/formatted-duration.service';
import {WpUtils} from '../../web-player-utils';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {ContextMenu} from 'shared/ui/context-menu/context-menu.service';

@Component({
    selector: 'track-page',
    templateUrl: './track-page.component.html',
    styleUrls: ['./track-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class TrackPageComponent implements OnInit {
    /**
     * Track model.
     */
    public track: Track;

    /**
     * Formatted track duration.
     */
    public duration: string;

    /**
     * TrackPageComponent Constructor.
     */
    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        private player: Player,
        private contextMenu: ContextMenu,
        private durationService: FormattedDuration,
        public wpImage: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.track = data.api.track;
            this.duration = this.durationService.fromMilliseconds(this.track.duration);
        });
    }

    /**
     * Play the track.
     */
    public play() {
        if (this.player.cued(this.track)) {
            return this.player.play();
        }
        let tracks;
        if (this.track.album) {
            tracks = this.getAlbumTracks();
        } else {
            tracks = [ this.track ];
        }

        this.player.overrideQueue({tracks}).then(() => {
            this.player.queue.select(this.track);
            this.player.play();
        });
    }

    /**
     * Check if track is playing.
     */
    public playing() {
        return this.player.state.playing && this.player.cued(this.track);
    }

    /**
     * Pause the player.
     */
    public pause() {
        this.player.pause();
    }

    /**
     * Open track context menu.
     */
    public openContextMenu(e: MouseEvent) {
        e.stopPropagation();

        this.contextMenu.open(
            TrackContextMenuComponent,
            e.target,
            {data: {item: this.track, type: 'track'}},
        );
    }

    /**
     * Assign album to all album tracks.
     */
    public getAlbumTracks() {
        return WpUtils.assignAlbumToTracks(this.track.album.tracks, this.track.album);
    }
}
