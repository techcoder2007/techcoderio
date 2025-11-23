import { forwardRef } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { type UseFormRegisterReturn } from "react-hook-form";

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
					className={`flex items-center space-x-2 px-4 py-3 bg-ubuntu-darker/50 border rounded-lg backdrop-blur-sm transition-colors focus-within:border-ubuntu-accent/50 ${
						error
							? "border-red-400/50 hover:border-red-400/70"
							: "border-ubuntu-light/10 hover:border-ubuntu-light/20"
					}`}
				>
					<Lock className="w-5 h-5 text-ubuntu-light shrink-0" />
					<input
						{...register}
						ref={ref}
						type={showPassword ? "text" : "password"}
						placeholder={placeholder}
						className="flex-1 bg-transparent text-white placeholder-ubuntu-light/50 outline-none text-sm"
						autoFocus={autoFocus}
					/>
					<button
						type="button"
						onClick={onTogglePassword}
						className="text-ubuntu-light hover:text-ubuntu-accent transition-colors"
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
				{error && <p className="text-red-400 text-sm mt-1">{error}</p>}
			</div>
		);
	},
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
