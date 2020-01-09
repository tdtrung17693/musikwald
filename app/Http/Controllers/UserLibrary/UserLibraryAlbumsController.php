<?php namespace App\Http\Controllers\UserLibrary;

use App\Track;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Common\Core\Controller;

class UserLibraryAlbumsController extends Controller {

    /**
     * @var Request
     */
    private $request;

    /**
     * @var Track
     */
    private $track;

    /**
     * UserLibraryController constructor.
     *
     * @param Request $request
     * @param Track $track
     */
    public function __construct(Request $request, Track $track)
    {
        $this->middleware('auth');

        $this->request = $request;
        $this->track = $track;
    }

    /**
     * Get all albums in user's library.
     *
     * @return Collection
     */
    public function index()
    {
        $tracks = $this->request->user()->load(['tracks.album.artist' => function(BelongsTo $q) {
            return $q->select('id', 'name');
        }])->tracks;

        $albums = $tracks->map(function(Track $track) {
            $album = $track->album;
            if (!$album) return null;

            $album->added_at = $track->pivot->created_at->timestamp;
            return $album;
        });
        return $albums->filter(function ($track) { return $track != null; })->unique('id')->values();
    }
}
