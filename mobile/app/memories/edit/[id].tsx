import { useEffect, useState } from 'react'
import {
  Switch,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
} from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import * as SecureStore from 'expo-secure-store'

import NLWLogo from '../../../assets/nlw-spacetime-logo.svg'
import { api } from '../../../lib/api'

interface MemoryData {
  coverUrl: string
  content: string
  isPublic: boolean
  createdAt: string
}

export default function UpdateMemory() {
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()

  const [preview, setPreview] = useState<string | null>(null)

  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

  const params = useLocalSearchParams()
  const { id } = params

  useEffect(() => {
    async function getMemoryData() {
      const token = await SecureStore.getItemAsync('token')

      const res = await api.get<MemoryData>(`/memories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setIsPublic(res.data.isPublic)
      setPreview(res.data.coverUrl)
      setContent(res.data.content)
    }

    getMemoryData()
  }, [id])

  async function openImagePicker() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) {
        setPreview(result.assets[0].uri)
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function handleUpdateMemory() {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        uri: preview,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.put(
      `/memories/${id}`,
      {
        content,
        isPublic,
        coverUrl,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    router.push('/memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />

          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openImagePicker}
          className="h-32 items-center justify-center rounded-lg border border-gray-500 bg-black/20"
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              alt=""
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          multiline
          className="p-0 font-body text-lg text-gray-50"
          textAlignVertical="top"
          value={content}
          onChangeText={setContent}
          placeholderTextColor="#56565a"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="mb-5 items-center rounded-full bg-green-500 px-5 py-2"
          onPress={handleUpdateMemory}
        >
          <Text className="font-atl text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
