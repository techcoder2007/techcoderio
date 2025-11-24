interface DisplayProps {
	value: string;
	expression?: string;
}

const Display = ({ value }: DisplayProps) => {
	return (
		<div className="flex h-36 flex-col items-end justify-end overflow-hidden p-4">
			<div className="max-h-full w-full overflow-y-auto break-all text-right text-4xl font-light tracking-wider text-white no-scrollbar">
				{value}
			</div>
		</div>
	);
};

export { Display };
