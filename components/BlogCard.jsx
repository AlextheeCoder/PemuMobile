import { View, Text,FlatList,Image,  ImageBackground,TouchableOpacity,ActivityIndicator } from 'react-native'
import {React,useState} from 'react'
import { router } from 'expo-router';



const BlogCard = ({blogs }) => {
    
  const [loading, setLoading] = useState(true);
  const truncateTitle = (title) => {
    const words = title.split(' ');
    return words.slice(0, 3).join(' ')+ ' ...';
  };

  return (
   <FlatList
    data= {blogs}
    keyExtractor={(item) =>item.id.toString()} 
    renderItem={({item}) => (
        <View className=" border border-slate-600 rounded-xl px-1 mr-3 mt-4" > 
        <TouchableOpacity className="relative flex justify-center items-center mr-5  p-1 rounded-xl " onPress={() => router.push({ pathname: `/blog/${item.slug}`, params: item })}>
                            <Text className="text-sm font-psemibold mb-4 "> {truncateTitle(item.title)}</Text>
                            <ImageBackground
                                source={{ uri: `https://pemuagrifood.com/storage/${item.image}` }}
                                className="w-52 h-40 rounded-[10px] my-5 overflow-hidden "
                                resizeMode="cover"
                                onLoadEnd={() => setLoading(false) }
                            />
                        {loading && <ActivityIndicator  color="#000" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />}
                            
        </TouchableOpacity>
     
        </View>
    
         
   
      
      
   
      
       
    )}
    horizontal
   />
  )
}

export default BlogCard