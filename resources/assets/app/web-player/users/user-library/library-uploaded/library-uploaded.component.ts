import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LibraryUploadedTracks} from '../uploaded-tracks.service';

@Component({
    selector: 'library-uploaded-tracks',
    templateUrl: './library-uploaded.component.html',
    styleUrls: ['./library-uploaded.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {class: 'user-library-page'},
})
export class LibraryUploadedComponent implements OnInit {
    /**
     * LibraryTracksComponent Constructor.
     */
    constructor(public uploadedTracks: LibraryUploadedTracks, private route: ActivatedRoute) {}

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.uploadedTracks.setPaginationResponse(data.pagination);
        });
    }

    /**
     * Load more tracks from user library.
     */
    public loadMore() {
        this.uploadedTracks.loadMore();
    }

    /**
     * Check if more tracks can be loaded via infinite load.
     */
    public canLoadMore() {
        return this.uploadedTracks.canLoadMoreTracks();
    }
}
