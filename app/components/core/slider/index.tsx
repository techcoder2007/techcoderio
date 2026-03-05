import type { HTMLProps } from "react";

interface SliderProps extends HTMLProps<HTMLInputElement> {}

const Slider = (props: SliderProps) => {
	return (
		<input
			type="range"
			min={0}
			max={100}
			{...props}
			className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
		/>
	);
};

export { Slider };
