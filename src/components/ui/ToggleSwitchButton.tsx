import { useState } from "react";

function ToggleSwitchButton() {
    const [isOn, setIsOn] = useState(false);

    const toggleSwitch = () => {
        setIsOn(!isOn);
    };

    return (
        <div
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer shadow-md transition-colors duration-300 ${isOn ? "bg-cyan-500" : "bg-gray-700"
                }`}
            onClick={toggleSwitch}
        >
            <div
                className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isOn
                        ? "translate-x-6 bg-cyan-200"
                        : "translate-x-0 bg-gray-600 border border-gray-700"
                    }`}
            ></div>
        </div>
    );
}

export { ToggleSwitchButton };