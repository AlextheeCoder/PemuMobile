import { View, Text, TextInput, Touchable, TouchableOpacity,Image } from 'react-native'
import {React, useState}from 'react'
import {icons} from '../constants'

const FormField = ({
  title,
  value,
  editable,
  placeholder,
  keyboardType,
  handleChangeText,
  TextStyles,
  MoreStyles,
  otherStyles,
  showPlaceholderOnly,  // New prop to control visibility of value
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className={`text-base font-pmedium ${TextStyles}`}>{title}</Text>
      <View
        className={`border-2 border-gray-400 w-full h-14 px-4 bg-white focus:border-primary rounded-lg items-center flex-row ${MoreStyles}`}
      >
        <TextInput
          className="flex-1 text-black font-pregular text-base h-full"
          value={showPlaceholderOnly ? '' : value}  // Show placeholder only
          keyboardType={keyboardType || 'default'}
          placeholder={placeholder}
          placeholderTextColor="#000"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          editable={editable !== undefined ? editable : true}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;