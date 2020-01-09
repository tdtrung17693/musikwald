<?php namespace App\Http\Controllers;

use App;
use App\Track;
use App\Jobs\IncrementModelViews;
use Illuminate\Http\Request;
use Common\Core\Controller;

class TrackPlaysController extends Controller {

    /**
     * @var Track
     */
    private $track;

    /**
     * TrackPlaysController constructor.
     *
     * @param Track $track
     */
    public function __construct(Track $track)
	{
        $this->track = $track;
    }

    /**
     * Increment specified track plays.
     *
     * @param integer $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function increment($id,  Request $request)
    {
        $this->authorize('show', Track::find($id));

        dispatch(new IncrementModelViews($id, 'track'));

        return $this->success();
    }
}
