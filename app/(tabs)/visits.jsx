import {View,Image, FlatList,Modal, ActivityIndicator  } from 'react-native'
import { React} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {icons} from  '../../constants'
import EmptyState from '../../components/EmptyState';
import { getUserVisits} from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import FarmerCard from '../../components/FarmerCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import InfoBox from '../../components/InfoBox';
import { router } from 'expo-router';
import VisitCard from '../../components/VisitCard';
import CustomButton from '../../components/CustomButton';

const Visits = () => {
  
 
  const {user} = useGlobalContext();


  const {data: visits,loading} = useAppwrite( ()=> getUserVisits(user.$id));


  return (
    <SafeAreaView  className="min-h-[100%] bg-white" >
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
      
      data={visits}
      keyExtractor={(item) => item.$id}

      renderItem={({item}) => (
        <VisitCard
        action={() => router.push({ pathname: `/visit/${item.farmerID.$id}`, params: item })}
        visit={item}
      />
      

      )}
      ListHeaderComponent={() =>
        (
         <View className="w-full justify-center items-center mt-6 mb-12 px-4" >
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
             <View className="mt-[-18px] flex-row" >
              <InfoBox 
              title={visits.length || 0}
              subtitle={"Visits Made by " + user?.username }
              titleStyles="text-xl"
              subtitleStyles="text-xl"
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

export default Visits
