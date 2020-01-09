import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingIndicatorComponent} from './loading-indicator/loading-indicator.component';
import {NoResultsMessageComponent} from './no-results-message/no-results-message.component';
import {CommonModule} from '@angular/common';
import {CustomMenuComponent} from './custom-menu/custom-menu.component';
import {EmptyRouteComponent} from './empty-route/empty-route.component';
import {EnterKeybindDirective} from './enter-keybind.directive';
import {ConfirmModalModule} from './confirm-modal/confirm-modal.module';
import {LoggedInUserWidgetComponent} from './logged-in-user-widget/logged-in-user-widget.component';
import {MaterialNavbar} from './material-navbar/material-navbar.component';
import {AdHostComponent} from './ad-host/ad-host.component';
import {FormattedDatePipe} from './formatted-date.pipe';
import {CustomScrollbarModule} from './custom-scrollbar/custom-scrollbar.module';
import {BreakpointsService} from './breakpoints.service';
import {ContextMenuDirective} from './context-menu/context-menu.directive';
import {TranslationsModule} from '../translations/translations.module';
import {FormattedFileSizePipe} from '../../uploads/formatted-file-size.pipe';
import {ContactComponent} from '../contact/contact.component';
import {LoadingPageComponent} from './loading-indicator/loading-page/loading-page.component';
import {AuthClickDirective} from './auth-click.directive';
import {MaterialModule} from './material.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        HttpClientModule,

        MaterialModule,
        // internal
        CustomScrollbarModule,
        ConfirmModalModule,
        TranslationsModule,
    ],
    declarations: [
        LoadingIndicatorComponent,
        LoadingPageComponent,
        NoResultsMessageComponent,
        CustomMenuComponent,
        EmptyRouteComponent,
        EnterKeybindDirective,
        LoggedInUserWidgetComponent,
        MaterialNavbar,
        AdHostComponent,
        ContactComponent,
        FormattedDatePipe,
        ContextMenuDirective,
        FormattedFileSizePipe,
        AuthClickDirective,
    ],
    exports: [
        LoadingIndicatorComponent,
        MaterialModule,
        LoadingPageComponent,
        NoResultsMessageComponent,
        CustomMenuComponent,
        EmptyRouteComponent,
        EnterKeybindDirective,
        LoggedInUserWidgetComponent,
        MaterialNavbar,
        AdHostComponent,
        ContactComponent,
        FormattedDatePipe,
        ContextMenuDirective,
        FormattedFileSizePipe,
        AuthClickDirective,

        // angular
        CommonModule,
        FormsModule,
        ReactiveFormsModule,

        // internal
        ConfirmModalModule,
        CustomScrollbarModule,
        TranslationsModule,
    ],
    providers: [BreakpointsService],
})
export class UiModule {
}
