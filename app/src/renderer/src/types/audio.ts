export const MUSIC_CATEGORIES = [
  'calm',
  'suspense',
  'fear',
  'action',
  'heroic',
  'sorrow',
  'hope',
  'dark',
  'wonder',
  'silence'
]

export const AMBIENCE_CATEGORIES = [
  'nature',
  'civilized',
  'ruin',
  'indoor',
  'danger',
  'wild',
  'mystic',
  'water',
  'sky',
  'silence'
]

export type MusicCategory = (typeof MUSIC_CATEGORIES)[number]
export type AmbienceCategory = (typeof AMBIENCE_CATEGORIES)[number]
