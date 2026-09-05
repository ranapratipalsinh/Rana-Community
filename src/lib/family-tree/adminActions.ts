'use server'

import { headers as getHeaders } from 'next/headers'

import { getPayloadClient } from '@/lib/payload'

export type AddRelativeInput = {
  villageId: number
  anchorId: number
  anchorGeneration: number
  relationType: 'parent' | 'spouse' | 'child'
  mode: 'new' | 'existing'
  existingPersonId?: number
  newPerson?: {
    fullName: string
    gender?: 'male' | 'female' | 'other'
    birthYear?: number
    deathYear?: number
  }
}

export type AddRelativeResult = { success: true; personId: number } | { success: false; error: string }

export async function addRelative(input: AddRelativeInput): Promise<AddRelativeResult> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    return { success: false, error: 'You must be signed in as an admin to do this.' }
  }

  try {
    let targetPersonId: number

    if (input.mode === 'existing') {
      if (!input.existingPersonId) {
        return { success: false, error: 'Choose an existing person to link.' }
      }
      targetPersonId = input.existingPersonId
    } else {
      if (!input.newPerson?.fullName?.trim()) {
        return { success: false, error: 'Name is required.' }
      }

      const generation =
        input.relationType === 'parent'
          ? input.anchorGeneration - 1
          : input.relationType === 'child'
            ? input.anchorGeneration + 1
            : input.anchorGeneration

      const created = await payload.create({
        collection: 'family-members',
        data: {
          fullName: input.newPerson.fullName.trim(),
          village: input.villageId,
          generation,
          displayStatus: 'private',
          gender: input.newPerson.gender,
          birthYear: input.newPerson.birthYear,
          deathYear: input.newPerson.deathYear,
        },
      })
      targetPersonId = created.id
    }

    if (input.relationType === 'parent') {
      await payload.create({
        collection: 'family-relationships',
        data: { relationshipType: 'parent-child', parent: targetPersonId, child: input.anchorId },
      })
    } else if (input.relationType === 'child') {
      await payload.create({
        collection: 'family-relationships',
        data: { relationshipType: 'parent-child', parent: input.anchorId, child: targetPersonId },
      })
    } else {
      await payload.create({
        collection: 'family-relationships',
        data: { relationshipType: 'spouse', spouseA: input.anchorId, spouseB: targetPersonId },
      })
    }

    return { success: true, personId: targetPersonId }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return { success: false, error: message }
  }
}

export type CreateFirstPersonInput = {
  villageId: number
  fullName: string
  gender?: 'male' | 'female' | 'other'
  birthYear?: number
  deathYear?: number
}

export async function createFirstPerson(
  input: CreateFirstPersonInput,
): Promise<AddRelativeResult> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    return { success: false, error: 'You must be signed in as an admin to do this.' }
  }
  if (!input.fullName.trim()) {
    return { success: false, error: 'Name is required.' }
  }

  try {
    const created = await payload.create({
      collection: 'family-members',
      data: {
        fullName: input.fullName.trim(),
        village: input.villageId,
        generation: 1,
        displayStatus: 'private',
        gender: input.gender,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
      },
    })
    return { success: true, personId: created.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return { success: false, error: message }
  }
}
