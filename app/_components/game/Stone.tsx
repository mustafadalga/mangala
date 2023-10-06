import { memo } from "react";

const tailwindActiveBgColors = [
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(165,180,252),rgb(147,197,253)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(165,180,252),rgb(199,210,254)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(253,164,175),rgb(225,29,72)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(254,240,138),rgb(234,179,8)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(253,164,175),rgb(159,18,57)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(253,230,138),rgb(180,83,9)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(254,215,170),rgb(234,88,12)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(249,250,251),rgb(156,163,175)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(99,102,241),rgb(59,130,246)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(99,102,241)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(55,48,163)_70%)]",
]
const tailwindDisableBgColors = [
    "bg-[radial-gradient(circle_at_30%_30%,rgb(99,102,241),rgb(59,130,246)_70%)]",
    // "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(99,102,241)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(129,140,248),rgb(55,48,163)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(253,164,175),rgb(225,29,72)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(254,240,138),rgb(234,179,8)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(74,222,128),rgb(22,163,74)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(45,212,191),rgb(15,118,110)_70%)]",
    "bg-[radial-gradient(circle_at_30%_30%,rgb(34,211,238),rgb(22,78,99)_70%)]"
]
const Stone = ({ hasRight = false, position: { left, top } }: {
    hasRight?: boolean,
    position: {
        left: number,
        top: number
    }
}) => {
    const randomActiveIndex = Math.floor(Math.random() * tailwindActiveBgColors.length);
    const randomDisableIndex = Math.floor(Math.random() * tailwindDisableBgColors.length);
    const randomActiveColor = tailwindActiveBgColors[randomActiveIndex];
    const randomDisableColor = tailwindDisableBgColors[randomDisableIndex];

    const className = hasRight ? randomActiveColor : randomDisableColor

    return (
        <div
            style={{ left: `${left}%`, top: `${top}%` }}
            className={`${className} absolute w-3 h-3  xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 rounded-full border border-solid border-white shadow-[5px_5px_15px_rgba(0,0,0,0.3),inset_2px_2px_5px_rgba(255,255,255,0.1),inset_-2px_-2px_5px_rgba(0,0,0,0.4)]`}></div>
    );
};

export default memo(Stone)