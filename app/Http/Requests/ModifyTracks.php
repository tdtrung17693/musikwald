<?php namespace App\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use Common\Core\BaseFormRequest;

class ModifyTracks extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        $trackId = $this->route('id');
        $albumName = $this->request->get('album_name', '');

        $rules = [
            'name' => [
                'required', 'string', 'min:1', 'max:255',
                Rule::unique('tracks')->where(function(Builder $query) use($albumName) {
                    $query->where('album_name', $albumName);
                })->ignore($trackId)
            ],
            'number'             => 'nullable|min:1',
            'album_name'         => 'nullable|min:1|max:255',
            'duration'           => 'required|integer|min:1',
            'artists'            => 'nullable',
            'spotify_popularity' => 'min:1|max:100|nullable',
            'album_id'           => 'nullable|min:1|exists:albums,id',
            'url'                => 'required'
        ];

        return $rules;
    }
}
