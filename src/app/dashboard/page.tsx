"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, PlayIcon } from "lucide-react"
import Image from "next/image"

type Video = {
  id: string
  title: string
  votes: number
}

export default function Component() {
  const [videos, setVideos] = useState<Video[]>([
    { id: "dQw4w9WgXcQ", title: "Rick Astley - Never Gonna Give You Up", votes: 5 },
    { id: "9bZkp7q19f0", title: "PSY - GANGNAM STYLE", votes: 3 },
    { id: "JGwWNGJdvx8", title: "Ed Sheeran - Shape of You", votes: 2 },
  ])
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null)
  const [newVideoUrl, setNewVideoUrl] = useState("")
  const [previewVideo, setPreviewVideo] = useState<Video | null>(null)


  useEffect(() => {
    if (!currentVideo && videos.length > 0) {
        const playNextVideo = () => {
            if (videos.length > 0) {
              setCurrentVideo(videos[0])
              setVideos(videos.slice(1))
            }
          }
          playNextVideo()
    }
  }, [videos, currentVideo])

  const handleVote = (id: string, increment: number) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, votes: video.votes + increment } : video
    ).sort((a, b) => b.votes - a.votes))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (previewVideo) {
      setVideos([...videos, { ...previewVideo, votes: 0 }])
      setNewVideoUrl("")
      setPreviewVideo(null)
    }
  }



  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setNewVideoUrl(url)
    const videoId = getYouTubeId(url)
    if (videoId) {
      // In a real application, you would fetch the video title from YouTube API
      setPreviewVideo({ id: videoId, title: "New Video", votes: 0 })
    } else {
      setPreviewVideo(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 text-white">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center pt-8">Stream Video Voting</h1>
        
        {currentVideo && (
          <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-100">Now Playing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${currentVideo.id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-4 text-xl text-blue-100">{currentVideo.title}</p>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-100">Add a Video</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Paste YouTube URL"
                value={newVideoUrl}
                onChange={handleUrlChange}
                className="bg-white/20 border-none text-blue-100 placeholder-blue-300"
              />
              {previewVideo && (
                <div className="aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${previewVideo.id}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={!previewVideo}>
                Add to Queue
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card className="mb-8 bg-white/10 backdrop-blur-lg border-none">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-100">Video Queue</CardTitle>
          </CardHeader>
          <CardContent>
            {videos.map((video) => (
              <div key={video.id} className="flex items-center justify-between mb-4 p-3 bg-blue-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image
                    src={`https://img.youtube.com/vi/${video.id}/default.jpg`}
                    width={40}
                    height={30}
                    alt={video.title}
                    className="w-20 h-15 object-cover rounded"
                  />
                  <p className="font-semibold text-blue-100">{video.title}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-blue-200">{video.votes}</span>
                  <Button size="icon" variant="outline" onClick={() => handleVote(video.id, 1)} className="border-blue-400 text-blue-200 hover:bg-blue-700/50">
                    <ArrowUpIcon className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => handleVote(video.id, -1)} className="border-blue-400 text-blue-200 hover:bg-blue-700/50">
                    <ArrowDownIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {videos.length === 0 && <p className="text-center text-blue-300">No videos in the queue</p>}
          </CardContent>
        </Card>
        
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={videos.length === 0}>
          <PlayIcon className="mr-2 h-4 w-4" /> Play Next Video
        </Button>
      </div>
    </div>
  )
}