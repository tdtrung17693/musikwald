import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {TrackContextMenuComponent} from 'app/web-player/tracks/track-context-menu/track-context-menu.component';
import {Player} from 'app/web-player/player/player.service';
import {UserLibrary} from 'app/web-player/users/user-library/user-library.service';
import {Lyrics} from 'app/web-player/lyrics/lyrics.service';
import {WebPlayerImagesService} from 'app/web-player/web-player-images.service';
import {LibraryUploadedTracks} from '../../uploaded-tracks.service';
import {Toast} from 'shared/ui/toast.service';

@Component({
    selector: 'uploaded-context-menu',
    templateUrl: './uploaded-context-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'context-menu'},
})
export class UploadedTrackContextMenuComponent extends TrackContextMenuComponent {

    /**
     * PlaylistTrackContextMenuComponent Constructor.
     */
    constructor(
        protected player: Player,
        protected userLibrary: UserLibrary,
        protected uploadedTracks: LibraryUploadedTracks,
        protected injector: Injector,
        protected lyrics: Lyrics,
        public wpImages: WebPlayerImagesService,
        protected toast: Toast,
    ) {
        super(player, userLibrary, injector, lyrics);
    }

    /**
     * Remove track from currently active playlist.
     */
    public deleteTrack() {
        this.uploadedTracks.remove(this.data.item)
            .subscribe(
                () => this.toast.open('Track deleted'),
                err => this.toast.open(err),
                () => console.log('success'),
            );
        this.contextMenu.close();
    }
}
