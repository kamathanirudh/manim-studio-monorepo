"use client"

import { Download, Edit, RotateCcw, Play, Pause, Maximize } from "lucide-react"
import { useState } from "react"
import type { Scene } from "@/app/page"

interface VideoPlayerProps {
  videoUrl: string
  scenes: Scene[]
  onCreateNew: () => void
  onEditScenes: () => void
}

export default function VideoPlayer({ videoUrl, scenes, onCreateNew, onEditScenes }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Your Animation is Ready!</h2>
        <p className="text-gray-600">
          Generated from {scenes.length} scene{scenes.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Video Player */}
      <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="aspect-video bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          {/* Mock video placeholder */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <Play className="w-12 h-12 text-white ml-1" />
            </div>
            <p className="text-white text-lg">Mathematical Animation Preview</p>
            <p className="text-white/70 text-sm">Click play to view your generated animation</p>
          </div>
        </div>

        {/* Video Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white ml-0.5" />}
              </button>
              <div className="text-white text-sm">0:00 / 0:30</div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center transition-colors">
                <Download className="w-4 h-4 text-white" />
              </button>
              <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded flex items-center justify-center transition-colors">
                <Maximize className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2 w-full bg-white/20 rounded-full h-1">
            <div className="bg-blue-500 h-1 rounded-full w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Scene Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scene Breakdown</h3>
        <div className="space-y-3">
          {scenes.map((scene, index) => (
            <div key={scene.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-medium">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-relaxed">{scene.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onCreateNew}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Create New Animation</span>
        </button>

        <button
          onClick={onEditScenes}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
        >
          <Edit className="w-5 h-5" />
          <span>Edit Scenes</span>
        </button>
      </div>
    </div>
  )
}
