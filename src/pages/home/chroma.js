import Colors from 'constants/colors'

export default function pushChroma(video, chroma, colorValues) {
  const context = chroma.getContext('2d')
  const { width, height } = chroma

  context.drawImage(video, 0, 0, width, height)

  const imageData = context.getImageData(0, 0, width, height)

  const dataLength = imageData.data.length / 4

  for (let i = 0; i < dataLength; i++) {
    const offset = i * 4

    const red = imageData.data[offset + 0]
    const green = imageData.data[offset + 1]
    const blue = imageData.data[offset + 2]

     if (
       (blue < 255 && blue > colorValues[Colors.BLUE]) ||
       (red < 255 && red > colorValues[Colors.RED]) ||
       (green < 255 && green > colorValues[Colors.GREEN])
       // || (red == green && red == blue)
     ) {
       imageData.data[offset + 3] = 0
     }
  }

  context.putImageData(imageData, 0, 0)
}

