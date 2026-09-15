import React from 'react'
import icons from './icons'
import {getLayoutFromLocalStorage} from '../../layout/core'

type Props = {
  className?: string
  iconType?: 'duotone' | 'solid' | 'outline'
  iconName: string
}

const VivaldiIcon: React.FC<Props> = ({className = '', iconType, iconName}) => {
  if (!iconType) {
    iconType = getLayoutFromLocalStorage().main?.iconType
  }

  return (
    <i className={`ki-${iconType} ki-${iconName}${className && ' ' + className}`}>
      {iconType === 'duotone' &&
        [...Array(icons[iconName])].map((_, i) => {
          return (
            <span
              key={`${iconType}-${iconName}-${className}-path-${i + 1}`}
              className={`path${i + 1}`}
            ></span>
          )
        })}
    </i>
  )
}

// Export as both VivaldiIcon and KTIcon for seamless backward compatibility
export {VivaldiIcon, VivaldiIcon as KTIcon}
