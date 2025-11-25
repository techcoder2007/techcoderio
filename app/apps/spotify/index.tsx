const Spotify = () => {
	return (
		<iframe
			src={`https://open.spotify.com/embed/playlist/${process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID}?utm_source=generator`}
			frameBorder="0"
			title="Spotify"
			className="bg-ub-cool-grey h-full w-full"
		></iframe>
	);
};

export { Spotify };
