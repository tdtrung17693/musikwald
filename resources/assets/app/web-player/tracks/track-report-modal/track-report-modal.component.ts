import {finalize} from 'rxjs/operators';
import {Component, Inject, Optional, ViewEncapsulation} from '@angular/core';
import {Settings} from 'shared/config/settings.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WebPlayerImagesService} from '../../web-player-images.service';
import {UploadQueueService} from '../../../../uploads/upload-queue/upload-queue.service';
import {ImageUploadValidator} from '../../image-upload-validator';
import {Track} from '@app/models/Track';
import {Report, ReportType} from '@app/models/Report';
import {Tracks} from '@app/web-player/tracks/tracks.service';
import {Toast} from '../../../../shared/ui/toast.service';

export interface TrackReportModalData {
    report: Report;
    track: Track;
}

@Component({
    selector: 'track-report-modal',
    templateUrl: './track-report-modal.component.html',
    styleUrls: ['./track-report-modal.component.scss'],
    providers: [UploadQueueService],
    encapsulation: ViewEncapsulation.None,
})
export class TrackReportModalComponent {
    public loading = false;
    public errors: { description?: string; name?: string } = {};
    public model = new Report({'additional_info': '', 'type': ReportType.ILLEGAL});

    constructor(
        private settings: Settings,
        private uploadQueue: UploadQueueService,
        private dialogRef: MatDialogRef<TrackReportModalComponent>,
        public images: WebPlayerImagesService,
        private imageValidator: ImageUploadValidator,
        public tracks: Tracks,
        public toasts: Toast,
        @Optional() @Inject(MAT_DIALOG_DATA) public data?: TrackReportModalData,
    ) {
    }

    /**
     * Close modal and emit crupdated playlist.
     */
    public confirm() {
        this.loading = true;
        const report = this.model;
        const track = this.data.track;
        report.trackId = track.id;
        console.log(report);
        this.tracks
            .report(track, report)
            .pipe(finalize(() => {
                this.loading = false;
            }))
            .subscribe((newReport) => {
                this.toasts.open('Your report was sent.');
                this.dialogRef.close(newReport);
            }, (response) => this.errors = response.messages);
    }

    public close() {
        this.dialogRef.close();
    }
}
