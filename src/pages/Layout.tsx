import { FaSearch } from "react-icons/fa"

export default function Layout() {
    const suggestionsData: string[] = [
        "Maçã",
        "Banana",
        "Laranja",
        "Morango",
        "Abacaxi",
        "Uva",
        "Pera",
        "Melancia",
        "Kiwi",
        "Manga"
    ]

    return (
        <div className="h-screen">
            {/* Profile */}
            <aside className="bg-neutral-950 h-screen w-1/3" >
                <div className="w-full px-10 py-7 gap-3 flex">
                    <div className="bg-neutral-900 w-full p-4 rounded-2xl">
                        <input className="bg-neutral-800 text-neutral-50 w-full px-3 py-1 mb-2 rounded-full"
                        type="text"/>
                        {
                            suggestionsData.map((suggestion) => (
                                <p className="text-neutral-100 text-center">{suggestion}</p>
                            ))
                        }
                    </div>
                    <button className="bg-green-500 h-9 w-11 rounded-full flex justify-center items-center hover:cursor-pointer"><FaSearch /></button>
                </div>
            </aside>
        </div>
    )
}