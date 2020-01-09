import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ComponentPortal, PortalInjector} from '@angular/cdk/portal';
import {Overlay, PositionStrategy} from '@angular/cdk/overlay';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from 'app/admin/data-table/data/paginated-data-table-source';
import {ConfirmModalComponent} from 'shared/ui/confirm-modal/confirm-modal.component';
import {UrlAwarePaginator} from 'app/admin/pagination/url-aware-paginator.service';
import {FormattedDuration} from 'app/web-player/player/formatted-duration.service';
import {WebPlayerImagesService} from 'app/web-player/web-player-images.service';
import {WebPlayerUrls} from 'app/web-player/web-player-urls.service';
import {PreviewModalComponent} from './preview-modal.component';
import {Tracks} from 'app/web-player/tracks/tracks.service';
import {Modal} from 'shared/ui/dialogs/modal.service';
import {CurrentUser} from 'shared/auth/current-user';
import {Track} from 'app/models/Track';

@Component({
    selector: 'pending-tracks-page',
    templateUrl: './pending-tracks-page.component.html',
    styleUrls: ['./pending-tracks-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class PendingTracksPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Track>;

    constructor(
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        public images: WebPlayerImagesService,
        private paginator: UrlAwarePaginator,
        private duration: FormattedDuration,
        private route: ActivatedRoute,
        private overlay: Overlay,
        private router: Router,
        private tracks: Tracks,
        private modal: Modal,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Track>({
            uri: 'tracks/pending',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {order_by: 'name'},
        });
    }

    /**
     * Ask user to confirm deletion of selected tracks
     * and delete selected artists if user confirms.
     */
    public disapprove(track: Track) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Track',
            body: 'Are you sure you want to delete selected track?',
            ok: 'Delete',
        }).beforeClosed().subscribe((confirmed) => {
            console.log(confirmed)
            if (confirmed) {
                this.tracks.delete([track.id]).subscribe(() => {
                    this.dataSource.refresh();
                });
            }
        });
    }

    public approve(track: any) {
        this.modal.show(ConfirmModalComponent, {
            title: 'Approve Track',
            body: 'Are you sure you want to approve selected track?',
            ok: 'Approve',
        }).beforeClosed().subscribe((confirmed) => {
            console.log(confirmed)
            if (confirmed) {
                track.pending = 0;
                this.tracks.update(track.id, this.getPayload(track)).subscribe(() => {
                    this.dataSource.refresh();
                });
            }
        });
    }

    private getPayload(track) {
        const payload = Object.assign({}, track);
        payload.album_id = track.album_id;
        payload.album_name = track.album ? track.album.name : null;
        payload.artists = track.artists.join(',');
        payload.uploaded_by = track.uploaded_by.id;
        return payload;
    }

    public preview(track: Track) {
        this.modal.open(PreviewModalComponent, {track}, 'preview-modal-container')
            .afterClosed().subscribe((track) => console.log(track));
    }

    public formatDuration(duration: number) {
        return this.duration.fromMilliseconds(duration);
    }
}
