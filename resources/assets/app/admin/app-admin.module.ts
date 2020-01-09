import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AppAdminRoutingModule} from './app-admin-routing.module';
import {ArtistsComponent} from './artists/artists.component';
import {NewArtistPageComponent} from './artists/new-artist-page/new-artist-page.component';
import {ArtistAlbumsTableComponent} from './artists/new-artist-page/artist-albums-table/artist-albums-table.component';
import {CrupdateAlbumModalComponent} from './albums/crupdate-album-modal/crupdate-album-modal.component';
import {CrupdateLyricModalComponent} from './lyrics-page/crupdate-lyric-modal/crupdate-lyric-modal.component';
import {NewTrackModalComponent} from './tracks/new-track-modal/new-track-modal.component';
import {TracksPageComponent} from './tracks/tracks-page/tracks-page.component';
import {PendingTracksPageComponent} from './pending-tracks-page/pending-tracks-page.component';
import {PreviewModalComponent} from './pending-tracks-page/preview-modal.component';
import {AlbumsPageComponent} from './albums/albums-page/albums-page.component';
import {LyricsPageComponent} from './lyrics-page/lyrics-page.component';
import {AlbumTracksTableComponent} from './albums/crupdate-album-modal/album-tracks-table/album-tracks-table.component';
import {PlaylistsPageComponent} from './playlists-page/playlists-page.component';
import {ProvidersSettingsComponent} from './settings/providers/providers-settings.component';
import {PlayerSettingsComponent} from './settings/player/player-settings.component';
import {BlockedArtistsSettingsComponent} from './settings/blocked-artists/blocked-artists-settings.component';
import {UploadsModule} from '../../uploads/uploads.module';
import {GenresComponent} from './genres/genres.component';
import {CrupdateGenreModalComponent} from './genres/crupdate-genre-modal/crupdate-genre-modal.component';
import {RolesComponent} from './roles/roles.component';
import {CrupdateRoleModalComponent} from './roles/crupdate-role-modal/crupdate-role-modal.component';
import {AssignUsersToRoleModalComponent} from './roles/assign-users-to-role-modal/assign-users-to-role-modal.component';
import {AdminComponent} from 'app/admin/admin.component';
import {Settings} from 'shared/config/settings.service';
import {MaterialModule} from 'shared/ui/material.module';
import {TextEditorModule} from 'shared/text-editor/text-editor.module';
import {SettingsModule} from 'app/admin/settings/settings.module';
import {UiModule} from 'shared/ui/ui.module';
import {AuthModule} from 'shared/auth/auth.module';
import {SpaceInputModule} from 'shared/ui/space-input/space-input.module';
import {UsersComponent} from 'app/admin/users/users.component';
import {CrupdateUserModalComponent} from 'app/admin/users/crupdate-user-modal/crupdate-user-modal.component';
import {TranslationsComponent} from 'app/admin/translations/translations.component';
import {CrupdateLocalizationModalComponent} from 'app/admin/translations/crupdate-localization-modal/crupdate-localization-modal.component';
import {NewLineModalComponent} from 'app/admin/translations/new-line-modal/new-line-modal.component';
import {UserAccessManagerComponent} from 'app/admin/users/user-access-manager/user-access-manager.component';
import {SelectRolesModalComponent} from 'app/admin/users/select-roles-modal/select-roles-modal.component';
import {SelectPermissionsModalComponent} from 'app/admin/permissions/select-permissions-modal/select-permissions-modal.component';
import {PermissionsManagerPanelComponent} from 'app/admin/permissions/permissions-manager-panel/permissions-manager-panel.component';
import {FileEntriesPageComponent} from 'app/admin/file-entries-page/file-entries-page.component';
import {DataTableComponent} from 'app/admin/data-table/data-table.component';
import {ReportsPageComponent} from 'app/admin/reports/reports-page.component';
import {DetailsModalComponent} from '@app/admin/reports/details-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppAdminRoutingModule,
        UploadsModule,
        // material
        MaterialModule,
        RouterModule,
        ReactiveFormsModule,
        TextEditorModule,
        SettingsModule,
        UiModule,
        AuthModule,
        SpaceInputModule,
    ],
    declarations: [
        AdminComponent,
        ArtistsComponent,
        NewArtistPageComponent,
        ReportsPageComponent,
        ArtistAlbumsTableComponent,
        CrupdateAlbumModalComponent,
        CrupdateLyricModalComponent,
        NewTrackModalComponent,
        TracksPageComponent,
        AlbumsPageComponent,
        LyricsPageComponent,
        AlbumTracksTableComponent,
        PlaylistsPageComponent,
        PendingTracksPageComponent,
        PreviewModalComponent,
        RolesComponent,
        CrupdateRoleModalComponent,
        AssignUsersToRoleModalComponent,
        // settings
        ProvidersSettingsComponent,
        PlayerSettingsComponent,
        BlockedArtistsSettingsComponent,
        GenresComponent,
        CrupdateGenreModalComponent,
        UsersComponent,
        CrupdateUserModalComponent,
        TranslationsComponent,
        CrupdateLocalizationModalComponent,
        NewLineModalComponent,
        UserAccessManagerComponent,
        SelectRolesModalComponent,
        SelectPermissionsModalComponent,
        PermissionsManagerPanelComponent,
        FileEntriesPageComponent,
        DataTableComponent,
        DetailsModalComponent,
    ],
    entryComponents: [
        CrupdateRoleModalComponent,
        AssignUsersToRoleModalComponent,
        CrupdateAlbumModalComponent,
        CrupdateLyricModalComponent,
        NewTrackModalComponent,
        PreviewModalComponent,
        CrupdateGenreModalComponent,
        CrupdateUserModalComponent,
        CrupdateLocalizationModalComponent,
        NewLineModalComponent,
        SelectRolesModalComponent,
        SelectPermissionsModalComponent,
        PermissionsManagerPanelComponent,
        DetailsModalComponent,
    ],
})
export class AppAdminModule {
    constructor(private settings: Settings) {
        this.settings.merge({
            app: {
                admin: {
                    pages: [],
                    appearance: {
                        navigationRoutes: [],
                        menus: {
                            availableRoutes: [
                                'login',
                                'register',
                                'contact',
                                'account-settings',
                                'admin/users',
                                'admin/settings/authentication',
                                'admin/settings/branding',
                                'admin/settings/cache',
                                'admin/settings/providers',
                                'admin/roles',
                            ],
                        },
                    },
                },
            },
        });
    }
}
