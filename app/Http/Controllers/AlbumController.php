<?php namespace App\Http\Controllers;

use App;
use App\Album;
use App\Jobs\IncrementModelViews;
use App\Services\Meta\MetaTags;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Http\Requests\ModifyAlbums;
use App\Services\Albums\AlbumsRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Common\Core\Controller;
use Cache;

class AlbumController extends Controller {

    /**
     * @var Request
     */
    private $request;

    /**
     * @var AlbumsRepository
     */
    private $repository;

    /**
     * @param AlbumsRepository $repository
     * @param Request $request
     */
	public function __construct(AlbumsRepository $repository, Request $request)
	{
        $this->request = $request;
        $this->repository = $repository;
    }

	/**
	 * Paginate all albums.
	 *
	 * @return LengthAwarePaginator
	 */
	public function index()
	{
		$this->authorize('index', Album::class);

	    return $this->repository->paginate($this->request->all());
	}

    /**
     * Get album matching specified ID.
     *
     * @param number $id
     * @return JsonResponse
     */
    public function show($id)
    {
        $this->authorize('show', Album::class);

        $album = $this->repository->load($id);

        dispatch(new IncrementModelViews($album->id, 'album'));

        $data = ['album' => $album];

        return $this->success($data);
    }

    /**
     * Update existing album.
     *
     * @param  int $id
     * @param ModifyAlbums $validate
     * @return Album
     */
	public function update($id, ModifyAlbums $validate)
	{
		$this->authorize('update', Album::class);

	    $album = $this->repository->update($id, $this->request->all());
        return $album;
	}

    /**
     * Create a new album.
     *
     * @param ModifyAlbums $validate
     * @return Album
     */
    public function store(ModifyAlbums $validate)
    {
        $this->authorize('store', Album::class);
        $album = $this->repository->create($this->request->all());
        Cache::forget('albums.latest');
        return $album;
    }

	/**
	 * Remove specified albums.
	 *
	 * @return mixed
	 */
	public function destroy()
	{
	    $this->authorize('destroy', Album::class);

        $this->validate($this->request, [
            'ids'   => 'required|array',
            'ids.*' => 'required|integer'
        ]);

	    $this->repository->delete($this->request->get('ids'));

	    return $this->success();
	}
}
