import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Settings} from 'shared/config/settings.service';
import {Albums} from '../../../web-player/albums/albums.service';
import {Album} from '../../../models/Album';
import {Artist} from '../../../models/Artist';
import {MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef} from '@angular/material';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {of as observableOf} from 'rxjs';
import {Search} from '../../../web-player/search/search.service';
import {UploadQueueService} from '../../../../uploads/upload-queue/upload-queue.service';
import {openUploadWindow} from '../../../../uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../uploads/upload-input-config';
import {ImageUploadValidator} from '../../../web-player/image-upload-validator';
import {Toast} from '../../../../shared/ui/toast.service';

export interface CrupdateAlbumModalData {
    album?: Album;
    artist?: Artist;
}

@Component({
    selector: 'new-album-modal',
    templateUrl: './crupdate-album-modal.component.html',
    styleUrls: ['./crupdate-album-modal.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None
})
export class CrupdateAlbumModalComponent {

    /**
     * Backend validation errors from last request.
     */
    public errors: any = {};

    /**
     * Whether album is being created or updated currently.
     */
    public loading = false;

    /**
     * Whether we're creating a new album or updating existing one.
     */
    public updating: boolean;

    /**
     * Album model.
     */
    public album = new Album({tracks: []});

    /**
     * Artist new album should be attached to.
     */
    public artist: Artist;

    /**
     * Model for artists input and tags.
     */
    public artistInput = {
        formControl: new FormControl(),
        searchResults: null,
    };

    constructor(
        private dialogRef: MatDialogRef<CrupdateAlbumModalComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateAlbumModalData,
        private settings: Settings,
        private uploadQueue: UploadQueueService,
        private albums: Albums,
        private search: Search,
        private imageValidator: ImageUploadValidator,
        private toast: Toast,
    ) {
        this.hydrate(data);
        this.bindArtistInput();
    }

    /**
     * Create or update album and close the modal.
     */
    public async confirm() {
        let album;

        if ( ! this.album.artist_id) {
            this.errors.artists = 'Select artist this album should be attached to.';
            return;
        }

        if (this.album.id) {
            album = await this.update();
        } else if (this.artist && this.artist.id) {
            album = await this.create();
        } else {
            this.close(this.album);
        }

        if (album) this.close(this.album);
    }

    public close(album?: Album) {
        this.dialogRef.close(album);
    }

    /**
     * Create a new album.
     */
    public create(): Promise<Album> {
        const payload = Object.assign({}, this.album);
        payload.artist_id = this.artist.id;

        this.loading = true;

        return this.albums.create(payload).toPromise().then(album => {
            this.loading = false;
            this.toast.open('Album created.');
            return album;
        }).catch(errors => {
            this.errors = errors.messages;
            this.loading = false;
        }) as Promise<Album>;
    }

    /**
     * Update existing album.
     */
    public update(): Promise<Album> {
        this.loading = true;

        return this.albums.update(this.album.id, Object.assign({}, this.album)).toPromise().then(album => {
            this.loading = false;
            this.toast.open('Album updated.');
            return album;
        }).catch(errors => {
            this.errors = errors.messages;
            this.loading = false;
        }) as Promise<Album>;
    }

    /**
     * Open modal for uploading album image.
     */
    public openInsertImageModal() {
        const params = {uri: 'uploads/images', httpParams: {type: 'album'}, validator: this.imageValidator};
        openUploadWindow({types: [UploadInputTypes.image], multiple:false}).then(uploadedFiles => {
            if ( ! uploadedFiles) return;
            this.uploadQueue.start(uploadedFiles, params).subscribe(fileEntry => {
                this.album.image = this.settings.getBaseUrl(true) + fileEntry.url;
            });
        });
    }

    /**
     * Get available album image url or default one.
     */
    public getAlbumImage(): string {
        if (this.album.image) return this.album.image;
        return this.settings.getAssetUrl('images/default/album.png');
    }

    private hydrate(data: CrupdateAlbumModalData) {
        if (data.album) this.album = Object.assign({}, data.album);
        if (data.artist) {
            this.artist = Object.assign({}, data.artist);
            this.album.artist_id = data.artist.id;
        }
        if (this.artist) this.artistInput.formControl.setValue(this.artist);

        this.updating = !!data.album;
    }

    private bindArtistInput() {
        this.artistInput.searchResults = this.artistInput.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                debounceTime(350),
                startWith(''),
                switchMap(query => {
                    const results = this.search.everything(this.artistDisplayFn(query), {limit: 5})
                        .pipe(map(results => results.artists));

                    return query ? results : observableOf([]);
                })
            );
    }

    /**
     * Function for artist autocomplete input.
     */
    public artistDisplayFn(album?: Album|Artist|string): string {
        if ( ! album) return '';

        if (typeof album === 'string') {
            return album;
        } else {
            return album.name;
        }
    }

    public attachArtist(event: MatAutocompleteSelectedEvent) {
        this.artist = event.option.value;
        this.album.artist_id = this.artist.id;
        this.errors = {};
    }
}
