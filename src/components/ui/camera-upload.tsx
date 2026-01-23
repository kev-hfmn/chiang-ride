'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Upload, X, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface CameraUploadProps {
  onImageUpload: (imageUrl: string) => void
  currentImage?: string
  bucketName?: string
  className?: string
  showFallback?: boolean
  fallbackSrc?: string
}

export function CameraUpload({ 
  onImageUpload, 
  currentImage, 
  bucketName = 'scooter-images',
  className = '',
  showFallback = true,
  fallbackSrc = '/images/scooter-placeholder.jpg'
}: CameraUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage && currentImage.trim() ? currentImage : null)
  const [error, setError] = useState<string | null>(null)
  const [imageError, setImageError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Update preview URL when currentImage prop changes
  useEffect(() => {
    setPreviewUrl(currentImage && currentImage.trim() ? currentImage : null)
    setImageError(false)
  }, [currentImage])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }, [stream])

  const capturePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob(async (blob) => {
      if (!blob) return

      const file = new File([blob], `scooter-${Date.now()}.jpg`, { type: 'image/jpeg' })
      await uploadFile(file)
      stopCamera()
    }, 'image/jpeg', 0.8)
  }, [stopCamera])

  const uploadFile = async (file: File) => {
    setIsUploading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      onImageUpload(publicUrl)
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    uploadFile(file)
  }

  const removeImage = () => {
    setPreviewUrl(null)
    setImageError(false)
    onImageUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const handleImageLoad = () => {
    setImageError(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Camera View */}
      {isCameraActive && (
        <div className="relative bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              type="button"
              onClick={capturePhoto}
              disabled={isUploading}
              className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16"
            >
              <Camera className="w-6 h-6" />
            </Button>
            <Button
              type="button"
              onClick={stopCamera}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-full w-12 h-12"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {previewUrl && !isCameraActive && (
        <div className="relative">
          <div className="relative w-full h-48 rounded-xl border-2 border-gray-200 overflow-hidden bg-gray-100">
            {!imageError ? (
              <img
                src={previewUrl}
                alt="Scooter preview"
                className="w-full h-full object-cover"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            ) : showFallback ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                    <Camera className="w-8 h-8 text-gray-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">No Image</p>
                  <p className="text-xs text-gray-500 text-center px-2">
                    Scooter image not available
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
                <Camera className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center px-4">
                  Image could not be loaded
                </p>
              </div>
            )}
          </div>
          
          <Button
            type="button"
            onClick={removeImage}
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 rounded-full w-8 h-8"
          >
            <X className="w-4 h-4" />
          </Button>
          
          {/* Show current image info */}
          {currentImage && (
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Current Image
            </div>
          )}
        </div>
      )}

      {/* Upload Controls */}
      {!previewUrl && !isCameraActive && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center space-y-4">
          {/* Show current status */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 mb-2">
              {currentImage ? `Current: ${currentImage.substring(0, 50)}...` : 'No current image'}
            </p>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              onClick={startCamera}
              disabled={isUploading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Camera className="w-5 h-5 mr-2" />
              Take Photo
            </Button>
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              variant="outline"
            >
              <Upload className="w-5 h-5 mr-2" />
              Upload File
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Take a photo or upload an image (max 5MB)
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isUploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-600">Uploading image...</p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Hidden Canvas for Photo Capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
