import React, {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import {WithChildren} from '@/utils'

const VivaldiSplashScreenContext = createContext<Dispatch<SetStateAction<number>> | undefined>(
  undefined
)

const VivaldiSplashScreenProvider: FC<WithChildren> = ({children}) => {
  const [count, setCount] = useState(0)
  let visible = count > 0

  useEffect(() => {
    if (visible) {
      document.body.classList.add('page-loading')
    } else {
      document.body.classList.remove('page-loading')
    }
  }, [visible])

  return (
    <VivaldiSplashScreenContext.Provider value={setCount}>
      {children}
    </VivaldiSplashScreenContext.Provider>
  )
}

const LayoutSplashScreen: FC<{visible?: boolean}> = ({visible = true}) => {
  // Everything are ready - remove splashscreen
  const setCount = useContext(VivaldiSplashScreenContext)

  useEffect(() => {
    if (!visible) {
      return
    }

    if (setCount) {
      setCount((prev) => {
        return prev + 1
      })
    }

    return () => {
      if (setCount) {
        setCount((prev) => {
          return prev - 1
        })
      }
    }
  }, [setCount, visible])

  return null
}

export {
  VivaldiSplashScreenProvider,
  LayoutSplashScreen,
}
