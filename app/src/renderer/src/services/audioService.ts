import { MusicCategory, AmbienceCategory } from '../types/audio'

class AudioService {
  private musicAudio: HTMLAudioElement | null = null
  private ambienceAudio: HTMLAudioElement | null = null
  private currentMusicTrack: number = 1
  private currentAmbienceTrack: number = 1
  private readonly MAX_TRACKS = 5 // Adjust this based on your maximum track number

  private getNextTrackNumber(current: number): number {
    return current >= this.MAX_TRACKS ? 1 : current + 1
  }

  private formatTrackNumber(num: number): string {
    return num.toString().padStart(3, '0')
  }

  playMusic(category: MusicCategory, volume: number): void {
    console.log(`attempting to play ${category}`)

    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio = null
    }

    const trackNumber = this.formatTrackNumber(this.currentMusicTrack)
    this.musicAudio = new Audio(`/sounds/music/${category}/${trackNumber}.mp3`)
    this.musicAudio.volume = volume
    this.musicAudio.loop = false

    this.musicAudio.onended = () => {
      if (this.currentMusicTrack < this.MAX_TRACKS) {
        this.currentMusicTrack = this.getNextTrackNumber(this.currentMusicTrack)
        this.playMusic(category, volume)
      } else {
        this.stopMusic()
      }
    }

    this.musicAudio.play().catch(console.error)
  }

  playAmbience(category: AmbienceCategory, volume: number): void {
    console.log(`attempting to play ${category}`)

    if (this.ambienceAudio) {
      this.ambienceAudio.pause()
      this.ambienceAudio = null
    }

    const trackNumber = this.formatTrackNumber(this.currentAmbienceTrack)
    this.ambienceAudio = new Audio(`/sounds/ambience/${category}/${trackNumber}.mp3`)
    this.ambienceAudio.volume = volume
    this.ambienceAudio.loop = false

    this.ambienceAudio.onended = () => {
      if (this.currentAmbienceTrack < this.MAX_TRACKS) {
        this.currentAmbienceTrack = this.getNextTrackNumber(this.currentAmbienceTrack)
        this.playAmbience(category, volume)
      } else {
        this.stopAmbience()
      }
    }

    this.ambienceAudio.play().catch(console.error)
  }

  setMusicVolume(volume: number): void {
    if (this.musicAudio) {
      this.musicAudio.volume = volume
    }
  }

  setAmbienceVolume(volume: number): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.volume = volume
    }
  }

  stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause()
      this.musicAudio = null
    }
    this.currentMusicTrack = 1
  }

  stopAmbience(): void {
    if (this.ambienceAudio) {
      this.ambienceAudio.pause()
      this.ambienceAudio = null
    }
    this.currentAmbienceTrack = 1
  }
}

export const audioService = new AudioService()
