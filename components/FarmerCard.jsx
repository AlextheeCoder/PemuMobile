import { View, Text , Image, TouchableOpacity} from 'react-native'
import React from 'react'
import {icons} from '../constants'


const FarmerCard = ({action, farmer: {name, phonenumber, users:{username,avatar}}  }) => {
  return (
    <TouchableOpacity onPress={action} >
      <View className="flex-col items-center px-4 mb-14">
              <View className="flex-row gap-3 items-start" >
                  <View className="justify-center items-center flex-row flex-1" > 
                  <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5" >
                      <Image 
                      source={{uri: avatar}}
                      className="w-full h-full rounded-lg"
                      resizeMode='cover'
                      />
                  </View>
                  <View className="justify-center flex-1 ml-3 gap-y-1" > 
                  <Text className="font-psemibold text-sm" > {name} </Text>
                  <Text className="text-xs font-pregular" > Operator: {username} </Text>
                  </View>
                  </View>
                  <View className="pt-2">
                    <Image 
                    source={icons.menu}
                    className="w-5 h-5"
                    resizeMode='contain'
                    />
                  </View>
              </View>
              
            
          </View>
    </TouchableOpacity>
   
   
  )
}

export default FarmerCard