import {StyleSheet, Text, View,Image, FlatList, RefreshControl, Modal, ActivityIndicator, TouchableOpacity} from 'react-native'
import { React,useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from  '../../constants'
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { getAllFarmers} from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import FarmerCard from '../../components/FarmerCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Link,Redirect,router } from 'expo-router';


const Allfarmers = () => {

  const {data: farmers, refetch,loading} = useAppwrite(getAllFarmers);

  const {user,setUser, setIsLogged} = useGlobalContext();
 
  const [refreshing, setrefreshing] = useState(false);
  const userID= user.$id;
  const onRefresh = async () => {
    setrefreshing(true);
    await refetch();
    setrefreshing(false);
  }
  



  return (
    <SafeAreaView  className="min-h-[85vh] bg-white" >
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <FlatList 
      
      data={farmers}
      keyExtractor={(item) => item.$id}

      renderItem={({item}) => (
        <FarmerCard
        farmer={item}
        action={() => router.push({
          pathname: `/farmer/${item.$id}`,
          params: { ...item, userID }
        })}
      />

      )}
      ListHeaderComponent={() =>
        (
          <View className="my-6 px-4">
                 <View className="-mt-6 mb-8">
                         <Text className="text-xl font-pregular"  >All Registerd Farmers</Text>
                 </View>
            
          </View>
        )
       }
       ListEmptyComponent={() => (
        <EmptyState 
        title="No farmer found"
        subtitle="Add a farmer to get started"
        />
       )}


           
           />
  
    </SafeAreaView>
  )
}

export default Allfarmers