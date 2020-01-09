<?php namespace App\Http\Controllers;

use App;
use App\Services\Providers\ProviderResolver;
use App\Track;
use Cache;
use Carbon\Carbon;
use Common\Core\Controller;
use Common\Settings\Settings;
use Illuminate\Http\JsonResponse;

class TopTracksController extends Controller
{
    /**
     * @var Settings
     */
    private $settings;

    /**
     * @var ProviderResolver
     */
    private $resolver;

    /**
     * @param Settings $settings
     * @param ProviderResolver $resolver
     */
    public function __construct(Settings $settings, ProviderResolver $resolver)
    {
        $this->settings = $settings;
        $this->resolver = $resolver;
    }

    /**
     * @return JsonResponse
     */
    public function index()
    {
        $this->authorize('index', Track::class);
        $tracks = Cache::remember('tracks.top50', $this->getCacheTime(), function() {
            $tracks = Track::approved()->with('album.artist')->orderBy('plays', 'desc')->limit(50)->get();
            return ! empty($tracks) ? $tracks : null;
        });

        $options = [
            'prerender' => [
                'view' => 'track.index',
                'config' => 'track.top-50'
            ]
        ];

        return $this->success(['tracks' => $tracks], 200, $options);
    }

    /**
     * Get time popular albums should be cached for.
     *
     * @return Carbon
     */
    private function getCacheTime()
    {
        return Carbon::now()->addDays($this->settings->get('cache.homepage_days'));
    }
}
