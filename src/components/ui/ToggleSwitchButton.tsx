import { useState } from "react";

function ToggleSwitchButton() {
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };

    return (
        <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer shadow-sm transition-colors duration-300 ${isOn ? "bg-primary" : "bg-slate-300"
                }`}
            onClick={toggleSwitch}
        >
            <div
                className={`w-6 h-6 rounded-full shadow-sm transform transition-transform duration-300 ${isOn
                        ? "translate-x-6 bg-white"
                        : "translate-x-0 bg-white border border-slate-300"
                    }`}
            ></div>
        </div>
    );
}

export { ToggleSwitchButton };