<?php

return [
    //homepage
    ['name' => 'homepage.type', 'value' => 'default'],
    ['name' => 'homepage.value', 'value' => 'genres'],

    //cache
    ['name' => 'cache.report_minutes', 'value' => 60],
    ['name' => 'cache.homepage_days', 'value' => 1],
    ['name' => 'automation.artist_interval', 'value' => 7],

    //providers
    ['name' => 'artist_provider', 'value' => 'Local'],
    ['name' => 'album_provider', 'value' => 'Local'],
    ['name' => 'radio_provider', 'value' => 'Spotify'],
    ['name' => 'genres_provider', 'value' => 'Local'],
    ['name' => 'album_images_provider', 'value' => 'real'],
    ['name' => 'artist_images_provider', 'value' => 'real'],
    ['name' => 'new_releases_provider', 'value' => 'Local'],
    ['name' => 'top_tracks_provider', 'value' => 'Local'],
    ['name' => 'top_albums_provider', 'value' => 'Local'],
    ['name' => 'search_provider', 'value' => 'Local'],
    ['name' => 'audio_search_provider', 'value' => 'Youtube'],
    ['name' => 'artist_bio_provider', 'value' => 'wikipedia'],

    //player
    ['name' => 'youtube.suggested_quality', 'value' => 'default'],
    ['name' => 'youtube.region_code', 'value' => 'US'],
    ['name' => 'player.default_volume', 'value' => 30],
    ['name' => 'player.hide_queue', 'value' => 0],
    ['name' => 'player.hide_video', 'value' => 0],
    ['name' => 'player.hide_video_button', 'value' => 0],
    ['name' => 'player.hide_lyrics', 'value' => 0],
    ['name' => 'player.mobile.auto_open_overlay', 'value' => 1],
    ['name' => 'player.enable_download', 'value' => 0],
    ['name' => 'player.sort_method', 'value' => 'external'],

    //other
    ['name' => 'https.enable_cert_verification', 'value' => 1],
    ['name' => 'site.force_https', 'value' => 0],

    //menus
    ['name' => 'menus', 'value' => json_encode([
        ['name' => 'Primary', 'position' => 'sidebar-primary', 'items' => [
            ['type' => 'route', 'order' => 1, 'label' => 'Popular Albums', 'action' => 'popular-albums', 'icon' => 'album'],
            ['type' => 'route', 'order' => 2, 'label' => 'Popular Genres', 'action' => 'genres', 'icon' => 'local-offer'],
            ['type' => 'route', 'order' => 3, 'label' => 'Top 50', 'action' => 'top-50', 'icon' => 'trending-up'],
            ['type' => 'route', 'order' => 4, 'label' => 'New Releases', 'action' => 'new-releases', 'icon' => 'new-releases']
        ]],
        ['name' => 'Secondary ', 'position' => 'sidebar-secondary', 'items' => [
            ['type' => 'route', 'order' => 1, 'label' => 'Songs', 'action' => '/library/songs', 'icon' => 'audiotrack'],
            ['type' => 'route', 'order' => 2, 'label' => 'Albums', 'action' => '/library/albums', 'icon' => 'album'],
            ['type' => 'route', 'order' => 3, 'label' => 'Artists', 'action' => '/library/artists', 'icon' => 'mic']
        ]],
        ['name' => 'Mobile ', 'position' => 'mobile-bottom', 'items' => [
            ['type' => 'route', 'order' => 1, 'label' => 'Genres', 'action' => '/genres', 'icon' => 'local-offer'],
            ['type' => 'route', 'order' => 2, 'label' => 'Top 50', 'action' => '/top-50', 'icon' => 'trending-up'],
            ['type' => 'route', 'order' => 3, 'label' => 'Search', 'action' => '/search', 'icon' => 'search'],
            ['type' => 'route', 'order' => 4, 'label' => 'Your Music', 'action' => '/library', 'icon' => 'library-music'],
            ['type' => 'route', 'order' => 4, 'label' => 'Account', 'action' => '/account/settings', 'icon' => 'person']
        ]]
    ])],
];
