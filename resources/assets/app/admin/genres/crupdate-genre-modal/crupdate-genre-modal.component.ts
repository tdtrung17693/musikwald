import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {UploadQueueService} from '../../../../uploads/upload-queue/upload-queue.service';
import {Settings} from '../../../../shared/config/settings.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {openUploadWindow} from '../../../../uploads/utils/open-upload-window';
import {UploadInputTypes} from '../../../../uploads/upload-input-config';
import {Genres} from '../../../web-player/genres/genres.service';
import {Genre} from '../../../models/Genre';
import {ImageUploadValidator} from '../../../web-player/image-upload-validator';

interface CrupdateGenreModalData {
    genre?: Genre;
}

@Component({
    selector: 'crupdate-genre-modal',
    templateUrl: './crupdate-genre-modal.component.html',
    styleUrls: ['./crupdate-genre-modal.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None
})
export class CrupdateGenreModalComponent {
    public errors: any = {};
    public updating = false;
    public loading = false;
    public genre = new Genre();

    constructor(
        public settings: Settings,
        protected genres: Genres,
        protected uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<CrupdateGenreModalComponent>,
        private imageValidator: ImageUploadValidator,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CrupdateGenreModalData,
    ) {
        if (this.data.genre) {
            this.genre = this.data.genre;
            this.updating = true;
        }
    }

    public confirm() {
        let request;

        if (this.updating) {
            request = this.genres.update(this.genre.id, this.getPayload());
        } else {
            request = this.genres.create(this.getPayload());
        }

        request.subscribe(response => {
            this.loading = false;
            this.dialogRef.close(response.genre);
        }, errors => {
            this.loading = false;
            this.errors = errors.messages;
        });
    }

    public close(genre?: Genre) {
        this.dialogRef.close(genre);
    }

    public openUploadImageModal() {
        const params = {uri: 'uploads/images', httpParams: {type: 'genre'}, validator: this.imageValidator};
        openUploadWindow({types: [UploadInputTypes.image]}).then(uploadedFiles => {
            if ( ! uploadedFiles) return;
            this.uploadQueue.start(uploadedFiles, params).subscribe(fileEntry => {
                this.genre.image = this.settings.getBaseUrl(true) + fileEntry.url;
            });
        });
    }

    private getPayload() {
        return {
            name: this.genre.name,
            image: this.genre.image,
            popularity: this.genre.popularity,
        }
    }
}
