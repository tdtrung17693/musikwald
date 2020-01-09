import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PopularAlbumsComponent} from './albums/popular-albums/popular-albums.component';
import {WebPlayerComponent} from './web-player.component';
import {GenresComponent} from './genres/genres/genres.component';
import {AlbumComponent} from './albums/album/album.component';
import {AlbumResolver} from './albums/album/album-resolver.service';
import {PopularAlbumsResolver} from './albums/popular-albums/popular-albums-resolver.service';
import {GenresResolver} from './genres/genres/genres-resolver.service';
import {LibraryTracksComponent} from './users/user-library/library-tracks/library-tracks.component';
import {LibraryTracksResolver} from './users/user-library/library-tracks/library-tracks-resolver.service';
import {LibraryUploadedComponent} from './users/user-library/library-uploaded/library-uploaded.component';
import {LibraryUploadedResolver} from './users/user-library/library-uploaded/library-uploaded-resolver.service';
import {LibraryAlbumsComponent} from './users/user-library/library-albums/library-albums.component';
import {LibraryAlbumsResolver} from './users/user-library/library-albums/library-albums-resolver.service';
import {LibraryArtistsComponent} from './users/user-library/library-artists/library-artists.component';
import {LibraryArtistsResolver} from './users/user-library/library-artists/library-artists-resolver.service';
import {ArtistComponent} from './artists/artist/artist.component';
import {ArtistResolver} from './artists/artist/artist-resolver.service';
import {GenreComponent} from './genres/genre/genre.component';
import {GenreArtistsResolver} from './genres/genre/genre-artists-resolver.service';
import {PlaylistComponent} from './playlists/playlist/playlist.component';
import {PlaylistResolver} from './playlists/playlist/playlist-resolver.service';
import {SearchComponent} from './search/search/search.component';
import {SearchResolver} from './search/search/search-resolver.service';
import {SearchTabValidGuard} from './search/search/search-tab-valid.guard';
import {TrackPageComponent} from './tracks/track-page/track-page.component';
import {TrackPageResolver} from './tracks/track-page/track-page-resolver.service';
import {UserProfilePageComponent} from './users/user-profile-page/user-profile-page.component';
import {UserProfilePageResolver} from './users/user-profile-page/user-profile-page-resolver.service';
import {NewReleasesPageComponent} from './albums/new-releases-page/new-releases-page.component';
import {NewReleasesPageResolver} from './albums/new-releases-page/new-releases-page.resolver.service';
import {TopTracksPageComponent} from './tracks/top-tracks-page/top-tracks-page.component';
import {TopTracksPageResolver} from './tracks/top-tracks-page/top-tracks-page-resolver.service';
import {RadioPageComponent} from './radio-page/radio-page.component';
import {RadioPageResolver} from './radio-page/radio-page-resolver.service';
import {UserLibraryComponent} from './users/user-library/user-library.component';
import {LibraryPlaylistsComponent} from './users/user-library/library-playlists/library-playlists.component';
import {LibraryPlaylistsResolver} from './users/user-library/library-playlists/library-playlists-resolver.service';
import {UserUploadPageComponent} from './upload/upload.component';
import {EmptyRouteComponent} from 'shared/ui/empty-route/empty-route.component';
import {CheckPermissionsGuard} from 'shared/guards/check-permissions-guard.service';
import {AuthGuard} from 'shared/guards/auth-guard.service';
import {AccountSettingsResolve} from 'shared/account-settings/account-settings-resolve.service';
import {AccountSettingsComponent} from 'shared/account-settings/account-settings.component';
import {CustomPageComponent} from 'shared/pages/custom-page/custom-page.component';
import {NotFoundPageComponent} from 'shared/pages/not-found-page/not-found-page.component';

