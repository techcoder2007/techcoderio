interface VSCodeProps {
	id: string;
}

const VSCode = (_props: VSCodeProps) => {
	return (
		<div className="flex flex-col h-full">
			<div className="grow">
				<iframe
					src="https://github1s.com/sakilk130/ubuntu-portfolio/blob/HEAD/components/ubuntu/index.tsx"
					frameBorder="0"
					title="VsCode"
					className="w-full h-full bg-ub-cool-grey"
				></iframe>
			</div>
		</div>
	);
};

export { VSCode };
