<?php namespace App;

use Common\Auth\BaseUser;
use App\Traits\FormatsPermissions;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * App\User
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Playlist[] $playlists
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Track[] $tracks
 */
class User extends BaseUser
{
    use Notifiable, FormatsPermissions;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['followers_count', 'display_name', 'has_password'];

    protected $with = [];

    public function followedUsers()
    {
        return $this->belongsToMany('App\User', 'follows', 'follower_id', 'followed_id');
    }

    public function followers()
    {
        return $this->belongsToMany('App\User', 'follows', 'followed_id', 'follower_id');
    }

    public function getFollowersCountAttribute()
    {
        return $this->followers()->count();
    }

    /**
     * Many to many relationship with track model.
     *
     * @return BelongsToMany
     */
    public function tracks()
    {
        return $this->belongsToMany('App\Track')->withTimestamps();
    }

    public function uploaded_tracks()
    {
        return $this->hasMany('App\Track', 'uploaded_by');
    }

    /**
     * Many to many relationship with user model.
     *
     * @return BelongsToMany
     */
    public function playlists()
    {
        return $this->belongsToMany('App\Playlist')->withPivot('owner');
    }
}
