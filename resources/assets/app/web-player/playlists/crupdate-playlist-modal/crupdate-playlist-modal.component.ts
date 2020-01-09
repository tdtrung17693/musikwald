import {finalize} from 'rxjs/operators';
import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Playlist} from '../../../models/Playlist';
import {Playlists} from '../playlists.service';
import {Settings} from 'shared/config/settings.service';
import {Observable} from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {UploadQueueService} from '../../../../uploads/upload-queue/upload-queue.service';
import {openUploadWindow} from '../../../../uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../uploads/upload-input-config';
import {ImageUploadValidator} from '../../image-upload-validator';

export interface CrupdatePlaylistModalData {
    playlist?: Playlist;
}

@Component({
    selector: 'crupdate-playlist-modal',
    templateUrl: './crupdate-playlist-modal.component.html',
    styleUrls: ['./crupdate-playlist-modal.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None,
})
export class CrupdatePlaylistModalComponent {
    public loading: boolean = false;
    public errors: { description?: string, name?: string } = {};
    public model = new Playlist({'public': 1});

    constructor(
        private playlists: Playlists,
        private settings: Settings,
        private uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdatePlaylistModalComponent>,
        public images: WebPlayerImagesService,
        private imageValidator: ImageUploadValidator,
        @Optional() @Inject(MAT_DIALOG_DATA) public data?: CrupdatePlaylistModalData,
    ) {
        this.hydrate();
    }

    /**
     * Close modal and emit crupdated playlist.
     */
    public confirm() {
        this.loading = true;

        this.crupdatePlaylist().pipe(finalize(() => {
            this.loading = false;
        })).subscribe(playlist => {
            this.dialogRef.close(playlist);
        }, response => this.errors = response.messages);
    }

    public close() {
        this.dialogRef.close();
    }

    /**
     * Open modal for uploading playlist image.
     */
    public openImageUploadModal() {
        const params = {uri: 'uploads/images', httpParams: {type: 'playlist'}, validator: this.imageValidator};
        openUploadWindow({types: [UploadInputTypes.image], multiple: false}).then(uploadedFiles => {
            if (!uploadedFiles) return;
            this.uploadQueue.start(uploadedFiles, params).subscribe(fileEntry => {
                this.model.image = this.settings.getBaseUrl(true) + fileEntry.url;
            });
        });
    }

    /**
     * Create new playlist or update existing one.
     */
    private crupdatePlaylist(): Observable<Playlist> {
        const payload = {
            name: this.model.name,
            image: this.model.image,
            'public': this.model.public,
            description: this.model.description,
        };

        if (this.model.id) {
            return this.playlists.update(this.model.id, payload);
        } else {
            return this.playlists.create(payload);
        }
    }

    private hydrate() {
        if (this.data && this.data.playlist) {
            this.model = Object.assign({}, this.data.playlist);
        }

        if (!this.model.image) {
            this.model.image = this.images.getDefault('artist');
        }
    }
}
