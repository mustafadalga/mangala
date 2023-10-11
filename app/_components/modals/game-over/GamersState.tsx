import { GamerState } from "./ModalGameOver";

interface Props {
    winnerDisplayName: string,
    gamersState: GamerState[]
}

export default function GamersState({ winnerDisplayName, gamersState }: Props) {
    return (
        <div className="mt-10 grid gap-5">
            <div>
                <span className="text-base lg:text-lg xl:text-xl text-gray-900">{winnerDisplayName}</span>
            </div>
            <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead
                        className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">

                        </th>
                        <th scope="col" className="px-6 py-3">
                            Gamers
                        </th>
                        <th scope="col" className="px-6 py-3 text-right">
                            Treasure Stones
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {gamersState.map((gamer,index) => (
                        <tr key={gamer.displayName} className="bg-white text-xs sm:text-sm ">
                            <td className="px-6 py-4">
                                {index+1}
                            </td>
                            <td className="px-6 py-4">
                                {gamer.displayName}
                            </td>
                            <td className="px-6 py-4 text-right">
                                {gamer.totalTreasure}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};