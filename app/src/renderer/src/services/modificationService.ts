import { Modification } from '../store/modificationsSlice'

export const saveModifications = async (
  sessionId: string,
  modifications: Modification[]
): Promise<void> => {
  await window.api.saveModifications(sessionId, modifications)
}

export const loadModifications = async (sessionId: string): Promise<Modification[]> => {
  return (await window.api.loadModifications(sessionId)) as Modification[]
}
