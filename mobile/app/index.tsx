import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { useRouter } from 'expo-router'

import NLWLogo from '../assets/nlw-spacetime-logo.svg'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { api } from '../lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/467bd85326ba311f884d',
}

export default function App() {
  const router = useRouter()

  const [, res, signInWithGithub] = useAuthRequest(
    {
      clientId: '467bd85326ba311f884d',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  async function handleGithubOAuthCode(code: string) {
    const res = await api.post('/register', {
      code,
    })

    const { token } = res.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (res?.type === 'success') {
      const { code } = res.params

      handleGithubOAuthCode(code)
    }
  }, [res])

  return (
    <View className="flex-1 px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>

          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => signInWithGithub()}
          className="rounded-full bg-green-500 px-5 py-2"
        >
          <Text className="font-atl text-sm uppercase text-black">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
