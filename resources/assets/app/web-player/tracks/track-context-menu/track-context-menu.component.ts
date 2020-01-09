import {finalize} from 'rxjs/operators';
import {Component, Injector, ViewEncapsulation} from '@angular/core';
import {Track} from 'app/models/Track';
import {ContextMenuComponent} from 'app/web-player/context-menu/context-menu.component';
import {Player} from 'app/web-player/player/player.service';
import {UserLibrary} from 'app/web-player/users/user-library/user-library.service';
import {SelectedTracks} from '../track-list/selected-tracks.service';
import {Lyrics} from 'app/web-player/lyrics/lyrics.service';
import {LyricsModalComponent} from 'app/web-player/lyrics/lyrics-modal/lyrics-modal.component';
import {downloadFileFromUrl} from 'uploads/utils/download-file-from-url';
import {TrackReportModalComponent} from '@app/web-player/tracks/track-report-modal/track-report-modal.component';

@Component({
    selector: 'track-context-menu',
    templateUrl: './track-context-menu.component.html',
    styleUrls: ['./track-context-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'context-menu'},
})
export class TrackContextMenuComponent extends ContextMenuComponent<Track> {
    public data: { selectedTracks?: SelectedTracks; playlistId?: number; type: string; item: Track };
    protected canDelete = false;

    constructor(
        protected player: Player,
        protected library: UserLibrary,
        protected injector: Injector,
        protected lyrics: Lyrics,
    ) {
        super(injector);
    }

    public allowDelete(value = true) {
        this.canDelete = value;
    }

    /**
     * Check if this track is in player queue.
     */
    public inQueue() {
        return this.player.queue.has(this.data.item);
    }

    /**
     * Remove track from player queue.
     */
    public removeFromQueue() {
        this.player.queue.remove(this.data.item);
        this.contextMenu.close();
    }

    /**
     * Check if track is in user's library.
     */
    public inLibrary() {
        return this.library.has(this.data.item);
    }

    /**
     * Remove track from user's library.
     */
    public removeFromLibrary() {
        this.library.remove(this.getTracks());
        this.contextMenu.close();
    }

    /**
     * Copy fully qualified album url to clipboard.
     */
    public copyLinkToClipboard() {
        super.copyLinkToClipboard('track');
    }

    /**
     * Check if multiple tracks are selected in track list.
     */
    public multipleTracksSelected() {
        return this.data.selectedTracks && this.data.selectedTracks.all().length > 1;
    }

    /**
     * Get tracks that should be used by context menu.
     */
    public getTracks(): Track[] {
        return this.getSelectedTracks() || [this.data.item];
    }

    /**
     * Go to track radio route.
     */
    public goToTrackRadio() {
        this.contextMenu.close();
        this.router.navigate(this.urls.trackRadio(this.data.item));
    }

    /**
     * Fetch lyrics and show lyrics modal.
     */
    public showLyricsModal() {
        this.state.loading = true;
        this.contextMenu.close();

        this.lyrics.get(this.data.item.id).pipe(finalize(() => {
            this.state.loading = false;
        })).subscribe(lyric => {
            this.modal.open(LyricsModalComponent, {lyrics: lyric.text}, 'lyrics-modal-container');
        }, () => {
            this.toast.open('Could not find lyrics for this song.');
        });
    }

    public downloadTrack() {
        const track = this.data.item;
        if (!track) return;
        downloadFileFromUrl(this.urls.trackDownload(track));
    }

    /**
     * Get image for context menu.
     */
    public getImage() {
        if (!this.data.item.album) return this.wpImages.getDefault('album');
        return this.data.item.album.image;
    }

    reportTrack() {
        this.openNewReportModal();
    }

    public openNewReportModal() {
        if (!this.currentUser.isLoggedIn()) {
            return this.router.navigate(['/login']);
        }

        this.modal.open(TrackReportModalComponent, {track: this.data.item, report: null}, 'track-report-modal-container')
            .afterClosed()
            .subscribe((report) => {
                if (!report) return;
            });
    }

    /**
     * Get currently selected tracks, if any.
     */
    private getSelectedTracks() {
        if (!this.data.selectedTracks || this.data.selectedTracks.all().length <= 1) return;
        return this.data.selectedTracks.all();
    }
}
