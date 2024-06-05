import {ScrollView, StyleSheet, Text, View,Image, FlatList, RefreshControl, Modal,ActivityIndicator  } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { React,useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import searchInput from  '../../components/SearchInput'
import {images} from  '../../constants'
import SearchInput from '../../components/SearchInput';
import Trending from '../../components/Trending';
import EmptyState from '../../components/EmptyState';
import { getFarmers, searchFarmers } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import FarmerCard from '../../components/FarmerCard';
import { useLocalSearchParams,router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

const Search = () => {
  
  const {query} = useLocalSearchParams();
  const {user,setUser, setIsLogged} = useGlobalContext();
  const {data: farmers, refetch,loading} = useAppwrite( ()=> searchFarmers(query));
  const userID= user.$id;
    useEffect(() => {
      refetch();
    }, [query])


  return (
    <SafeAreaView  className="min-h-[85vh]" >

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
           
            
                <Text className="font-pmedium text-sm">Search Results</Text>
                <Text className="text-2xl font-psemibold">{query}</Text>
           
              <View className="mt-1.5">
                <Image
                source={images.lgo}
                className="w-9 h-10"
                resizeMode='contain'

                 />
                 <View className="mt-6 mb-8">
                  <SearchInput initialQuery={query} />
                 </View>
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

export default Search
