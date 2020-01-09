@extends('prerender.base')

<?php /** @var App\Services\Meta\MetaTags $meta */ ?>

@section('body')
    <h1 class="title">{{$meta->getTitle()}}</h1>

    {!! $meta->getDescription() !!}
    <br>

    <img src="{{$meta->get('og:image')}}">

    <ul class="tracks">
        @foreach($meta->getData('track.album.tracks') as $track)
            <li>
                <figure>
                    <img src="{{$track['album']['image']}}">
                    <figcaption>
                        <a href="{{$meta->urls->track($track)}}">{{$track['name']}}</a> by
                        <a href="{{$meta->urls->artist($track['album']['artist'])}}">{{$track['album']['artist']['name']}}</a>
                    </figcaption>
                </figure>
            </li>
        @endforeach
    </ul>
@endsection