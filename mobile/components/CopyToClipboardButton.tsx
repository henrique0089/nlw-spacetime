import { Text, TouchableOpacity } from 'react-native'
import Icon from '@expo/vector-icons/Feather'

interface CopyToClipboardButtonProps {
  copied: boolean
  onCopy: () => void
}

export function CopyToClipboardButton({
  copied,
  onCopy,
}: CopyToClipboardButtonProps) {
  return (
    <TouchableOpacity
      className="mr-8 flex-row items-center gap-2"
      onPress={() => onCopy()}
    >
      {copied ? (
        <>
          <Icon name="check-circle" size={16} color="#bebebf" />
          <Text className="font-body text-xs text-gray-100">Copiado</Text>
        </>
      ) : (
        <>
          <Icon name="copy" size={16} color="#bebebf" />
          <Text className="font-body text-xs text-gray-100">Copiar Link</Text>
        </>
      )}
    </TouchableOpacity>
  )
}
