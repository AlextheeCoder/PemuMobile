import { View, Text,FlatList,Image,  ImageBackground,TouchableOpacity,ActivityIndicator } from 'react-native'
import {React,useState} from 'react'
import { router } from 'expo-router';



const LatestVisitCard = ({visits,action }) => {
    
  const [loading, setLoading] = useState(true);

  return (
   <FlatList
    data= {visits}
    keyExtractor={(item) => item.$id} 
    renderItem={({item}) => (
   
        <TouchableOpacity className="relative flex justify-center items-center mr-5  p-1 rounded-xl"   onPress={() => router.push({ pathname: `/visit/${item.farmerID.$id}`, params: item })}>
           <Text className="text-sm font-pbold -mb-4 text-secondary-100" > {item.farmerID.name}  </Text>
           <ImageBackground
            source={{
              uri: item.picture1,
            }}
            className="w-52 h-40 rounded-[10px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
            onLoadEnd={() => setLoading(false) }
          />
       {loading && <ActivityIndicator  color="#000" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />}

        </TouchableOpacity>
      
   
      
       
    )}
    horizontal
   />
  )
}

export default LatestVisitCard