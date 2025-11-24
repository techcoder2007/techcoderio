import { yupResolver } from "@hookform/resolvers/yup";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PasswordInput from "~/components/core/form/password-input";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftIcon } from "lucide-react";

const unlockSchema = yup.object({
	password: yup.string().required("Password is required"),
});

type UnlockFormData = yup.InferType<typeof unlockSchema>;

function LockScreenForm({
	onSubmit,
	onReturn,
}: {
	onSubmit: (data: UnlockFormData) => void;
	onReturn: () => void;
}) {
	const [showPassword, setShowPassword] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<UnlockFormData>({
		resolver: yupResolver(unlockSchema),
		mode: "onChange",
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			className="flex flex-col items-center space-y-8"
		>
			<div className="flex flex-col items-center space-y-4">
				<div className="relative">
					<div className="w-24 h-24 rounded-full bg-linear-to-br from-ubuntu-accent to-blue-600 p-0.5">
						<div className="w-full h-full rounded-full bg-blue-800 flex items-center justify-center text-white text-3xl font-bold">
							TC
						</div>
					</div>
					<div className="absolute bottom-0 right-0 w-6 h-6 bg-blue-400 rounded-full border-2 border-blue-800" />
				</div>

				<div className="text-center">
					<h2 className="text-2xl font-light text-white tracking-wide">
						Tech<span className="text-blue-300 font-bold">Coder</span>
					</h2>
					<p className="text-white text-xs mt-1">techcoder.io</p>
				</div>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
				<div className="space-y-4 flex items-center gap-4">
					<button
						onClick={onReturn}
						type="button"
						className="p-2 text-white border border-blue-700 transition-colors cursor-pointer hover:bg-blue-600 rounded-full"
					>
						<ArrowLeftIcon size={17} />
					</button>
					<PasswordInput
						register={register("password")}
						showPassword={showPassword}
						onTogglePassword={() => setShowPassword(!showPassword)}
						error={errors.password?.message}
						autoFocus
					/>
				</div>
			</form>
		</motion.div>
	);
}

export default function LockScreen() {
	const [isUnlocked, setIsUnlocked] = useState(false);

	useEffect(() => {
		const handleUnlock = () => {
			if (!isUnlocked) {
				setIsUnlocked(true);
			}
		};

		document.addEventListener("click", handleUnlock);
		document.addEventListener("keydown", handleUnlock);

		return () => {
			document.removeEventListener("click", handleUnlock);
			document.removeEventListener("keydown", handleUnlock);
		};
	}, [isUnlocked]);

	const handleFormSubmit = (values: UnlockFormData) => {
		console.log("Password submitted:", values.password);
	};

	const handleReturn = () => {
		setIsUnlocked(false);
	};

	return (
		<div className="relative w-full h-screen overflow-hidden">
			<div className="absolute inset-0 techcoderio-lockscreen bg-cover bg-center bg-no-repeat blur-lg scale-105" />

			<div className="relative h-full flex flex-col items-center justify-center">
				<AnimatePresence mode="wait">
					{!isUnlocked ? (
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
					) : (
						<motion.div
							key="unlocked"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="w-full"
						>
							<LockScreenForm onSubmit={handleFormSubmit} onReturn={handleReturn} />
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
