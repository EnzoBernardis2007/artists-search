import { useEffect, useState } from "react"
import profile from '../assets/profile.jpg'

export default function Layout() {
    const [accessToken, setAccessToken] = useState<string | null>(null)
    const [searchResults, setSearchResults] = useState<any[]>([])
    const [searchBar, setSearchBar] = useState<string>("")
    const [artistDetails, setArtistsDetails] = useState<any | null>(null)
    const [topTracks, setTopTracks] = useState<any[]>([])
    const clientId: string | undefined = import.meta.env.VITE_CLIENT_ID
    const clientSecret: string | undefined = import.meta.env.VITE_CLIENT_SECRET

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
            } else {
                console.log("Unable to get access token")
            }
        }

        getAccessToken()
    }, [])

    useEffect(() => {
        if(searchBar.length > 0) {
            searchSpotify(searchBar)
        } else {
            setArtistsDetails(null)
            setTopTracks([])
            setSearchResults([])
        }
    }, [searchBar])

    useEffect(() => {}, [artistDetails, topTracks])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchBar(e.target.value)
    }

    const searchSpotify = async (query: string) => {
        if(!accessToken) {
            console.log("No access token provided")
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
        } else {
            console.log("Error searching for artists on Spotify")
        }
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
        } else {
            console.log("Error fetching artist details")
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
        } else {
            console.log("Error fetching top tracks")
        }
    }

    return (
        <div className="h-screen flex">
            {/* Profile */}
            <aside className="bg-neutral-950 h-screen w-1/3 z-50" >
                <div className="w-full px-10 py-7 gap-3 flex">
                    <div className="bg-neutral-900 w-full p-4 rounded-2xl">
                        <input className="bg-neutral-800 text-neutral-50 w-full px-3 py-1 mb-2 rounded-full"
                        value={searchBar}
                        onChange={handleSearchChange}
                        placeholder="Type here"
                        type="text"/>
                        {
                            searchResults.length > 0 && searchResults
                            .filter(artist => artist.name.toLowerCase().startsWith(searchBar.toLowerCase()))
                            .sort((a, b) => b.popularity - a.popularity)
                            .map((artist) => (
                                <div 
                                    key={artist.id} 
                                    className="m-2 hover:bg-neutral-800 hover:cursor-pointer rounded-md"
                                    onClick={() => handleArtistClick(artist.id)}
                                >
                                    <p className="text-neutral-100 text-center">{artist.name}</p>
                                    <p className="text-neutral-500 text-center">Followers: {artist.followers.total}</p>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </aside>
            <main className="bg-neutral-900 h-screen w-2/3">
                {
                    artistDetails && (
                        <div className="relative">
                            <img className="w-full h-44 object-cover object-center filter blur-sm"
                            src={artistDetails.images[0]?.url}/>
                            <div className="relative bg-neutral-900 h-full w-full">
                                <img src={artistDetails.images[1] ? artistDetails.images[1]?.url : profile}
                                className="absolute top-[-150px] h-56 w-56 object-center transform left-1/2 -translate-x-1/2 shadow-2xl shadow-black object-cover"/>
                                <div className="h-24"/>
                                <p className="text-center text-2xl mb-3 font-bold text-neutral-50">{artistDetails.name}</p>
                                <div className="w-full gap-2 flex justify-center">
                                    {
                                        artistDetails.genres.map((genre:string, index:number) => (
                                            <p key={index} className="bg-neutral-950 px-3 py-1 text-neutral-50 rounded-full">{genre}</p>
                                        ))
                                    }
                                </div>
                                <div className="px-10 mt-4 gap-4 flex justify-center">
                                    {
                                        topTracks.slice(0, 5).map((track, index) => (
                                            <div key={index} className="bg-neutral-950 max-h-60 max-w-40 w-full flex flex-col rounded-md">
                                                <img src={track.album.images[1]?.url} 
                                                className="max-h-40 rounded-tl-md rounded-tr-md"/>
                                                <div className="h-full p-2 flex flex-col justify-center items-center">
                                                    <p className="text-neutral-50 text-sm text-center">{track.name}</p>
                                                    <p className="text-neutral-400 text-xs text-center">{track.album.release_date}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    )
                }
            </main>
        </div>
    )
}