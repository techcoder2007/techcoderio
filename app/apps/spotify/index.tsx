const playlistId = import.meta.env.VITE_PUBLIC_SPOTIFY_PLAYLIST_ID;

const Spotify = () => {
	return (
		<iframe
			src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
			frameBorder="0"
			title="Spotify"
			className="bg-ub-cool-grey h-full w-full"
		></iframe>
	);
};

export { Spotify };
