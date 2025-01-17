/* eslint-disable @next/next/no-img-element */
import Overlay from 'components/UI/Overlay'
import { useEffect, useState } from 'react'
import ImageDetails from 'components/ImageDetails'
import { IImageDetails } from 'types'
import ImageNavigation from './imageNavigation'
import CloseIcon from 'components/icons/CloseIcon'
import { useSwipeable } from 'react-swipeable'

import styles from './imageModalV2.module.css'
import clsx from 'clsx'
import { setImageDetailsModalOpen } from 'store/appStore'
import useLockedBody from 'hooks/useLockedBody'

interface Props {
  disableNav?: boolean
  imageDetails: IImageDetails
  handleClose: () => any
  handleDeleteImageClick?: () => any
  handleLoadNext?: () => any
  handleLoadPrev?: () => any
  handleReloadImageData?: () => any
  onDeleteCallback?: () => any
}

const ImageModalV2 = ({
  disableNav = false,
  handleClose,
  handleDeleteImageClick = () => {},
  handleLoadNext = () => {},
  handleLoadPrev = () => {},
  handleReloadImageData = () => {},
  onDeleteCallback = () => {},
  imageDetails
}: Props) => {
  const [, setLocked] = useLockedBody(false)
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (disableNav) return
      handleLoadNext()
    },
    onSwipedRight: () => {
      if (disableNav) return
      handleLoadPrev()
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 25
  })

  const closeSwipe = useSwipeable({
    onSwipedDown: () => {
      handleClose()
    },
    preventScrollOnSwipe: true,
    swipeDuration: 250,
    trackTouch: true,
    delta: 150
  })

  const [showTiles, setShowTiles] = useState(false)

  const handleTiling = (bool: boolean) => {
    setShowTiles(bool)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showTiles) {
          return
        }

        handleClose()
      }

      if (e.key === 'ArrowLeft') {
        handleLoadPrev()
      }

      if (e.key === 'ArrowRight') {
        handleLoadNext()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleClose, handleLoadNext, handleLoadPrev, showTiles])

  useEffect(() => {
    setLocked(true)
    setImageDetailsModalOpen(true)

    return () => {
      setImageDetailsModalOpen(false)
      setLocked(false)
    }
  })

  return (
    <>
      <Overlay handleClose={handleClose} />
      <div
        id="image-modal"
        className={clsx(
          styles['image-modal'],
          'opacity-100 rounded md:border-[2px] p-2 flex flex-col items-start fixed left-2 md:left-4 right-2 md:right-4 z-[100] max-w-[1600px] m-auto overflow-y-overlay bg-[#f2f2f2] dark:bg-[#222222]'
        )}
        {...handlers}
        style={{ maxWidth: '1280px' }}
      >
        <div
          className="flex flex-row justify-end w-full pr-2 mb-2"
          {...closeSwipe}
        >
          <div className={styles['close-btn']} onClick={handleClose}>
            <CloseIcon size={28} />
          </div>
        </div>
        {!showTiles && !disableNav && (
          <ImageNavigation
            handleLoadNext={handleLoadNext}
            handleLoadPrev={handleLoadPrev}
          />
        )}
        <div
          id="image-details-content"
          className={styles['scrollable-content']}
        >
          <ImageDetails
            handleClose={handleClose}
            handleDeleteImageClick={() => {
              onDeleteCallback()
              handleDeleteImageClick()
            }}
            handleReloadImageData={handleReloadImageData}
            imageDetails={imageDetails}
            isModal={true}
            handleTiling={handleTiling}
          />
        </div>
      </div>
    </>
  )
}

export default ImageModalV2
