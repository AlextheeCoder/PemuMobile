import { View, Text, TextInput, Touchable, TouchableOpacity,Image, Alert } from 'react-native'
import {React, useState}from 'react'
import {icons} from '../constants'
import { usePathname,router } from 'expo-router'

const SearchInput = ({initialQuery}) => {
    const pathname = usePathname();
    const [query, setquery] = useState(initialQuery || '');

  return (
    
      <View className="border-2 border-white w-full h-16 px-4 bg-slate-100 rounded-full focus:border-primary items-center flex-row space-x-4" >
        <TextInput 
        className="text-base mt-0.5 flex-1 font-pregular"
        value={query}
        placeholder="Search For A Farmer"
        placeholderTextColor="#000"
        onChangeText={(e) => setquery(e)}
        />
     <TouchableOpacity 
     onPress={() => {
      if (!query) {
        return Alert.alert('Please enter a search query')

      }
      if (pathname === '/search') {
        router.setParams({query});
      }
      else router.push(`/search/${query}`)
    }}
>
      
        <Image 
        source={icons.find}
        className="w-5 h-5"
        resizeMode='contain'/>
     </TouchableOpacity>
    </View>
  

  
  )
}

export default SearchInput