import Link from "next/link";
import IconClipBoard from "@/_components/icons/IconClipBoard";
import { useCallback, useState } from "react";

export default function ClipBoardURL({ roomID }: { roomID: string}) {
    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/room/${roomID}`;
    const [ copied, setCopied ] = useState(false);
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(url as string);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [ url ])
    return (
        <>
            <hr/>
            <div className="relative flex items-center py-5 text-xs lg:text-sm gap-3 truncate">
                <span className="font-semibold">Room Url :</span>
                <Link href={`/room/${roomID}`} className="text-blue-500 truncate w-2/3">{url}</Link>
                <IconClipBoard
                    onClick={handleCopy}
                    className={`w-4 h-4 lg:w-6 lg:h-6 cursor-pointer ${copied ? 'text-green-500' : 'text-purple-500'}`}
                />
                {copied && (
                    <span className="absolute right-0 top-0 ml-4 text-green-500 text-xs">Copied!</span>
                )}
            </div>
        </>
    );
};