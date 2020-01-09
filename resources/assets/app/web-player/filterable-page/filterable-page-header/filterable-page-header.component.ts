import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    HostBinding,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";
import {BrowserEvents} from "shared/services/browser-events.service";
import {WebPlayerState} from '../../web-player-state.service';

@Component({
    selector: 'filterable-page-header',
    templateUrl: './filterable-page-header.component.html',
    styleUrls: ['./filterable-page-header.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterablePageHeaderComponent implements OnInit, OnDestroy {
    @ViewChild('filterInput') filterInput: ElementRef;

    @HostBinding('class.hidden') get isHidden() {
        return this.state.isMobile;
    }

    /**
     * Active component subscriptions.
     */
    private subscriptions: Subscription[] = [];

    /**
     * Form control for filter input;
     */
    @Input() public filterQuery: FormControl;

    constructor(private browserEvents: BrowserEvents, private state: WebPlayerState) {}

    ngOnInit() {
        this.initKeybinds();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(subscription => {
            subscription.unsubscribe();
        });

        this.subscriptions = [];
    }

    /**
     * Initiate volume keyboard shortcuts.
     */
    private initKeybinds() {
        const sub = this.browserEvents.globalKeyDown$.subscribe((e: KeyboardEvent) => {
            //ctrl+f - focus search bar
            if (e.ctrlKey && e.keyCode === this.browserEvents.keyCodes.letters.f) {
                this.filterInput.nativeElement.focus();
                e.preventDefault();
            }
        });

        this.subscriptions.push(sub);
    }
}
