import {View,Modal, ActivityIndicator} from 'react-native'
import { React} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAllVisits} from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';

import AllVisitsCard from '../../components/AllVisitsCard';


const AllVisits = () => {

  const {data: visits,loading} = useAppwrite(getAllVisits);


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
      <AllVisitsCard visits={visits}  />
  
    </SafeAreaView>
  )
}

export default AllVisits