export const APP_CONFIG = {
    assetsPrefix: 'client',
    navbar: {
        defaultPosition: 'dashboard',
        dropdownItems: [
            {route: '/genres', name: 'Player', icon: 'audiotrack'},
        ]
    },
    auth: {
        color: 'accent',
        redirectUri: '/',
        fallbackRedirectUri: '/genres',
        adminRedirectUri: '/',
    },
    accountSettings: {
        hideNavbar: true,
    },
    customPages: {
        hideNavbar: true,
    },
    admin: {
        pages: [
            {name: 'artists', icon: 'mic', route: 'artists', permission: 'artists.view'},
            {name: 'albums', icon: 'album', route: 'albums', permission: 'albums.view'},
            {name: 'tracks', icon: 'audiotrack', route: 'tracks', permission: 'tracks.view'},
            {name: 'genres', icon: 'local-offer', route: 'genres', permission: 'genres.view'},
            {name: 'lyrics', icon: 'queue-music', route: 'lyrics', permission: 'lyrics.view'},
            {name: 'playlists', icon: 'playlist-play', route: 'playlists', permission: 'playlists.view'},
        ],
        settingsPages: [
            {name: 'providers', route: 'providers'},
            {name: 'player', route: 'player'},
            {name: 'blocked artists', route: 'blocked-artists'},
        ],
        analytics: {
            stats: [
                {name: 'users', icon: 'people'},
                {name: 'tracks', display_name: 'songs', icon: 'audiotrack'},
                {name: 'artists', icon: 'mic'},
                {name: 'albums', icon: 'album'},
            ]
        }
    },
};
