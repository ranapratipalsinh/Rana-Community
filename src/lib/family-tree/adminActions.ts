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
    photo?: File
  }
}

export type AddRelativeResult = { success: true; personId: number } | { success: false; error: string }

async function createMediaFromFile(payload: Awaited<ReturnType<typeof getPayloadClient>>, file: File, alt: string) {
  const arrayBuffer = await file.arrayBuffer()
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data: Buffer.from(arrayBuffer),
      mimetype: file.type || 'application/octet-stream',
      name: file.name || 'upload',
      size: file.size,
    },
  })
  return media.id
}

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

      const photoId =
        input.newPerson.photo && input.newPerson.photo.size > 0
          ? await createMediaFromFile(payload, input.newPerson.photo, input.newPerson.fullName.trim())
          : undefined

      const created = await payload.create({
        collection: 'family-members',
        // fullName is a localized field — the Local API needs an explicit
        // locale or it silently drops the value instead of writing it to
        // the default locale. This was a real bug: every person created
        // through this builder ended up with a blank name.
        locale: 'en',
        data: {
          fullName: input.newPerson.fullName.trim(),
          village: input.villageId,
          generation,
          displayStatus: 'private',
          gender: input.newPerson.gender,
          birthYear: input.newPerson.birthYear,
          deathYear: input.newPerson.deathYear,
          profilePhoto: photoId,
        },
      })
      targetPersonId = created.id
    }

    // Relationships default to draft on a drafts-enabled collection unless
    // explicitly published — unlike a new person (whose name/photo/bio
    // deliberately stays private until reviewed), a relationship only
    // becomes visible once both connected people are already published AND
    // public, so publishing it immediately doesn't bypass that privacy
    // gate. Leaving it as draft here was a real bug: it silently broke the
    // public tree's parent-child structure for anything added through this
    // builder, even when both people were fully public.
    if (input.relationType === 'parent') {
      await payload.create({
        collection: 'family-relationships',
        data: {
          relationshipType: 'parent-child',
          parent: targetPersonId,
          child: input.anchorId,
          _status: 'published',
        },
      })
    } else if (input.relationType === 'child') {
      await payload.create({
        collection: 'family-relationships',
        data: {
          relationshipType: 'parent-child',
          parent: input.anchorId,
          child: targetPersonId,
          _status: 'published',
        },
      })
    } else {
      await payload.create({
        collection: 'family-relationships',
        data: {
          relationshipType: 'spouse',
          spouseA: input.anchorId,
          spouseB: targetPersonId,
          _status: 'published',
        },
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
  photo?: File
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
    const photoId =
      input.photo && input.photo.size > 0
        ? await createMediaFromFile(payload, input.photo, input.fullName.trim())
        : undefined

    const created = await payload.create({
      collection: 'family-members',
      // Same locale requirement as addRelative — see comment there.
      locale: 'en',
      data: {
        fullName: input.fullName.trim(),
        village: input.villageId,
        generation: 1,
        displayStatus: 'private',
        gender: input.gender,
        birthYear: input.birthYear,
        deathYear: input.deathYear,
        profilePhoto: photoId,
      },
    })
    return { success: true, personId: created.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return { success: false, error: message }
  }
}

export type UpdatePersonPhotoResult =
  | { success: true }
  | { success: false; error: string }

export async function updatePersonPhoto(
  personId: number,
  photo: File,
): Promise<UpdatePersonPhotoResult> {
  const payload = await getPayloadClient()
  const { user } = await payload.auth({ headers: await getHeaders() })

  if (!user) {
    return { success: false, error: 'You must be signed in as an admin to do this.' }
  }
  if (!photo || photo.size === 0) {
    return { success: false, error: 'Choose a photo to upload.' }
  }

  try {
    const person = await payload.findByID({ collection: 'family-members', id: personId, depth: 0 })
    const photoId = await createMediaFromFile(
      payload,
      photo,
      typeof person.fullName === 'string' ? person.fullName : 'Family member',
    )
    await payload.update({
      collection: 'family-members',
      id: personId,
      data: { profilePhoto: photoId },
    })
    return { success: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong.'
    return { success: false, error: message }
  }
}
