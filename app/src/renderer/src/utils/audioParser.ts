import {
  MusicCategory,
  AmbienceCategory,
  MUSIC_CATEGORIES,
  AMBIENCE_CATEGORIES
} from '../types/audio'

interface AudioTags {
  music: MusicCategory | null
  ambience: AmbienceCategory | null
}

const isValidMusicCategory = (category: string): category is MusicCategory => {
  return MUSIC_CATEGORIES.includes(category as MusicCategory)
}

const isValidAmbienceCategory = (category: string): category is AmbienceCategory => {
  return AMBIENCE_CATEGORIES.some((cat) => cat === category)
}

export const parseAudioTags = (content: string): AudioTags => {
  const musicMatch = content.match(/\[MUSIC:([^\]]+)\]/)
  const ambienceMatch = content.match(/\[AMBIENCE:([^\]]+)\]/)
  const musicCategory = musicMatch ? musicMatch[1].trim().toLowerCase() : null
  const ambienceCategory = ambienceMatch ? ambienceMatch[1].trim().toLowerCase() : null
  return {
    music: musicCategory && isValidMusicCategory(musicCategory) ? musicCategory : null,
    ambience: ambienceCategory && isValidAmbienceCategory(ambienceCategory) ? ambienceCategory : null
  }
}
