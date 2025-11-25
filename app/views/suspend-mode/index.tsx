import { format } from "date-fns";
import { motion } from "framer-motion";

export default function SuspendMode() {
	return (
		<motion.div
			key="locked"
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 1.1 }}
			className="flex flex-col items-center space-y-6"
		>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className="text-center"
			>
				<h1 className="text-4xl font-light text-white mb-4">
					{format(new Date(), "h:mm")}
				</h1>
				<p className="text-white text-lg">
					Click anywhere or press a key to unlock
				</p>
			</motion.div>
		</motion.div>
	);
}
