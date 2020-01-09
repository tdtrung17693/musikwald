import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Playlist} from "../../models/Playlist";
import {Playlists} from "../../web-player/playlists/playlists.service";
import {CrupdatePlaylistModalComponent} from "../../web-player/playlists/crupdate-playlist-modal/crupdate-playlist-modal.component";
import {PaginatedDataTableSource} from 'app/admin/data-table/data/paginated-data-table-source';
import {MatSort} from '@angular/material';
import {UrlAwarePaginator} from 'app/admin/pagination/url-aware-paginator.service';
import {CurrentUser} from 'shared/auth/current-user';
import {ConfirmModalComponent} from 'shared/ui/confirm-modal/confirm-modal.component';
import {WebPlayerImagesService} from '../../web-player/web-player-images.service';
import {Modal} from 'shared/ui/dialogs/modal.service';

@Component({
    selector: 'playlists-page',
    templateUrl: './playlists-page.component.html',
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None
})
export class PlaylistsPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Playlist>;

    /**
     * PlaylistsPageComponent Constructor.
     */
    constructor(
        public paginator: UrlAwarePaginator,
        private playlists: Playlists,
        private modal: Modal,
        public currentUser: CurrentUser,
        public wpImages: WebPlayerImagesService,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Playlist>({
            uri: 'playlists',
            dataPaginator: this.paginator,
            matSort: this.matSort,
        });
    }

    /**
     * Show modal for creating a new playlist or updating existing one.
     */
    public showCrupdatePlaylistModal(playlist?: Playlist) {
        this.modal.open(CrupdatePlaylistModalComponent, {playlist}, 'crupdate-playlist-modal-container')
            .beforeClose()
            .subscribe(playlist => {
                if ( ! playlist) return;
                this.dataSource.deselectAllItems();
                this.paginator.refresh();
            });
    }

    /**
     * Ask user to confirm deletion of selected playlists
     * and delete selected playlists if user confirms.
     */
    public confirmPlaylistsDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Playlists',
            body: 'Are you sure you want to delete selected playlists?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedPlaylists();
        });
    }

    /**
     * Delete currently selected pages.
     */
    public deleteSelectedPlaylists() {
        const ids = this.dataSource.getSelectedItems();

        this.playlists.delete(ids).subscribe(() => {
            this.dataSource.refresh();
            this.dataSource.deselectAllItems();
        });
    }
}
