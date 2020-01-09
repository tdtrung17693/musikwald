import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from '../data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from '../pagination/url-aware-paginator.service';
import {Modal} from '../../../shared/ui/dialogs/modal.service';
import {CurrentUser} from '../../../shared/auth/current-user';
import {ConfirmModalComponent} from '../../../shared/ui/confirm-modal/confirm-modal.component';
import {Genres} from '../../web-player/genres/genres.service';
import {Genre} from '../../models/Genre';
import {CrupdateGenreModalComponent} from './crupdate-genre-modal/crupdate-genre-modal.component';

@Component({
    selector: 'genres',
    templateUrl: './genres.component.html',
    styleUrls: ['./genres.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GenresComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Genre>;

    constructor(
        public paginator: UrlAwarePaginator,
        private genres: Genres,
        private modal: Modal,
        public currentUser: CurrentUser,
    ) {}

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Genre>({
            uri: 'genres',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            staticParams: {withCount: 'artists'}
        });
    }

    public openCrupdateGenreModal(genre?: Genre) {
        this.modal.open(CrupdateGenreModalComponent, {genre}, 'crupdate-genre-modal-container')
            .afterClosed().subscribe(() => {
            this.dataSource.deselectAllItems();
            this.paginator.refresh();
        });
    }

    public confirmGenresDeletion() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Genres',
            body: 'Are you sure you want to delete selected genres?',
            ok: 'Delete'
        }).afterClosed().subscribe(confirmed => {
            if ( ! confirmed) return;
            this.deleteSelectedGenres();
        });
    }

    public deleteSelectedGenres() {
        const ids = this.dataSource.getSelectedItems();

        this.genres.delete(ids).subscribe(() => {
            this.paginator.refresh();
            this.dataSource.deselectAllItems();
        });
    }
}
