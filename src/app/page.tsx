import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { BoomBox, Headphones, Music, Podcast } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen bg-gradient-to-br from-sky-700 via-blue-900 to-purple-700">
      <Navbar />
      <div className="flex flex-col items-center">
        <Music className="mt-16 text-white animate-bounce" size={100} />
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Discover, Play, Repeat
        </h1>
        <p className="text-white mt-4 text-lg text-center">
          Access millions of songs across all genres<br/> without any interruptions
          or limits.
        </p>
        <Button size={"lg"} className="mt-8 bg-sky-900 text-md">Get Started</Button>
      </div>
      <div className="mt-24">
        <div className="w-full bg-gradient-to-br from-purple-900 via-sky-600 to-purple-900 flex flex-col px-12 py-24">
          <div className="grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center space-y-3 text-center">
              <BoomBox className="h-12 w-12 text-yellow-400 duration-500 hover:scale-125" />
              <h3 className="text-2xl font-bold text-white">Fan Interaction</h3>
              <p className="text-white text-md">Let fans choose the music.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <Podcast className="h-12 w-12 text-green-400 duration-500 hover:scale-125" />
              <h3 className="text-2xl font-bold text-white">Live Streaming</h3>
              <p className="text-white text-md">Stream with real-time input.</p>
            </div>
            <div className="flex flex-col items-center space-y-3 text-center">
              <Headphones className="h-12 w-12 text-sky-300 duration-500 hover:scale-125" />
              <h3 className="text-2xl font-bold text-white">
                High-Quality Audio
              </h3>
              <p className="text-white text-md">Crystal clear sound quality.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
