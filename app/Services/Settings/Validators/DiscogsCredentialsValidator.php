<?php

namespace App\Services\Settings\Validators;

use Illuminate\Support\Arr;
use App\Services\HttpClient;
use GuzzleHttp\Exception\ClientException;
use Common\Settings\Validators\SettingsValidator;

class DiscogsCredentialsValidator implements SettingsValidator
{
    const KEYS = ['discogs_id', 'discogs_secret'];
    private $httpClient;

    public function __construct()
    {
        $this->httpClient = new HttpClient(
            ['base_uri' => 'https://api.discogs.com/database/search', 'exceptions' => true]
        );
    }

    public function fails($values)
    {
        $key = Arr::get($values, 'discogs_id', config('common.site.discogs.id'));
        $secret = Arr::get($values, 'discogs_secret', config('common.site.discogs.secret'));

        try {
            $this->httpClient->get("?q=foo&type=artist&secret=$secret&key=$key");
        } catch (ClientException $e) {
            $errResponse = json_decode($e->getResponse()->getBody()->getContents(), true);
            return $this->getMessage($errResponse);
        }
    }

    /**
     * @param array $errResponse
     * @return array
     */
    private function getMessage($errResponse)
    {
        return ['discogs_group' => 'Invalid discogs key or secret, please double check them.'];
    }
}
