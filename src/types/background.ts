export interface BackgroundTint {
  r: number
  g: number
  b: number
  a: number
}

export interface BackgroundInfo {
  mapIndex: number
  imagePath: string
  tint: BackgroundTint
}
