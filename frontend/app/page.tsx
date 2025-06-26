"use client"

import { useState } from "react"
import Header from "@/components/Header"
import SceneManager from "@/components/SceneManager"
import SubmitButton from "@/components/SubmitButton"
import VideoPlayer from "@/components/VideoPlayer"
import LoadingSpinner from "@/components/LoadingSpinner"
import { apiService, Scene, Animation } from "@/lib/api"

export default function Home() {
  const [scenes, setScenes] = useState<Scene[]>([{ id: "1", content: "" }])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)

    try {
      // Create animation with backend - send scenes as strings
      const animationData = {
        title: `Animation ${new Date().toLocaleString()}`,
        scenes: validScenes.map(scene => scene.content) // Send just the content strings
      }

      const animation = await apiService.createAnimation(animationData)
      
      // Poll for completion
      let currentAnimation = animation
      const maxAttempts = 60 // 5 minutes with 5-second intervals
      let attempts = 0

      while (currentAnimation.status === 'pending' || currentAnimation.status === 'processing') {
        if (attempts >= maxAttempts) {
          throw new Error('Animation generation timed out')
        }

        await new Promise(resolve => setTimeout(resolve, 5000)) // Wait 5 seconds
        currentAnimation = await apiService.getAnimation(animation.id)
        attempts++
      }

      if (currentAnimation.status === 'completed' && currentAnimation.videoPath) {
        // Construct the proper video URL for embedding
        const videoUrl = `http://localhost:3001/animations/${currentAnimation.id}/video`
        setGeneratedVideo(videoUrl)
        setShowResults(true)
      } else if (currentAnimation.status === 'failed') {
        throw new Error('Animation generation failed')
      } else {
        throw new Error('Animation generation did not complete successfully')
      }

    } catch (err) {
      console.error('Error generating animation:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate animation')
    } finally {
      setIsGenerating(false)
    }
  }

  const createNewAnimation = () => {
    setScenes([{ id: "1", content: "" }])
    setGeneratedVideo(null)
    setShowResults(false)
    setIsGenerating(false)
    setError(null)
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

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
