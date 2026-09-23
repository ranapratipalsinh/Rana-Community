'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Maximize2, Minimize2, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react'

const MIN_SCALE = 1
const MAX_SCALE = 4
const STEP = 0.5

function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  scale: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={onZoomOut}
        disabled={scale <= MIN_SCALE}
        aria-label="Zoom out"
        className="border border-gold/30 p-2 text-gold transition-colors hover:border-gold disabled:opacity-30"
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        onClick={onZoomIn}
        disabled={scale >= MAX_SCALE}
        aria-label="Zoom in"
        className="border border-gold/30 p-2 text-gold transition-colors hover:border-gold disabled:opacity-30"
      >
        <ZoomIn size={16} />
      </button>
      <button
        type="button"
        onClick={onReset}
        aria-label="Reset zoom"
        className="border border-gold/30 p-2 text-gold transition-colors hover:border-gold"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  )
}

export function FamilyTreeImageViewer({
  url,
  alt,
}: {
  url: string
  alt: string
}) {
  const [scale, setScale] = useState(1)
  const [fullscreen, setFullscreen] = useState(false)
  const [fsScale, setFsScale] = useState(1)

  return (
    <>
      <div className="border border-gold/25 bg-ink-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold/15 px-4 py-2.5">
          <ZoomControls
            scale={scale}
            onZoomIn={() => setScale((s) => Math.min(MAX_SCALE, s + STEP))}
            onZoomOut={() => setScale((s) => Math.max(MIN_SCALE, s - STEP))}
            onReset={() => setScale(1)}
          />
          <button
            type="button"
            onClick={() => {
              setFsScale(1)
              setFullscreen(true)
            }}
            className="inline-flex items-center gap-1.5 border border-gold/30 px-3 py-2 text-xs font-medium uppercase tracking-wide text-gold transition-colors hover:border-gold"
          >
            <Maximize2 size={14} />
            Full Screen
          </button>
        </div>

        <div
          className="relative flex max-h-[75vh] w-full items-center justify-center overflow-auto bg-[#09110e] p-4"
          style={{ touchAction: 'pinch-zoom' }}
        >
          <div
            className="relative mx-auto w-full max-w-3xl transition-transform duration-200 ease-out"
            style={{ transform: `scale(${scale})`, transformOrigin: 'center top' }}
          >
            <Image
              src={url}
              alt={alt}
              width={1600}
              height={2000}
              sizes="(min-width: 1024px) 768px, 100vw"
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {fullscreen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
          <div className="flex items-center justify-between gap-3 border-b border-gold/20 px-4 py-3">
            <ZoomControls
              scale={fsScale}
              onZoomIn={() => setFsScale((s) => Math.min(MAX_SCALE, s + STEP))}
              onZoomOut={() => setFsScale((s) => Math.max(MIN_SCALE, s - STEP))}
              onReset={() => setFsScale(1)}
            />
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Close full screen"
              className="border border-gold/30 p-2 text-gold transition-colors hover:border-gold"
            >
              <X size={18} />
            </button>
          </div>
          <div
            className="relative flex-1 overflow-auto p-4"
            style={{ touchAction: 'pinch-zoom' }}
          >
            <div
              className="relative mx-auto w-full max-w-4xl transition-transform duration-200 ease-out"
              style={{ transform: `scale(${fsScale})`, transformOrigin: 'center top' }}
            >
              <Image
                src={url}
                alt={alt}
                width={1600}
                height={2000}
                sizes="100vw"
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
          <p className="flex items-center justify-center gap-1.5 border-t border-gold/20 py-2 text-xs text-gold/50">
            <Minimize2 size={12} />
            Pinch to zoom on mobile, or use the controls above
          </p>
        </div>
      ) : null}
    </>
  )
}
