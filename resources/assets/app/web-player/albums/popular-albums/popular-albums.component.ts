import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Album} from '../../../models/Album';
import {FilterablePage} from '../../filterable-page/filterable-page';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'popular-albums',
    templateUrl: './popular-albums.component.html',
    styleUrls: ['./popular-albums.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PopularAlbumsComponent extends FilterablePage<Album> implements OnInit {
    constructor(private route: ActivatedRoute) {
        super(['name', 'artist.name']);
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.setItems(data.api.albums);
        });
    }
}
