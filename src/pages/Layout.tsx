import { useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"

export default function Layout() {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searchBar, setSearchBar] = useState<string>("")
    const [artistDetails, setArtistsDetails] = useState<any | null>(null)
    const [topTracks, setTopTracks] = useState<any[]>([])
    const clientId: string = "73e8a21edfc942fb85506fb935a1f252"
    const clientSecret: string = "bbc2dc14882a4580bea1aa54bbdfdb7d"

    useEffect(() => {
        const getAccessToken = async () => {
            const response = await fetch("https://accounts.spotify.com/api/token", {
                method: "POST",
                headers: {
                    "Content-type": "application/x-www-form-urlencoded",
                    "Authorization": "Basic " + btoa(`${clientId}:${clientSecret}`)
                },
                body: new URLSearchParams({
                    grant_type: "client_credentials"
                })
            })

            if(response.ok) {
                const data = await response.json()
                setAccessToken(data.access_token)
                console.log(data)
            } else {
                console.log("Unable to get access token")
            }
        }

        getAccessToken()
        searchSpotify("Kendrick Lamar")
    }, [])

    useEffect(() => {}, [artistDetails, topTracks])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchBar(e.target.value)
    }

    const searchSpotify = async (query: string) => {
        if(!accessToken) {
            console.log("no access token provided")
        }

        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=8`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if(response.ok) {
            const data = await response.json()
            setSearchResults(data.artists.items)
            console.log(data.artists.items)
        } else {
            console.log("error searching for artists on Spotify")
            console.log(response)
        }
    }

    const handleSearchClick = () => {
        searchSpotify(searchBar)
    }

    const handleArtistClick = async (artistId: string) => {
        if(!accessToken) {
            console.log("no access token provided")
        }

        const artistsResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if(artistsResponse.ok) {
            const data = await artistsResponse.json()
            setArtistsDetails(data)
            console.log("artista")
            console.log(data)
        } else {
            console.log("error fetching artist details")
        }

        const topTracksResponse = await fetch(`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        })

        if(topTracksResponse.ok) {
            const data = await topTracksResponse.json()
            setTopTracks(data.tracks)
            console.log("tracks")
            console.log(data.tracks)
        } else {
            console.log("Error fetching top tracks")
        }
    }

    return (
        <div className="h-screen flex">
            {/* Profile */}
            <aside className="bg-neutral-950 h-screen w-1/3" >
                <div className="w-full px-10 py-7 gap-3 flex">
                    <div className="bg-neutral-900 w-full p-4 rounded-2xl">
                        <input className="bg-neutral-800 text-neutral-50 w-full px-3 py-1 mb-2 rounded-full"
                        value={searchBar}
                        onChange={handleSearchChange}
                        placeholder="Type here"
                        type="text"/>
                        {
                            searchResults.map((artist) => (
                                <div key={artist.id} className="m-2 hover:bg-neutral-800 hover:cursor-pointer rounded-md"
                                onClick={() => handleArtistClick(artist.id)}>
                                    <p className="text-neutral-100 text-center">{artist.name}</p>
                                    <p className="text-neutral-500 text-center">Followers: {artist.followers.total}</p>
                                </div>
                            ))
                        }
                    </div>
                    <button className="bg-green-500 h-9 w-11 rounded-full flex justify-center items-center hover:cursor-pointer"
                    onClick={handleSearchClick}><FaSearch /></button>
                </div>
            </aside>
            <main className="bg-neutral-800 h-screen w-2/3">
                {
                    artistDetails && (
                        <img src={artistDetails.images[0]?.url}/>
                    )
                }
            </main>
        </div>
    )
}