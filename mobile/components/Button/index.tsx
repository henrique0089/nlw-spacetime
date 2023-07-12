import React from 'react'
import { Alert, Text, TouchableOpacity } from 'react-native'

export function Button() {
  return (
    <TouchableOpacity
      onPress={() => Alert.alert('escreva o seu nome!')}
      className="w-30 h-10 bg-purple-700"
    >
      <Text className="font-bold text-white">Button</Text>
    </TouchableOpacity>
  )
}
