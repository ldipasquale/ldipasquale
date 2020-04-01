import { useEffect } from 'react'

export default function useCamera(videoRef, chromaRef) {
  useEffect(() => {
    const video = videoRef.current
    const chroma = chromaRef.current

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream

        video.addEventListener('loadeddata', () => {
          chroma.width = video.videoWidth
          chroma.height = video.videoHeight
        })
      })
  }, [videoRef, chromaRef])
}
