import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import PasswordInput from "~/components/core/form/password-input";

const unlockSchema = yup.object({
	password: yup
		.string()
		.required("Password is required")
		.min(8, "Password must be at least 8 characters")
		.matches(
			/^(?=.*[a-zA-Z])(?=.*\d)/,
			"Password must contain at least one letter and one number",
		),
});

type UnlockFormData = yup.InferType<typeof unlockSchema>;

export default function LockScreen() {
	const [showPassword, setShowPassword] = useState(false);
	const [time, setTime] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		reset,
	} = useForm<UnlockFormData>({
		resolver: yupResolver(unlockSchema),
	});

	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			setTime(
				now.toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: true,
				}),
			);
		};
		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	const onSubmit = (data: UnlockFormData) => {
		if (data.password === "password123") {
		} else {
			setError("password", {
				type: "manual",
				message: "Incorrect password",
			});
			reset({ password: "" });
		}
	};

	return (
		<div className="relative w-full h-screen overflow-hidden">
			<div className="absolute inset-0 bg-linear-to-br from-ubuntu-dark via-ubuntu-darker to-black">
				<div className="absolute inset-0 opacity-30 techcoderio-lockscreen" />
			</div>

			<div className="relative h-full flex flex-col items-center justify-center px-4">
				<div className="absolute top-0 left-0 right-0 p-6 flex justify-center items-center text-ubuntu-light text-sm">
					<div className="text-lg font-mono">{time}</div>
				</div>

				<div className="flex flex-col items-center space-y-8">
					<div className="flex flex-col items-center space-y-4">
						<div className="relative">
							<div className="w-24 h-24 rounded-full bg-linear-to-br from-ubuntu-accent to-orange-600 p-0.5">
								<div className="w-full h-full rounded-full bg-ubuntu-darker flex items-center justify-center text-white text-3xl font-bold">
									TC
								</div>
							</div>
							<div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-2 border-ubuntu-darker" />
						</div>

						<div className="text-center">
							<h2 className="text-2xl font-light text-white tracking-wide">
								TechCoder
							</h2>
							<p className="text-ubuntu-light text-xs mt-1">techcoder.io</p>
						</div>
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
						<div className="space-y-4">
							<PasswordInput
								register={register("password")}
								showPassword={showPassword}
								onTogglePassword={() => setShowPassword(!showPassword)}
								error={errors.password?.message}
								autoFocus
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