const routes: Routes = [
    {
        path: '', component: WebPlayerComponent, canActivateChild: [CheckPermissionsGuard], data: {name: 'parent-home-route'}, children: [
            {path: '', component: NewReleasesPageComponent, resolve: {api: NewReleasesPageResolver}, data: {name: 'home'}},

            {
                path: 'popular-albums',
                component: PopularAlbumsComponent,
                resolve: {api: PopularAlbumsResolver},
                data: {name: 'popular-albums'},
            },

            {path: 'upload', component: UserUploadPageComponent, data: {name: 'upload'}},
            {
                path: 'new-releases',
                component: NewReleasesPageComponent,
                resolve: {api: NewReleasesPageResolver},
                data: {name: 'new-releases'},
            },

            {path: 'top-50', component: TopTracksPageComponent, resolve: {api: TopTracksPageResolver}, data: {name: 'top-50'}},

            {path: 'genres', component: GenresComponent, resolve: {api: GenresResolver}, data: {name: 'genres'}},

            {path: 'album/:id/:artist/:album', component: AlbumComponent, resolve: {api: AlbumResolver}, data: {name: 'album'}},

            {path: 'genre/:name', component: GenreComponent, resolve: {api: GenreArtistsResolver}, data: {name: 'genre'}},

            {path: 'playlists/:id', component: PlaylistComponent, resolve: {api: PlaylistResolver}, data: {name: 'playlist'}},
            {path: 'playlists/:id/:name', component: PlaylistComponent, resolve: {api: PlaylistResolver}, data: {name: 'playlist'}},

            {path: 'track/:id', component: TrackPageComponent, resolve: {api: TrackPageResolver}, data: {name: 'track'}},
            {path: 'track/:id/:name', component: TrackPageComponent, resolve: {api: TrackPageResolver}, data: {name: 'track'}},

            {
                path: 'user/:id',
                component: UserProfilePageComponent,
                resolve: {user: UserProfilePageResolver},
                data: {name: 'user'},
                children: [
                    {path: 'playlists', component: EmptyRouteComponent},
                    {path: 'following', component: EmptyRouteComponent},
                    {path: 'followers', component: EmptyRouteComponent},
                ],
            },

            {
                path: 'user/:id/:name',
                component: UserProfilePageComponent,
                resolve: {api: UserProfilePageResolver},
                data: {name: 'user'},
                children: [
                    {path: 'playlists', component: EmptyRouteComponent},
                    {path: 'uploaded_tracks', component: EmptyRouteComponent},
                    {path: 'following', component: EmptyRouteComponent},
                    {path: 'followers', component: EmptyRouteComponent},
                ],
            },

            {path: 'search', component: SearchComponent, data: {name: 'search'}},
            {path: 'search/:query', component: SearchComponent, resolve: {results: SearchResolver}, data: {name: 'search'}},
            {
                path: 'search/:query/:tab',
                component: SearchComponent,
                resolve: {results: SearchResolver},
                canActivate: [SearchTabValidGuard],
                data: {name: 'search'},
            },

            {
                path: 'artist/:name',
                component: ArtistComponent,
                resolve: {artist: ArtistResolver},
                data: {name: 'artist', willSetSeo: true},
                children: [
                    {path: 'similar', component: EmptyRouteComponent},
                    {path: 'about', component: EmptyRouteComponent},
                ],
            },

            {
                path: 'artist/:id/:name',
                component: ArtistComponent,
                resolve: {artist: ArtistResolver},
                data: {name: 'artist', willSetSeo: true},
                children: [
                    {path: 'similar', component: EmptyRouteComponent},
                    {path: 'about', component: EmptyRouteComponent},
                ],
            },

            {
                path: 'radio/artist/:id/:name',
                component: RadioPageComponent,
                resolve: {radio: RadioPageResolver},
                data: {type: 'artist', name: 'radio'},
            },
            {
                path: 'radio/track/:id/:name',
                component: RadioPageComponent,
                resolve: {radio: RadioPageResolver},
                data: {type: 'track', name: 'radio'},
            },

            {
                path: 'library', component: UserLibraryComponent, canActivate: [AuthGuard], canActivateChild: [AuthGuard], children: [
                    {path: '', redirectTo: 'songs', pathMatch: 'full'},
                    {
                        path: 'songs',
                        component: LibraryTracksComponent,
                        resolve: {pagination: LibraryTracksResolver},
                        data: {name: 'library.tracks', title: 'Your Tracks'},
                    },
                    {
                        path: 'uploaded-songs',
                        component: LibraryUploadedComponent,
                        resolve: {pagination: LibraryUploadedResolver},
                        data: {name: 'library.uploaded_tracks', title: 'Uploaded Tracks'},
                    },
                    {
                        path: 'albums',
                        component: LibraryAlbumsComponent,
                        resolve: {albums: LibraryAlbumsResolver},
                        data: {name: 'library.albums', title: 'Your Albums'},
                    },
                    {
                        path: 'artists',
                        component: LibraryArtistsComponent,
                        resolve: {artists: LibraryArtistsResolver},
                        data: {name: 'library.artists', title: 'Your Artists'},
                    },
                    {
                        path: 'playlists',
                        component: LibraryPlaylistsComponent,
                        resolve: {playlists: LibraryPlaylistsResolver},
                        data: {name: 'library.playlists', title: 'Your Playlists'},
                    },
                ],
            },

            {path: 'account-settings', redirectTo: 'account/settings'},
            {
                path: 'account/settings',
                component: AccountSettingsComponent,
                resolve: {resolves: AccountSettingsResolve},
                canActivate: [AuthGuard],
                data: {name: 'account-settings'},
            },

            {
                path: 'pages/:id/:slug',
                component: CustomPageComponent,
                data: {permissions: ['pages.view']},
            },

            {
                path: '**',
                component: NotFoundPageComponent,
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WebPlayerRoutingModule {
}


