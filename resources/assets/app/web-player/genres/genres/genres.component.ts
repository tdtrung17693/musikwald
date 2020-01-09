import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WebPlayerUrls} from '../../web-player-urls.service';
import {Genre} from '../../../models/Genre';
import {FilterablePage} from '../../filterable-page/filterable-page';
import {ActivatedRoute} from '@angular/router';
import {Settings} from 'shared/config/settings.service';
import {WebPlayerImagesService} from '../../web-player-images.service';

@Component({
    selector: 'popular-genres',
    templateUrl: './genres.component.html',
    styleUrls: ['./genres.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class GenresComponent extends FilterablePage<Genre> implements OnInit {
    constructor(
        private route: ActivatedRoute,
        public urls: WebPlayerUrls,
        public settings: Settings,
        public wpImages: WebPlayerImagesService,
    ) {
        super(['name']);
    }

    ngOnInit() {
        this.route.data.subscribe(data => {
            this.setItems(data.api.genres);
        });
    }
}
