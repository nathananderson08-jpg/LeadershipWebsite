declare module 'three'

declare module 'vanta/dist/vanta.clouds.min' {
  interface VantaCloudsOptions {
    el: HTMLElement
    THREE: unknown
    mouseControls?: boolean
    touchControls?: boolean
    gyroControls?: boolean
    minHeight?: number
    minWidth?: number
    backgroundColor?: number
    skyColor?: number
    cloudColor?: number
    cloudShadowColor?: number
    sunColor?: number
    sunGlareColor?: number
    sunlightColor?: number
    speed?: number
  }

  interface VantaEffect {
    destroy: () => void
  }

  export default function CLOUDS(options: VantaCloudsOptions): VantaEffect
}

interface Window {
  THREE?: unknown
}
