<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $guarded = ['id'];

    /**
     * The attributes that should be casted to native types.
     *
     * @var array
     */
    protected $casts = [
        'id'       => 'integer',
        'track_id' => 'integer',
        'content' => 'string',
        'type' => 'integer',
        'viewed' => 'boolean',
    ];

    protected $dates = [
        'created_at'
    ];

    public function track() {
        return $this->belongsTo(Track::class);
    }
}
