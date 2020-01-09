import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {WebPlayerModule} from './web-player/web-player.module';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule, UrlSerializer} from '@angular/router';
import {CoreModule} from 'shared/core.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CustomUrlSerializer} from './custom-url-serializer';
import {Bootstrapper} from 'shared/bootstrapper.service';
import {AppBootstrapper} from './bootstrapper.service';
import {AuthModule} from 'shared/auth/auth.module';
import {AccountSettingsModule} from 'shared/account-settings/account-settings.module';
import {MatButtonModule, MatMenuModule, MatPaginatorModule, MatSortModule, MatTableModule} from '@angular/material';
import {COMMON_CONFIG} from 'shared/config/config';
import {APP_CONFIG} from './app-config';
import {PagesModule} from '../shared/pages/pages.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RouterModule,
        CoreModule.forRoot(),
        AuthModule,

        AppRoutingModule,
        WebPlayerModule,
        // account settings and pages modules must come after web player
        // module for proper account settings and custom page route override
        AccountSettingsModule,
        PagesModule,

        // material
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
    ],
    providers: [
        {provide: COMMON_CONFIG, useValue: APP_CONFIG, multi: true},
        {provide: Bootstrapper, useClass: AppBootstrapper},
        {provide: UrlSerializer, useClass: CustomUrlSerializer},
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
