import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {Overlay} from '@angular/cdk/overlay';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSort} from '@angular/material';
import {PaginatedDataTableSource} from 'app/admin/data-table/data/paginated-data-table-source';
import {UrlAwarePaginator} from 'app/admin/pagination/url-aware-paginator.service';
import {FormattedDuration} from 'app/web-player/player/formatted-duration.service';
import {WebPlayerImagesService} from 'app/web-player/web-player-images.service';
import {WebPlayerUrls} from 'app/web-player/web-player-urls.service';
import {Tracks} from 'app/web-player/tracks/tracks.service';
import {Modal} from 'shared/ui/dialogs/modal.service';
import {CurrentUser} from 'shared/auth/current-user';
import {Report, ReportType} from '@app/models/Report';
import {AppHttpClient} from '../../../shared/http/app-http-client.service';
import {ConfirmModalComponent} from '../../../shared/ui/confirm-modal/confirm-modal.component';
import {DetailsModalComponent} from '@app/admin/reports/details-modal.component';

@Component({
    selector: 'reports-page',
    templateUrl: './reports-page.component.html',
    styleUrls: ['./reports-page.component.scss'],
    providers: [UrlAwarePaginator],
    encapsulation: ViewEncapsulation.None,
})
export class ReportsPageComponent implements OnInit {
    @ViewChild(MatSort) matSort: MatSort;

    public dataSource: PaginatedDataTableSource<Report>;

    constructor(
        public currentUser: CurrentUser,
        public urls: WebPlayerUrls,
        public images: WebPlayerImagesService,
        private paginator: UrlAwarePaginator,
        private http: AppHttpClient,
        private duration: FormattedDuration,
        private route: ActivatedRoute,
        private overlay: Overlay,
        private router: Router,
        private tracks: Tracks,
        private modal: Modal,
    ) {
    }

    ngOnInit() {
        this.dataSource = new PaginatedDataTableSource<Report>({
            uri: 'reports',
            dataPaginator: this.paginator,
            matSort: this.matSort,
            // eslint-disable-next-line @typescript-eslint/camelcase
            staticParams: {order_by: 'created_at'},
        });
    }

    getReportTypeText(type: number) {
        if (type === ReportType.ILLEGAL) {
            return 'Violate T&C';
        } else if (type === ReportType.BAD_QUALITY) {
            return 'Bad Quality';
        } else {
            return 'Other';
        }
    }

    markAsViewed(report: Report) {
        report.viewed = true;
        this.http.put(`reports/${report.id}`, {report})
            .subscribe(() => {
                this.dataSource.refresh();
            });
    }

    maybeDeleteSelectedReports() {
        this.modal.show(ConfirmModalComponent, {
            title: 'Delete Tracks',
            body: 'Are you sure you want to delete selected tracks?',
            ok: 'Delete',
        }).beforeClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.deleteSelectedReports();
            } else {
                this.dataSource.deselectAllItems();
            }
        });
    }

    private deleteSelectedReports() {
        const ids = this.dataSource.selectedRows.selected.map((report: Report) => report.id);

        this.http.delete('reports', {ids})
            .subscribe(() => this.dataSource.refresh());
    }

    openReportItemDetail(report: Report) {
        this.modal.show(DetailsModalComponent, {report});
    }
}
