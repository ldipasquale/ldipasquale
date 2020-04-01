import React, { useState, useRef } from 'react'
import cx from 'classnames'

import { Slider, Switch, Select, MenuItem } from '@material-ui/core'

import Colors from 'constants/colors'

import useCamera from './useCamera'
import pushChroma from './chroma'
import backgrounds from './backgrounds'

import styles from './styles.module.sass'

const colorLabels = {
  [Colors.RED]: 'Red',
  [Colors.GREEN]: 'Green',
  [Colors.BLUE]: 'Blue',
}

let chromaInterval

export default () => { 
  const videoRef = useRef(null)
  const chromaRef = useRef(null)

  useCamera(videoRef, chromaRef)

  const [isEnabled, handleSetEnabled] = useState(false)
  const [backgroundUrl, handleChangeBackgroundUrl] = useState(backgrounds[0].url)

  const [colorValues, handleChangeColorValues] = useState({
    [Colors.RED]: 220,
    [Colors.GREEN]: 230,
    [Colors.BLUE]: 130,
  })

  function handleToggle() {
    const video = videoRef.current
    const chroma = chromaRef.current

    if (isEnabled) {
      clearInterval(chromaInterval)

      return handleSetEnabled(false)
    }

    chromaInterval = setInterval(() => pushChroma(video, chroma, colorValues), 50)

    return handleSetEnabled(true)
  }

  function renderColorSlider(colorKey) {
    return (
      <div
        key={colorKey}
        className={cx([
          styles.colorSetting,
          styles[`${colorKey}ColorSetting`],
        ])}
      >
        <div className={styles.label}>{colorLabels[colorKey]}</div>

        <Slider
          orientation="vertical"
          min={0}
          max={255}
          value={colorValues[colorKey]}
          disabled={isEnabled}
          onChange={(e, value) => handleChangeColorValues({
            ...colorValues,
            [colorKey]: value,
          })}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Switch
        className={styles.toggleButton}
        checked={isEnabled}
        onChange={() => handleToggle(!isEnabled)}
      />

      <div className={styles.content}>
        <div className={styles.settings}>
          {renderColorSlider(Colors.RED)}
          {renderColorSlider(Colors.GREEN)}
          {renderColorSlider(Colors.BLUE)}
        </div>

        <div className={styles.media}>
          <video
            className={cx({
              [styles.video]: true,
              [styles.highlightedVideo]: !isEnabled,
            })}
            ref={videoRef}
            autoPlay
          />

          <canvas
            className={styles.chroma}
            style={{
              backgroundImage: `url(${backgroundUrl})`,
            }}
            ref={chromaRef}
          />
        </div>
      </div>

      <Select
        id="backgroundSelector"
        className={styles.backgroundSelector}
        value={backgroundUrl}
        onChange={event => handleChangeBackgroundUrl(event.target.value)}
      >
        {backgrounds.map(bg => (
          <MenuItem key={bg.url} value={bg.url}>{bg.label}</MenuItem>
        ))}
      </Select>
    </div>
  )
}
