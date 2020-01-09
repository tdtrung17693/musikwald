import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CheckPermissionsGuard} from 'shared/guards/check-permissions-guard.service';
import {AdminComponent} from '@app/admin/admin.component';
import {SettingsComponent} from '@app/admin/settings/settings.component';
import {SettingsResolve} from '@app/admin/settings/settings-resolve.service';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {EditArtistPageResolver} from './artists/new-artist-page/edit-artist-page-resolver.service';
import {AlbumsPageComponent} from './albums/albums-page/albums-page.component';
import {TracksPageComponent} from './tracks/tracks-page/tracks-page.component';
import {PendingTracksPageComponent} from './pending-tracks-page/pending-tracks-page.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {BlockedArtistsSettingsComponent} from './settings/blocked-artists/blocked-artists-settings.component';
import {settingsRoutes} from '@app/admin/settings/settings-routing.module';
import {GenresComponent} from './genres/genres.component';
import {RolesComponent} from './roles/roles.component';
import {UsersComponent} from 'app/admin/users/users.component';
import {TranslationsComponent} from 'app/admin/translations/translations.component';
import {LocalizationsResolve} from 'app/admin/translations/localizations-resolve.service';
import {FileEntriesPageComponent} from 'app/admin/file-entries-page/file-entries-page.component';
import {ReportsPageComponent} from 'app/admin/reports/reports-page.component';
import {AuthGuard} from 'shared/guards/auth-guard.service';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        canActivate: [AuthGuard, CheckPermissionsGuard],
        canActivateChild: [AuthGuard, CheckPermissionsGuard],
        data: {permissions: ['admin.access']},
        children: [
            {
                path: 'artists',
                children: [
                    {path: '', component: ArtistsComponent, data: {permissions: ['artists.update']}},
                    {path: 'new', component: NewArtistPageComponent, data: {permissions: ['artists.create']}},
                    {
                        path: ':id/edit',
                        component: NewArtistPageComponent,
                        resolve: {artist: EditArtistPageResolver},
                        data: {permissions: ['artists.update']},
                    },
                ],
            },
            {
                path: 'albums',
                component: AlbumsPageComponent,
                data: {permissions: ['albums.view']},
            },
            {
                path: 'tracks',
                component: TracksPageComponent,
                data: {permissions: ['tracks.view']},
            },
            {
                path: 'pending-tracks',
                component: PendingTracksPageComponent,
                data: {permissions: ['admin']},
            },
            {
                path: 'reports',
                component: ReportsPageComponent,
                data: {permissions: ['admin']},
            },
            {
                path: 'genres',
                component: GenresComponent,
                data: {permissions: ['genres.view']},
            },
            {
                path: 'lyrics',
                component: LyricsPageComponent,
                data: {permissions: ['lyrics.view']},
            },
            {
                path: 'playlists',
                component: PlaylistsPageComponent,
                data: {permissions: ['playlists.view']},
            },
            {
                path: 'settings',
                component: SettingsComponent,
                resolve: {settings: SettingsResolve},
                data: {permissions: ['settings.view']},
                children: [
                    {path: 'player', component: PlayerSettingsComponent},
                    {path: 'blocked-artists', component: BlockedArtistsSettingsComponent},
                    ...settingsRoutes,
                ],
            },
            {
                path: '',
                redirectTo: 'settings',
                pathMatch: 'full',
            },
            {
                path: 'analytics',
                loadChildren: 'app/admin/analytics/analytics.module#AnalyticsModule',
                canActivate: [AuthGuard],
                data: {permissions: ['reports.view']},
            },
            {
                path: 'users',
                component: UsersComponent,
                data: {permissions: ['users.view']},
            },
            {
                path: 'roles',
                component: RolesComponent,
                data: {permissions: ['roles.view']},
            },
            {
                path: 'translations',
                component: TranslationsComponent,
                resolve: {localizations: LocalizationsResolve},
                data: {permissions: ['localizations.view']},
            },
            {
                path: 'files',
                component: FileEntriesPageComponent,
                data: {permissions: ['files.view']},
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AppAdminRoutingModule {
}
