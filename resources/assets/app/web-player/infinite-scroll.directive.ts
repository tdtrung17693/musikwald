import {Input, Directive, Output, EventEmitter} from '@angular/core';
import {InfiniteScroll} from '../../shared/ui/infinite-scroll/infinite.scroll';

@Directive({
    selector: '[infinite-scroll]'
})
export class InfiniteScrollDirective extends InfiniteScroll {
    @Input() infiniteScrollEnabled = false;
    @Output() onInfiniteScroll = new EventEmitter();

    protected canLoadMore() {
        return this.infiniteScrollEnabled;
    }

    protected isLoading() {
        return false;
    }

    protected loadMoreItems() {
        this.onInfiniteScroll.emit();
    }
}
