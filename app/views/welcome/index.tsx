import Activities from "~/components/layout/activities";
import { Navbar } from "~/components/navbar";

export default function Welcome() {
	return (
		<div className="min-h-screen bg-cover bg-center bg-no-repeat techcoderio-welcome">
			<Navbar />
			<Activities/>
		</div>
	); 
}
