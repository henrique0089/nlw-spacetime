import { FastifyInstance } from 'fastify'
import { MemoriesController } from '../controllers/MemoriesController'

const memoriesController = new MemoriesController()

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (req) => {
    await req.jwtVerify()
  })

  app.get('/memories', memoriesController.getAllMemories)
  app.get('/memories/:id', memoriesController.getMemory)
  app.post('/memories', memoriesController.createMemory)
  app.put('/memories/:id', memoriesController.updateMemory)
  app.delete('/memories/:id', memoriesController.deleteMemory)
}
