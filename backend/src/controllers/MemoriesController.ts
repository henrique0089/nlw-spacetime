import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { prisma } from '../config/prisma'
import { Memory } from '../models/Memory'

export class MemoriesController {
  async getAllMemories(req: FastifyRequest) {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        userId: req.user.sub,
      },
    })

    return memories.map((memory) => {
      return {
        id: memory.id,
        coverUrl: memory.coverUrl,
        excerpt: memory.content.substring(0, 115).concat('...'),
        createdAt: memory.createdAt,
      }
    })
  }

  async getMemory(req: FastifyRequest, rep: FastifyReply) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(req.params)

    const memory = await Memory.findOne(id)

    if (!memory.isPublic) {
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
