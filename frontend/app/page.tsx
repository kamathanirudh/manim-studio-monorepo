"use client"

import { useState } from "react"
import Header from "@/components/Header"
import SceneManager from "@/components/SceneManager"
import SubmitButton from "@/components/SubmitButton"
import VideoPlayer from "@/components/VideoPlayer"
import LoadingSpinner from "@/components/LoadingSpinner"

export interface Scene {
  id: string
  content: string
}

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>([{ id: "1", content: "" }])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const addScene = () => {
    if (scenes.length < 10) {
      const newScene: Scene = {
        id: (scenes.length + 1).toString(),
        content: "",
      }
      setScenes([...scenes, newScene])
    }
  }

  const removeScene = (id: string) => {
    if (scenes.length > 1) {
      setScenes(scenes.filter((scene) => scene.id !== id))
    }
  }

  const updateScene = (id: string, content: string) => {
    setScenes(scenes.map((scene) => (scene.id === id ? { ...scene, content } : scene)))
  }

  const handleSubmit = async () => {
    const validScenes = scenes.filter((scene) => scene.content.trim())
    if (validScenes.length === 0) return

    setIsGenerating(true)

    // Simulate API call to generate animation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Mock video URL - in real implementation, this would be the generated video
    setGeneratedVideo("/placeholder.svg?height=400&width=600")
    setIsGenerating(false)
    setShowResults(true)
  }

  const createNewAnimation = () => {
    setScenes([{ id: "1", content: "" }])
    setGeneratedVideo(null)
    setShowResults(false)
    setIsGenerating(false)
  }

  const editScenes = () => {
    setShowResults(false)
  }

  const isSubmitDisabled = !scenes.some((scene) => scene.content.trim()) || isGenerating

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  if (showResults && generatedVideo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Header />
          <VideoPlayer
            videoUrl={generatedVideo}
            scenes={scenes.filter((scene) => scene.content.trim())}
            onCreateNew={createNewAnimation}
            onEditScenes={editScenes}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <div className="mt-12 space-y-8">
          <SceneManager scenes={scenes} onAddScene={addScene} onRemoveScene={removeScene} onUpdateScene={updateScene} />

          <SubmitButton
            onSubmit={handleSubmit}
            disabled={isSubmitDisabled}
            sceneCount={scenes.filter((scene) => scene.content.trim()).length}
          />
        </div>
      </div>
    </div>
  )
}
