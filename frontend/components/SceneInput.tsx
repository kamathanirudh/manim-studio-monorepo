"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { Scene } from "@/app/page"

interface SceneInputProps {
  scene: Scene
  sceneNumber: number
  onUpdate: (id: string, content: string) => void
  onRemove: (id: string) => void
  canRemove: boolean
}

const placeholders = [
  "Show a graph of sin(x) and highlight its maxima",
  "Animate the transformation of a circle into an ellipse",
  "Display the Pythagorean theorem with a visual proof",
  "Create a 3D plot of z = x² + y²",
  "Show the derivative of x² as the slope of the tangent line",
  "Animate the convergence of a geometric series",
  "Display a matrix multiplication step by step",
  "Show the unit circle and trigonometric functions",
  "Animate the solution to a quadratic equation",
  "Create a visualization of the Fibonacci sequence",
]

export default function SceneInput({ scene, sceneNumber, onUpdate, onRemove, canRemove }: SceneInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  const placeholder = placeholders[(sceneNumber - 1) % placeholders.length]

  return (
    <div className="relative">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-20 pt-4">
          <span className="inline-flex items-center justify-center w-16 h-8 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
            Scene {sceneNumber}
          </span>
        </div>

        <div className="flex-1 relative">
          <textarea
            value={scene.content}
            onChange={(e) => onUpdate(scene.id, e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full min-h-[120px] p-4 border-2 rounded-xl resize-none transition-all duration-200 focus:outline-none ${
              isFocused
                ? "border-blue-400 bg-white shadow-lg"
                : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
            }`}
            style={{
              height: Math.max(120, scene.content.split("\n").length * 24 + 80),
            }}
          />

          {scene.content && (
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">{scene.content.length} characters</div>
          )}
        </div>

        {canRemove && (
          <button
            onClick={() => onRemove(scene.id)}
            className="flex-shrink-0 w-8 h-8 mt-4 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
            aria-label={`Remove scene ${sceneNumber}`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
