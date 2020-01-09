import {MatAutocompleteSelectedEvent} from '@angular/material';
import {distinctUntilChanged, map, startWith, switchMap} from 'rxjs/operators';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl} from '@angular/forms';
import {of as observableOf} from 'rxjs';
import {Search} from 'app/web-player/search/search.service';
import {Track} from 'app/models/Track';
import {Tracks} from 'app/web-player/tracks/tracks.service';
import {Toast} from 'shared/ui/toast.service';
import {WebPlayerImagesService} from 'app/web-player/web-player-images.service';
import {UploadQueueService} from 'uploads/upload-queue/upload-queue.service';
import {AudioUploadValidator} from 'app/web-player/audio-upload-validator';
import {Settings} from 'shared/config/settings.service';
import {UploadInputConfig, UploadInputTypes} from 'uploads/upload-input-config';
import {LibraryUploadedTracks} from 'app/web-player/users/user-library/uploaded-tracks.service';

@Component({
    selector: 'upload-page',
    templateUrl: './upload-page.component.html',
    styleUrls: ['./upload-page.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None,
})
export class UserUploadPageComponent implements OnInit {
    public uploadItems: any[] = [];
    public uploadInputConfig: UploadInputConfig = {
        types: [UploadInputTypes.audio],
        multiple: true,
    };
    protected cache = {};
    protected errors = {};

    constructor(
        private audioValidator: AudioUploadValidator,
        private uploadQueue: UploadQueueService,
        private route: ActivatedRoute,
        private settings: Settings,
        private search: Search,
        private tracks: Tracks,
        private toast: Toast,
        private wpImages: WebPlayerImagesService,
        private uploadedTracks: LibraryUploadedTracks,
    ) {
    }

    ngOnInit() {
        this.uploadQueue.getAll().subscribe((items) => {
            items.forEach((item) => {
                const track = new Track();
                track.name = item.filename;
                const ret = {
                    track,
                    queueItem: item,
                    artistInput: {
                        formControl: new FormControl(),
                        attachedArtists: <string[]>[],
                        searchResults: null,
                    },
                    errors: [],
                };
                this.attachArtistTypeaheadInput(ret.artistInput);
                this.cache[item.id] = ret;
                this.uploadItems.push(ret);
            });
        });

        this.uploadQueue.totalProgress().subscribe((progress) => {
            if (progress == 100) {
                this.uploadedTracks.reset();
            }
        });
    }

    confirm(item) {
        // editing existing track
        if (item.track.id) {
            this.update(item);
        } else {
            this.create(item);
        }
    }


    /**
     * Update existing track.
     */
    update(item) {
        this.tracks.update(item.track.id, this.getPayload(item)).subscribe((track) => {
            this.toast.open(`Track updated.`);
        }, (errors) => {
            item.errors = errors.messages;
        });
    }

    /**
     * Create a new track.
     */
    create(item) {
        this.tracks.create(this.getPayload(item)).subscribe((createdTrack) => {
            item.track = Object.assign(item.track, createdTrack);
            this.toast.open('Track created.');
        }, (errors) => {
            item.errors = errors.messages;
        });
    }

    canSaveAll() {
        return this.uploadItems.some((item) => !item.track.id);
    }

    saveAll() {
        this.uploadItems.forEach((item) => {
            this.tracks.create(this.getPayload(item)).subscribe((createdTrack) => {
                item.track = Object.assign(item.track, createdTrack);
            }, (errors) => {
                item.errors = errors.messages;
            });
        });
        this.toast.open('Tracks created.');
    }

    /**
     * Get track payload for backend.
     */
    getPayload(item) {
        const payload = Object.assign({}, item.track);
        payload.album_id = null;
        payload.album_name = null;
        payload.artists = item.artistInput.attachedArtists;
        return payload;
    }

    autoFillDuration(track) {
        if (!track.url) return;
        const audio = document.createElement('audio');

        audio.addEventListener('canplaythrough', (e) => {
            const target = (e.currentTarget || e.target) as HTMLMediaElement;

            if (target.duration) {
                track.duration = Math.ceil(target.duration * 1000);
            }

            audio.remove();
        });

        audio.src = track.url;
    }

    attachArtistTypeaheadInput(input) {
        input.searchResults = input.formControl.valueChanges
            .pipe(
                distinctUntilChanged(),
                startWith(''),
                switchMap((query: any) => {
                    if (query[query.length - 1] == ',') {
                        input.formControl.setValue('');
                        this.addArtist(input, query.slice(0, query.indexOf(',')));
                        return observableOf([]);
                    }

                    const results = this.search.everything(query as string, {limit: 5})
                        .pipe(map((results: any) => results.artists));
                    return query ? results : observableOf([]);
                }),
            );
    }

    onFileDropEvent(uploadedFiles: any) {
        const params = {uri: 'uploads/videos', httpParams: {type: 'track'}, validator: this.audioValidator};
        this.uploadQueue.start(uploadedFiles, params).subscribe((fileEntry) => {
            const item = this.cache[fileEntry.queue_id];
            item.track.url = fileEntry.url;
            this.autoFillDuration(item.track);
        });
    }

    addArtist(artistInput: any, artist: string) {
        artistInput.attachedArtists.push(artist);
    }

    attachArtist(event: MatAutocompleteSelectedEvent, item: any) {
        const artistInput = item.artistInput;
        const artistName = event.option.value;
        artistInput.formControl.setValue('');

        if (!artistName) return;

        // make sure artist is not already attached to track
        if (artistInput.attachedArtists.findIndex((curr) => curr === artistName) > -1) return;
        this.addArtist(artistInput, artistName);
        this.errors = {};
    }

    detachArtist(item: any, artist: string) {
        const i = item.artistInput.attachedArtists.findIndex((curr) => curr === artist);
        item.artistInput.attachedArtists.splice(i, 1);
    }

    delete(item: any) {
        this.uploadItems.splice(item, 1);
    }
}
