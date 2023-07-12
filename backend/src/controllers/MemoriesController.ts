import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { Memory } from '../models/Memory'

export class MemoriesController {
  async getAllMemories(req: FastifyRequest) {
    const memories = await Memory.findAll(req.user.sub)

    return memories
  }

  async getMemoryByDate(req: FastifyRequest) {
    const querySchema = z.object({
      createdAt: z.coerce.date(),
    })

    const { createdAt } = querySchema.parse(req.query)

    const memory = await Memory.findOneByDate(req.user.sub, createdAt)

    if (memory.id === '') {
      throw new Error('Memory not found!')
    }

    return memory
  }

  async getMemory(req: FastifyRequest, rep: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await Memory.findOne(id)

    if (!memory.isPublic && memory.userId !== req.user.sub) {
      return rep.status(401).send()
    }

    return {
      id: memory.id,
      coverUrl: memory.coverUrl,
      content: memory.content,
      isPublic: memory.isPublic,
      createdAt: memory.createdAt,
    }
  }

  async createMemory(req: FastifyRequest) {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

    await Memory.create({
      content,
      coverUrl,
      isPublic,
      userId: req.user.sub,
    })
  }

  async updateMemory(req: FastifyRequest, rep: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string(),
      isPublic: z.coerce.boolean().default(false),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(req.body)

    const memory = await Memory.findOne(id)

    if (memory.userId !== req.user.sub) {
      return rep.status(401).send()
    }

    await Memory.update({
      memoryId: id,
      content,
      coverUrl,
      isPublic,
    })
  }

  async deleteMemory(req: FastifyRequest, rep: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await Memory.findOne(id)

    if (memory.id === '') {
      return rep.status(404).send()
    }

    if (memory.userId !== req.user.sub) {
      return rep.status(401).send()
    }

    await Memory.delete(id)
  }
}
