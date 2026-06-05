const IconHome = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M3 9.5L10 3l7 6.5V17a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
		<path
			d="M7.5 18v-5h5v5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
	</svg>
);

const IconPictures = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<rect
			x="2.5"
			y="4"
			width="15"
			height="12"
			rx="1.5"
			stroke="currentColor"
			strokeWidth="1.5"
		/>
		<circle cx="7" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
		<path
			d="M2.5 13.5l4-4 3 3 2.5-2.5 5 5"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const IconDocuments = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M5 2.5h7l3.5 3.5V17a.5.5 0 01-.5.5H5a.5.5 0 01-.5-.5V3a.5.5 0 01.5-.5z"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
		<path
			d="M12 2.5V6H15.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinejoin="round"
		/>
		<path
			d="M7 9.5h6M7 12.5h4"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
		/>
	</svg>
);

const IconDownloads = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M10 3v10M6.5 9.5L10 13l3.5-3.5"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M3.5 14.5v1A1.5 1.5 0 005 17h10a1.5 1.5 0 001.5-1.5v-1"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

const IconMusic = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M8 15V5l9-2v10"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<circle cx="5.5" cy="15" r="2.5" stroke="currentColor" strokeWidth="1.3" />
		<circle cx="14.5" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.3" />
	</svg>
);

const IconTrash = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M4 6h12M8 6V4.5a.5.5 0 01.5-.5h3a.5.5 0 01.5.5V6"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
		<path
			d="M5.5 6l.8 9.5a.5.5 0 00.5.5h6.4a.5.5 0 00.5-.5L14.5 6"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
		<path
			d="M8.5 9.5v4M11.5 9.5v4"
			stroke="currentColor"
			strokeWidth="1.4"
			strokeLinecap="round"
		/>
	</svg>
);

const IconSearch = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.5" />
		<path
			d="M13 13l4 4"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

const IconGrid = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<rect
			x="3"
			y="3"
			width="6"
			height="6"
			rx="1"
			stroke="currentColor"
			strokeWidth="1.4"
		/>
		<rect
			x="11"
			y="3"
			width="6"
			height="6"
			rx="1"
			stroke="currentColor"
			strokeWidth="1.4"
		/>
		<rect
			x="3"
			y="11"
			width="6"
			height="6"
			rx="1"
			stroke="currentColor"
			strokeWidth="1.4"
		/>
		<rect
			x="11"
			y="11"
			width="6"
			height="6"
			rx="1"
			stroke="currentColor"
			strokeWidth="1.4"
		/>
	</svg>
);

const IconList = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M3 5.5h14M3 10h14M3 14.5h14"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

const IconClose = ({ className }: { className?: string }) => (
	<svg viewBox="0 0 20 20" fill="none" className={className}>
		<path
			d="M5 5l10 10M15 5L5 15"
			stroke="currentColor"
			strokeWidth="1.5"
			strokeLinecap="round"
		/>
	</svg>
);

export {
	IconClose,
	IconDocuments,
	IconDownloads,
	IconGrid,
	IconHome,
	IconList,
	IconMusic,
	IconPictures,
	IconSearch,
	IconTrash,
};
