'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Camera, Upload, X, RotateCcw, Crop, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { createAdminClient } from '@/lib/supabase/admin'

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
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')
  const [showCropModal, setShowCropModal] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cropCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  // Update preview URL when currentImage prop changes
  useEffect(() => {
    setPreviewUrl(currentImage && currentImage.trim() ? currentImage : null)
    setImageError(false)
  }, [currentImage])

  // Check camera permissions on component mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'camera' as PermissionName }).then((result) => {
        setCameraPermission(result.state as 'granted' | 'denied' | 'prompt')
      }).catch(() => {
        setCameraPermission('unknown')
      })
    }
  }, [])

  const startCamera = useCallback(async () => {
    try {
      setError(null)
      setIsCameraActive(false) // Reset state first
      
      // Request camera permission explicitly with better constraints
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 }
        },
        audio: false
      })
      
      if (videoRef.current && mediaStream) {
        // Set up video element properly
        const video = videoRef.current
        video.srcObject = mediaStream
        
        // Wait for video to be ready before showing interface
        const handleCanPlay = () => {
          console.log('Video can play, showing camera interface')
          setStream(mediaStream)
          setIsCameraActive(true)
          setCameraPermission('granted')
          video.removeEventListener('canplay', handleCanPlay)
        }
        
        video.addEventListener('canplay', handleCanPlay)
        
        // Start playing the video
        try {
          await video.play()
        } catch (playError) {
          console.warn('Video play failed, but continuing:', playError)
          // Sometimes autoplay fails but the stream still works
          handleCanPlay()
        }
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err)
      
      if (err.name === 'NotAllowedError') {
        setCameraPermission('denied')
        setError('Camera access denied. Please allow camera permissions in your browser settings and try again.')
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.')
      } else if (err.name === 'NotSupportedError') {
        setError('Camera not supported in this browser.')
      } else {
        setError(`Unable to access camera: ${err.message}. Please check permissions and try again.`)
      }
      setIsCameraActive(false)
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
      // Validate file before processing
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file')
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        throw new Error('Image file is too large. Please select an image smaller than 10MB.')
      }

      // Resize and compress image before uploading
      const resizedFile = await resizeImage(file, 1200, 800)
      
      // Log compression results
      const compressionRatio = Math.round((1 - resizedFile.size / file.size) * 100)
      console.log(`Image optimized: ${(file.size / 1024).toFixed(1)}KB → ${(resizedFile.size / 1024).toFixed(1)}KB (${compressionRatio}% reduction)`)
      
      const supabase = createClient()
      
      // Generate unique filename with .jpg extension
      const fileName = `scooter_${Math.random().toString(36).substring(2)}_${Date.now()}.jpg`
      const filePath = `${fileName}`

      // Upload optimized image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, resizedFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/jpeg'
        })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath)

      // Update preview and notify parent component
      setPreviewUrl(publicUrl)
      onImageUpload(publicUrl)
      
      // Show success message with compression info
      if (compressionRatio > 0) {
        console.log(`✅ Upload successful! File size reduced by ${compressionRatio}%`)
      }
      
    } catch (err: any) {
      console.error('Upload error:', err)
      
      // Provide user-friendly error messages
      if (err.message.includes('policy')) {
        setError('Permission denied. Please make sure you are logged in and try again.')
      } else if (err.message.includes('size')) {
        setError('File is too large. Please select a smaller image.')
      } else if (err.message.includes('network')) {
        setError('Network error. Please check your connection and try again.')
      } else {
        setError(err.message || 'Failed to upload image. Please try again.')
      }
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

  // Advanced image resizing and compression function
  const resizeImage = (file: File, maxWidth: number = 1200, maxHeight: number = 800): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        
        // Only resize if image is larger than target
        if (ratio < 1) {
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Enable image smoothing for better quality
        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Draw and resize image
          ctx.drawImage(img, 0, 0, width, height)
        }

        // Dynamic quality based on file size and dimensions
        let quality = 0.8 // Default quality
        
        // Higher compression for larger images
        if (file.size > 2 * 1024 * 1024) { // > 2MB
          quality = 0.6
        } else if (file.size > 1 * 1024 * 1024) { // > 1MB
          quality = 0.7
        } else if (file.size < 500 * 1024) { // < 500KB
          quality = 0.9 // Less compression for smaller files
        }

        // Adjust quality based on dimensions
        const totalPixels = width * height
        if (totalPixels > 1000000) { // > 1MP
          quality = Math.max(0.5, quality - 0.1)
        }

        console.log(`Compressing image: ${width}x${height}, quality: ${quality}`)

        // Convert to blob with dynamic quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], `compressed_${Date.now()}.jpg`, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(resizedFile)
            } else {
              resolve(file) // Fallback to original file
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => {
        console.error('Failed to load image for resizing')
        resolve(file) // Fallback to original file
      }

      img.src = URL.createObjectURL(file)
    })
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
          
          {/* Landscape mode guidance */}
          <div className="absolute top-4 left-4 right-4 bg-black/50 text-white text-xs px-3 py-2 rounded-lg flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            <span>Hold your phone horizontally (landscape) for best results</span>
          </div>
          
          {/* Camera controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <Button
              type="button"
              onClick={capturePhoto}
              disabled={isUploading}
              className="bg-white text-black hover:bg-gray-100 rounded-full w-16 h-16 shadow-lg"
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
          {/* Camera permission status */}
          {cameraPermission === 'denied' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">Camera Access Denied</p>
              </div>
              <p className="text-xs text-red-500 mt-1">
                Please enable camera permissions in your browser settings to take photos.
              </p>
            </div>
          )}
          
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
              disabled={isUploading || cameraPermission === 'denied'}
              className="bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
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
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Take a photo or upload an image (max 5MB)
            </p>
            <p className="text-xs text-gray-400">
              📱 For best results, hold your phone horizontally when taking photos
            </p>
          </div>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div className="text-sm text-blue-600">
              <p className="font-medium">Processing image...</p>
              <p className="text-xs text-blue-500">Optimizing size and quality</p>
            </div>
          </div>
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
