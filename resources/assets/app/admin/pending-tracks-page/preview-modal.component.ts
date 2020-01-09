import {Component, Inject, Optional, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Track} from 'app/models/Track';
import {TrackPlays} from 'app/web-player/player/track-plays.service'

export interface DialogData {
    track: Track;
}
@Component({
    selector: 'preview-modal',
    templateUrl: 'preview-modal.component.html',
    styleUrls: ['./preview-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PreviewModalComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, public trackPlays: TrackPlays) {}

    ngOnInit() {

    }

    incrementPlayCount(ev) {
        if (this.data.track.plays == 0) this.trackPlays.increment(this.data.track)
    }
}
