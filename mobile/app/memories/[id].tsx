import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'
import { api } from '../../lib/api'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import dayjs from 'dayjs'

interface MemoryData {
  coverUrl: string
  content: string
  createdAt: string
}

export default function Memory() {
  const { top, bottom } = useSafeAreaInsets()
  const [memory, setMemory] = useState<MemoryData | null>(null)
  const [copied, setCopied] = useState(false)

  const params = useLocalSearchParams()
  const { id } = params

  const router = useRouter()

  useEffect(() => {
    async function getMemoryData() {
      const token = await SecureStore.getItemAsync('token')

      const res = await api.get<MemoryData>(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setMemory(res.data)
    }

    getMemoryData()
  }, [id])

  function handleCopyUrlToClipboard() {
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mt-4">
        <TouchableOpacity onPress={router.back} className="flex-row gap-1">
          <Icon name="arrow-left" size={16} color="#9e9ea0" />
          <Text className="text-sm text-gray-200">voltar à timeline</Text>
        </TouchableOpacity>

        <View className="mt-4 flex-1 flex-row items-center justify-between">
          <Text className="items-center gap-2 text-sm text-gray-100">
            {dayjs(memory?.createdAt).format('D[ de ]MMMM[, ]YYYY')}
          </Text>

          <TouchableOpacity
            className="flex-row items-center gap-2"
            onPress={handleCopyUrlToClipboard}
          >
            {copied ? (
              <>
                <Icon name="check-circle" size={16} color="#bebebf" />
                <Text className="font-body text-xs text-gray-100">Copiado</Text>
              </>
            ) : (
              <>
                <Icon name="copy" size={16} color="#bebebf" />
                <Text className="font-body text-xs text-gray-100">
                  Copiar Link
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <Image
          source={{
            uri: memory?.coverUrl,
          }}
          className="mt-4 aspect-video w-full rounded-lg"
          alt=""
        />

        <Text className="mt-4 font-body text-base leading-relaxed text-gray-100">
          {memory?.content}
        </Text>
      </View>
    </ScrollView>
  )
}
