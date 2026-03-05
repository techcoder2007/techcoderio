export default function Playground() {
	return (
		<div className="  relative bottom-25 md:bottom-0 w-[100px] md:w-[140px] h-[241px]  overflow-hidden">
			<div className=" w-[140px] h-[241px] bg-black rounded-full flex justify-center items-center ">
				<div
					className=" rounded-full border-transparent border-4 gap-16 flex flex-col"
					id="process-circle"
				>
					<div className="bg-[#B5ED3D] w-14 h-14 rounded-full flex justify-center items-center relative z-10">
						<img
							src="/logo/fast-flow-black.svg"
							alt="Логотип"
							className="w-12 h-12"
						/>
					</div>

					<div className="bg-[#5846FB] w-14 h-14 rounded-full flex justify-center items-center relative z-10">
						<img src="ai.svg" alt="Логотип" className="w-10 h-10" />
					</div>
				</div>
			</div>
		</div>
	);
}
