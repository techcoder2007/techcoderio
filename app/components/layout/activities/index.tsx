import { Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/core/input-group";

export default function Activities() {
    return (
        <div>
            <InputGroup>
                <InputGroupInput placeholder="Search..." />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
            </InputGroup>		
        </div>
    );
}