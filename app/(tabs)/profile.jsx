import {View,Image, FlatList,TouchableOpacity, Modal, ActivityIndicator  } from 'react-native'
import { React} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons} from  '../../constants'
import EmptyState from '../../components/EmptyState';
import { getUserFarmers, signOut,getUserVisits} from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import FarmerCard from '../../components/FarmerCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';

const Profile = () => {
  
 
  const {user,setUser, setIsLogged} = useGlobalContext();
  const userID= user.$id

  const {data: farmers, loading} = useAppwrite( ()=> user ? getUserFarmers(user.$id) : []);
  const {data: visits} = useAppwrite( ()=> getUserVisits(user.$id));
  
const logout = async () => {
  
  await signOut();
  router.replace('/sign-in');
  setIsLogged(false);
  setUser(null);
  
}

  return (
    <SafeAreaView  className="min-h-[100vh] bg-white" >
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
         <View className="w-full justify-center items-center mt-6 mb-12 px-4" >
          <TouchableOpacity  className="w-full items-end mb-10"  onPress={logout} >
            <Image 
            source={icons.logout} 
            resizeMode='contain'
            className="w-6 h-6"
             />
             </TouchableOpacity>
             <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center" >
              <Image 
              source={{uri: user?.avatar}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode='cover'
              />
             </View>
             <InfoBox 
              title={user?.username}
              containerStyles="mt-5"
              titleStyles="text-lg"
             />
             <View className="mt-5 flex-row" >
             <InfoBox 
              title={farmers.length || 0}
              subtitle="Farmers"
              containerStyles="mr-10"
              titleStyles="text-xl"
             />
              <InfoBox 
              title={visits.length || 0}
              subtitle="Visits Made"
              titleStyles="text-xl"
             />
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

export default Profile
