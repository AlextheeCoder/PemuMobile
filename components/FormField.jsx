import { View, Text, TextInput, Touchable, TouchableOpacity,Image } from 'react-native'
import {React, useState}from 'react'
import {icons} from '../constants'

const FormField = ({title,value,placeholder,keyboardType,handleChangeText,TextStyles, MoreStyles,otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)

  return (
    <View className={`space-y-2 ${otherStyles}`} >
      <Text className={`text-base font-pmedium ${TextStyles}`} >{title}</Text>
      <View className= {`border-2 border-gray-300 w-full h-16 px-4 bg-white rounded-2xl focus:border-primary items-center flex-row ${MoreStyles}`} >
        <TextInput 
        className="flex-1 text-black font-psemibold text-base"
        value={value}
        keyboardType={keyboardType || 'default'}
        placeholder={placeholder}
        placeholderTextColor="#000"
        onChangeText={handleChangeText}
        secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image source={!showPassword ? icons.eye : icons.eyeHide} className="w-6 h-6" resizeMode='contain'  />
            </TouchableOpacity>
        )}
    </View>
    </View>

  
  )
}

export default FormField