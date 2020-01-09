<?php namespace App\Http\Controllers;

use App;
use App\Genre;
use Cache;
use Carbon\Carbon;
use App\Services\Providers\ProviderResolver;
use Common\Core\Controller;
use Common\Settings\Settings;
use Illuminate\Http\JsonResponse;

class PopularGenreController extends Controller
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
        $this->authorize('index', Genre::class);

        $genres = Cache::remember('genres.popular', $this->getCacheTime(), function() {
            $genres = $this->resolver->get('genres')->getGenres();
            return ! empty($genres) ? $genres : null;
        });

        $options = [
            'prerender' => [
                'view' => 'genre.index',
                'config' => 'genre.popular'
            ]
        ];

        return $this->success(['genres' => $genres], 200, $options);
    }

    /**
     * @return Carbon
     */
    private function getCacheTime()
    {
        return Carbon::now()->addDays($this->settings->get('cache.homepage_days'));
    }
}