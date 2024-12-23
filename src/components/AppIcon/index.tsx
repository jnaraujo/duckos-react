import { useRef, useState } from "react"
import { useDragControls } from "framer-motion"
import { useClickAway } from "react-use"
import { motion } from "framer-motion"
import clsx from "clsx"

import { IAppIconProps } from "./types"
import { useIconsStore } from "../../stores/iconsStore"

export default function AppIcon({
  onDoubleClick,
  id,
  defaultPosition,
  isDraggable,
  title,
  width = 60,
  height = 60,
  icon,
}: IAppIconProps) {
  const updatePos = useIconsStore((state) => state.updatePos)
  const [showAppBg, setShowAppBg] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const controls = useDragControls()

  const onClickContent = () => {
    const isDoubleClick = clickCount === 1

    if (isDoubleClick) {
      onDoubleClick?.()
    }

    const timeout = setTimeout(() => {
      setClickCount(0)
    }, 300)

    setClickCount((prev) => {
      if (prev === 1) {
        setShowAppBg(false)
        return 0
      }
      setShowAppBg(true)
      return 1
    })

    return () => clearTimeout(timeout)
  }

  useClickAway(ref, () => {
    setClickCount(0)
    setShowAppBg(false)
  })

  return (
    <>
      <motion.div
        drag={isDraggable}
        initial={defaultPosition}
        dragControls={controls}
        dragMomentum={false}
        onDrag={() => {
          const rawCoords = ref.current?.style.transform.match(
            /^translateX\((.+)px\) translateY\((.+)px\) translateZ/,
          )

          if (!rawCoords) return

          const coords = {
            x: parseInt(rawCoords[1], 10),
            y: parseInt(rawCoords[2], 10),
          }
          updatePos(id, coords)
        }}
        ref={ref}
        onClickCapture={onClickContent}
        className={clsx(
          "flex h-fit w-fit flex-col items-center justify-center p-2",
          {
            "bg-black": showAppBg,
          },
        )}
      >
        <div
          style={{
            width: width * 0.8,
            height: width * 0.8,
            backgroundImage: `url(${icon})`,
          }}
          className={clsx(`bg-contain bg-center bg-no-repeat`)}
        />
        <strong
          style={{ width: width * 1.2 }}
          className={clsx("break-words text-center text-sm", {
            "text-white": showAppBg,
            "text-black": !showAppBg,
          })}
        >
          {title}
        </strong>
      </motion.div>
    </>
  )
}
