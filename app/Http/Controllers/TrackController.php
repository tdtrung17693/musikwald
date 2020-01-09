<?php namespace App\Http\Controllers;

use App;
use Log;
use Cache;
use App\Track;
use App\Services\Paginator;
use Common\Core\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\ModifyTracks;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class TrackController extends Controller {
	/**
	 * @var Track
	 */
	private $track;

    /**
     * @var Request
     */
    private $request;

    /**
     * @param Track $track
     * @param Request $request
     */
    public function __construct(Track $track, Request $request)
	{
		$this->track = $track;
        $this->request = $request;
    }

	/**
	 * Display a listing of the resource.
	 *
	 * @return LengthAwarePaginator
	 */
	public function index()
	{
        $this->authorize('index', Track::class);

        $params = $this->request->all();
        $params['order_by'] = isset($params['order_by']) ? $params['order_by'] : 'spotify_popularity';

	    return (new Paginator($this->track))->search(function ($query) {
	        return $query->where('pending', '=', 0);
        })->paginate($params);
	}

    public function pendingTracks()
    {
        $this->authorize('viewPending', Track::class);

        $params = $this->request->all();
        $params['order_by'] = isset($params['order_by']) ? $params['order_by'] : 'spotify_popularity';
        $params['query'] = 1;
        $params['with'] = 'uploadedBy';

        return (new Paginator($this->track))->search(function ($query, $isPending) {
            return $query->where('pending', '=', 1);
        })->paginate($params);
    }

	/**
	 * Find track matching given id.
	 *
	 * @param  int  $id
	 * @return JsonResponse
	 */
	public function show($id)
	{
        $track = $this->track->with('album.artist', 'album.tracks', 'uploadedBy')->findOrFail($id);
	    $this->authorize('show', $track);

	    return $this->success(['track' => $track]);
	}

    /**
     * Update existing track.
     *
     * @param int $id
     * @param ModifyTracks $validate
     * @return Track
     */
	public function update($id, ModifyTracks $validate)
	{
		$track = $this->track->findOrFail($id);

		$this->authorize('update', $track);
        Log::info($this->request->except('album'));
		$track->fill($this->request->except('album'))->save();

		return $track;
	}

    /**
     * Create a new track.
     *
     * @param ModifyTracks $validate
     * @return Track
     */
    public function store(ModifyTracks $validate)
    {
        $this->authorize('store', Track::class);

        $data = $this->request->all();
        $data['uploaded_by'] = $this->request->user()->id;
        $track = $this->track->create($data);

        if ($this->request->user()->hasPermission('superAdmin')) {
            $track->update(['pending' => 0]);
        }

        // A song uploaded by an user will be added to that user's library in default
        $this->request->user()->tracks()->sync($track->id, false);
        Cache::forget('tracks.top50');
        return $track;
    }

	/**
	 * Remove tracks from database.
	 *
	 * @return mixed
	 */
	public function destroy()
	{
        $this->validate($this->request, [
            'ids'   => 'required|array',
            'ids.*' => 'required|integer'
        ]);

        Track::find($this->request->get('ids'))->every(function ($track) {
            $this->authorize('destroy', $track);
        });

	    return $this->track->destroy($this->request->get('ids'));
	}
}
