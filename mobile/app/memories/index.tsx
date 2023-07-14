import { useEffect, useState } from 'react'
import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { Link, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as SecureStore from 'expo-secure-store'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'

import NLWLogo from '../../assets/nlw-spacetime-logo.svg'
import { api } from '../../lib/api'

dayjs.locale(ptBr)

export interface MemoryData {
  id: string
  coverUrl: string
  isPublic: boolean
  excerpt: string
  createdAt: string
}

export default function Memories() {
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<MemoryData[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')

    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const res = await api.get<MemoryData[]>('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(res.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  async function handleDeleteMemory(memoryId: string) {
    const token = await SecureStore.getItemAsync('token')

    await api.delete(`/memories/${memoryId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(memories.filter((memory) => memory.id !== memoryId))
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>

          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-10 space-y-10">
        {memories.map((memory) => (
          <View className="space-y-4" key={memory.id}>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                </Text>
              </View>
            </View>

            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />

              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>

              <View className="flex-row items-center justify-between">
                <Link href={`/memories/${memory.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color="#9e9ea0" />
                  </TouchableOpacity>
                </Link>

                <View className="flex-row items-center gap-2">
                  <Link href={`/memories/edit/${memory.id}`} asChild>
                    <TouchableOpacity className="flex-row items-center gap-2">
                      <Icon name="edit-2" size={16} color="#9e9ea0" />
                      <Text className="font-body text-sm text-gray-200">
                        Editar
                      </Text>
                    </TouchableOpacity>
                  </Link>

                  <TouchableOpacity
                    className="flex-row items-center gap-2"
                    onPress={() => handleDeleteMemory(memory.id)}
                  >
                    <Icon name="x-circle" size={16} color="#9e9ea0" />
                    <Text className="font-body text-sm text-gray-200">
                      Apagar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}
