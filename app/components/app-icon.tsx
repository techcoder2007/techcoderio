import {
	Calculator,
	Code2,
	Globe,
	type LucideProps,
	Music2,
	Terminal,
} from "lucide-react";
import type { AppIconName } from "~/redux/features/all-apps-slice";

interface AppIconProps extends LucideProps {
	name: AppIconName;
}

const AppIcon = ({ name, ...props }: AppIconProps) => {
	const iconMap = {
		chrome: Globe,
		calculator: Calculator,
		code: Code2,
		terminal: Terminal,
		spotify: Music2,
	};

	const Icon = iconMap[name];
	return <Icon {...props} />;
};

export { AppIcon };
