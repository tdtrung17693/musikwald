import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Report} from 'app/models/Report';

export interface DialogData {
    report: Report;
}

@Component({
    selector: 'details-modal',
    templateUrl: 'details-modal.component.html',
    styleUrls: ['./details-modal.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DetailsModalComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

    ngOnInit() {}
}
