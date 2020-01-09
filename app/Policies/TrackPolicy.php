<?php

namespace App\Policies;

use App\User;
use App\Track;
use Illuminate\Auth\Access\HandlesAuthorization;
use Log;
class TrackPolicy
{
    use HandlesAuthorization;

    public function index(User $user)
    {
        return $user->hasPermission('tracks.view');
    }

    public function show(User $user, Track $track)
    {
        return $user->hasPermission('tracks.view') && !$track->pending || $track->pending && $user->hasPermission('admin');
    }

    public function store(User $user)
    {
        return $user->hasPermission('tracks.create');
    }

    public function update(User $user, Track $track)
    {
        return $user->hasPermission('tracks.update') && ($track->uploadedBy->id == $user->id || $user->hasPermission('admin'));
    }

    public function destroy(User $user, Track $track)
    {
        return $user->hasPermission('tracks.delete') && ($track->uploadedBy->id == $user->id || $user->hasPermission('admin'));
    }

    public function viewPending(User $user)
    {
        return $user->hasPermission('admin');
    }
}
