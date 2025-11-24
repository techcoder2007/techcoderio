import { forwardRef } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { type UseFormRegisterReturn } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";

interface PasswordInputProps {
	register: UseFormRegisterReturn;
	showPassword: boolean;
	onTogglePassword: () => void;
	placeholder?: string;
	error?: string;
	autoFocus?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	(
		{
			register,
			showPassword,
			onTogglePassword,
			placeholder = "Enter password",
			error,
			autoFocus,
		},
		ref,
	) => {
		return (
			<div className="relative">
				<div
					className={`flex items-center space-x-2 px-4 py-3 bg-darker/50 border-2 rounded-lg backdrop-blur-sm transition-colors focus-within:border-accent/50 ${
						error
							? "border-red-400/50 hover:border-red-400/70"
							: "border-white/10 hover:border-white/20"
					}`}
				>
					<Lock className="w-5 h-5 text-white shrink-0" />
					<input
						{...register}
						ref={ref}
						type={showPassword ? "text" : "password"}
						placeholder={placeholder}
						className="flex-1 bg-transparent text-white placeholder-white/50 outline-none text-sm"
						autoFocus={autoFocus}
					/>
					<button
						type="button"
						onClick={onTogglePassword}
						className="text-white hover:text-accent transition-colors cursor-pointer"
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
				<AnimatePresence>
					{error && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className="text-red-400 text-xs mt-1"
						>
							{error}
						</motion.p>
					)}
				</AnimatePresence>
			</div>
		);
	},
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
