import {Component,  Input, ViewEncapsulation} from '@angular/core';
import {WebPlayerUrls} from "../../web-player-urls.service";
import {User} from "shared/types/models/User";
import {Settings} from "shared/config/settings.service";
import {WebPlayerImagesService} from "../../web-player-images.service";

@Component({
    selector: 'user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'media-grid-item'},
})
export class UserItemComponent {
    @Input() scrollContainer: HTMLElement;
    @Input() user: User;

    /**
     * UserItemComponent Constructor
     */
    constructor(
        public urls: WebPlayerUrls,
        public settings: Settings,
        public wpImages: WebPlayerImagesService,
    ) {}
}
