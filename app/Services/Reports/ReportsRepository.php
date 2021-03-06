<?php namespace App\Services\Reports;

use App\Album;
use App\Artist;
use App\Report;
use App\Services\Artists\ArtistSaver;
use App\Services\Paginator;
use App\Services\Providers\ProviderResolver;
use Common\Settings\Settings;
use App\Track;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Arr;

class ReportsRepository
{

    /**
     * Paginate albums using specified parameters.
     *
     * @param array $params
     * @return LengthAwarePaginator
     */
    public function paginate($params = [])
    {
        return (new Paginator(new Report()))->with('track')->orderBy('created_at')->paginate($params);
    }

//    /**
//     * Update specified album.
//     *
//     * @param integer $id
//     * @param array $params
//     * @return Album
//     */
//    public function update($id, $params)
//    {
//        $album = $this->album->with('tracks')->findOrFail($id);
//
//        $album->fill(Arr::except($params, ['artist', 'tracks']))->save();
//
//        return $album;
//    }
//
//    /**
//     * Create a new album.
//     *
//     * @param array $params
//     * @return Album
//     */
//    public function create($params)
//    {
//
//        $albumParams = Arr::except($params, ['tracks', 'artist']);
//        $albumParams['spotify_popularity'] = Arr::get($albumParams, 'spotify_popularity', 50);
//        $album = $this->album->create($albumParams);
//
//        //set album name, id and artist name on each track
//        $tracks = array_map(function($track) use($album) {
//            $track['spotify_popularity'] = Arr::get($track, 'spotify_popularity', 50);
//            $track['album_name'] = $album->name;
//            $track['album_id'] = $album->id;
//            $track['artists'] = is_array($track['artists']) ? implode('*|*', $track['artists']) : $track['artists'];
//            return $track;
//        }, Arr::get($params, 'tracks', []));
//
//        $this->track->insert($tracks);
//
//        return $album->load('tracks');
//    }
//
//    /**
//     * Delete specified albums.
//     *
//     * @param array $ids
//     * @return void
//     */
//    public function delete($ids)
//    {
//        $this->album->whereIn('id', $ids)->delete();
//        $this->track->whereIn('album_id', $ids)->delete();
//    }
//
//    /**
//     * Update or fetch album from third party site if needed.
//     *
//     * @param integer $id
//     * @return Album
//     */
//    public function load($id)
//    {
//        $album = $this->album->with('artist')->findOrFail($id);
//
//        if ($this->needsUpdating($album)) {
//            $this->updateAlbum($album);
//        }
//
//        return $album->fresh(['artist', 'tracks' => function ($q) { return $q->approved(); }]);
//    }
//
//    /**
//     * Update album using 3rd party APIs.
//     *
//     * @param Album $album
//     */
//    private function updateAlbum(Album $album)
//    {
//        $artistName = $album->artist ? $album->artist->name : null;
//
//        $data = $this->resolver->get('album')->getAlbum($artistName, $album->name);
//
//        if ( ! $data) return;
//
//        //if album artist is not in database yet, fetch and save it
//        //fetching artist will get all his albums as well
//        if ($data['artist'] && ! $album->artist) {
//            $artist = $this->resolver->get('artist')->getArtist($artistName);
//            if ($artist) $this->saver->save($artist);
//        } else {
//            $this->saver->saveAlbums(['albums' => [$data['album']]], $album->artist, $album->id);
//            $this->saver->saveTracks([$data['album']], null, $album);
//        }
//    }
//
//    /**
//     * Check if specified albums needs to be updated via external site.
//     *
//     * @param Album $album
//     * @return bool
//     */
//    private function needsUpdating(Album $album)
//    {
//        if ($this->settings->get('album_provider', 'local') === 'local') return false;
//        if ( ! $album->auto_update) return false;
//
//        if ( ! $album->fully_scraped) return true;
//        if ( ! $album->tracks || $album->tracks->isEmpty()) return true;
//
//        return false;
//    }
}
