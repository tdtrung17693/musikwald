<?php

namespace App\Services;

class UrlGenerator
{
    const SEPARATOR = '+';

    /**
     * @param array $artist
     * @return string
     */
    public function artist($artist)
    {
        return url("artist/{$artist['id']}/".str_slug($artist['name'], self::SEPARATOR));
    }

    /**
     * @param array $album
     * @return string
     */
    public function album($album)
    {
        $albumName = str_slug($album['name']);
        $uri = "album/{$album['id']}/";
        $uri .= $album['artist'] ? str_slug($album['artist']['name'], self::SEPARATOR).'/'.$albumName : $albumName;
        return url($uri);
    }

    /**
     * @param array $track
     * @return string
     */
    public function track($track)
    {
        return url("track/{$track['id']}/".str_slug($track['name'], self::SEPARATOR));
    }

    /**
     * @param array $genre
     * @return string
     */
    public function genre($genre)
    {
        $name = str_slug($genre['name'], self::SEPARATOR);
        return url("genre/$name");
    }

    /**
     * @param array $playlist
     * @return string
     */
    public function playlist($playlist)
    {
        $name = str_slug($playlist['name'], self::SEPARATOR);
        return url("playlists/{$playlist['id']}/$name");
    }

    /**
     * @param array $user
     * @return string
     */
    public function user($user)
    {
        $name = str_slug($user['display_name'], self::SEPARATOR);
        return url("user/{$user['id']}/$name");
    }

    /**
     * @param array $data
     * @return string
     */
    public function search($data)
    {
        $name = str_slug($data['query'], self::SEPARATOR);
        return url("search/$name");
    }

    /**
     * @return string
     */
    public function top50()
    {
        return url('top-50');
    }

    /**
     * Generate url based on called method name, if there's no specific method.
     *
     * @param string $name
     * @param array $arguments
     * @return string
     */
    public function __call($name, $arguments)
    {
        return url(kebab_case($name));
    }
}