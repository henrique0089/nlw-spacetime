import { prisma } from '../config/prisma'

interface MemoryProps {
  id: string
  content: string
  coverUrl: string
  isPublic: boolean
  userId: string | null
}

interface UpdateMemoryProps {
  memoryId: string
  content: string
  coverUrl: string
  isPublic: boolean
}

export class Memory {
  private props: MemoryProps

  private constructor(props: MemoryProps) {
    this.props = props
  }

  public get id(): string {
    return this.props.id
  }

  public get content(): string {
    return this.props.content
  }

  public get coverUrl(): string {
    return this.props.coverUrl
  }

  public get isPublic(): boolean {
    return this.props.isPublic
  }

  public get userId(): string | null {
    return this.props.userId
  }

  static async findAll(userId: string) {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        userId,
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

  static async findOne(memoryId: string) {
    const memory = await prisma.memory.findFirstOrThrow({
      where: {
        id: memoryId,
      },
    })

    return new Memory({
      id: memory.id,
      content: memory.content,
      coverUrl: memory.coverUrl,
      isPublic: memory.isPublic,
      userId: memory.userId,
    })
  }

  static async create(data: MemoryProps) {
    await prisma.memory.create({
      data: {
        id: data.id,
        content: data.content,
        coverUrl: data.coverUrl,
        isPublic: data.isPublic,
        userId: data.userId,
      },
    })

    return new Memory(data)
  }

  static async update(data: UpdateMemoryProps) {
    const memory = await prisma.memory.update({
      where: {
        id: data.memoryId,
      },
      data: {
        content: data.content,
        coverUrl: data.coverUrl,
        isPublic: data.isPublic,
      },
    })

    return new Memory({
      id: memory.id,
      content: memory.content,
      coverUrl: memory.coverUrl,
      isPublic: memory.isPublic,
      userId: memory.userId,
    })
  }
}
