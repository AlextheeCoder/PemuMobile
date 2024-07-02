import {View,Image,TouchableOpacity ,Text,  Modal, ActivityIndicator,SafeAreaView, ScrollView  } from 'react-native'
import{ React,useState,useEffect} from 'react'
import { useLocalSearchParams,router  } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { getVisitDetails } from '../../lib/appwrite';
import  MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import CustomButton from '../../components/CustomButton';
import * as Location from 'expo-location';



const Visit = () => {
    const item = useLocalSearchParams();
    const farmer= item.visit;
    const visit =item.$id;
   
   
    const {data: visitDetails, loading} = useAppwrite( ()=> getVisitDetails(farmer,visit));

    const [activities, setactivities] = useState();
    const [inputs, setinputs] = useState();
    const[observations,setobservations] = useState();
    const[recommendation,setrecommendation] = useState();
    const[picture1,setpicture1] = useState();
    const [coordinates, setCoordinates] = useState([null, null]);
    const [username, setUsername] = useState();
    const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
    const [latitude, setlatitude] = useState();
    const [longitude, setlongitude] = useState();
    const [region, setregion] = useState();
    const [locationModalVisoble, setlocationModalVisoble] = useState(false);


    const activitiesList = activities ? activities.split(',') : [];
    const inputsList = inputs ? inputs.split(',') : [];

    
  useEffect(() => {
    if (visitDetails && visitDetails.documents) {
      const { coordinates: docCoordinates } = visitDetails.documents[0];
      setCoordinates(docCoordinates);
      const doc = visitDetails.documents[0];
      const user = doc.users;
      setUsername(user.username);
      setactivities(doc.activities);
      setinputs(doc.inputs);
      setobservations(doc.observations);
      setrecommendation(doc.recommendation);
      setpicture1(doc.picture1);
      const isoDate = doc.$createdAt;
      const formattedDate = new Date(isoDate).toISOString().split('T')[0];
      setFormattedCreatedAt(formattedDate);
      const [lat, long] = docCoordinates;
      setlatitude(parseFloat(lat));
      setlongitude(parseFloat(long));
    
    }

    

  }, [visitDetails]);


  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      if (typeof latitude === 'number' && !isNaN(latitude) && typeof longitude === 'number' && !isNaN(longitude)) {
        reverseGeocode();
      } 
    }
  }, [latitude, longitude]);

  const reverseGeocode = async () => {
    try {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: longitude,
        latitude: latitude,
      });
    
      setregion(reverseGeocodedAddress[0].region);
    } catch (error) {
      console.error("Error in reverse geocoding: ", error);
    }
  };

  
  const checkcoords = async () =>{
    setlocationModalVisoble(false);
  }

  const initial ={
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  }



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
  <ScrollView>
      <View className="my-6 px-4 space-y-6" >
      
        <View className="mb-12 px-4 mt-10 "  >
                <View className="justify-center items-center w-full rounded-3xl " >
                    <Image 
                      source={{uri: picture1}}
                      resizeMode='cover'
                      className="w-full h-[200px] rounded-lg"
                      />
                </View>

                <View className=" justify-between flex-row  mt-3 " >
                  <View className=" justify-between flex-row"> 
                     <Text className="text-sm font-psemibold" >Visit by: </Text>
                     <Text className="text-sm font-psemibold text-primary" >{username} </Text>
                  </View>
                  <View className=" justify-between flex-row"> 
                     <Text className="text-sm font-psemibold" >Date: </Text>
                     <Text className="text-sm font-psemibold text-secondary" >{formattedCreatedAt} </Text>
                  </View>
                  
                    
                </View>
          </View>

          <View className="w-full border-t border-b border-slate-300">
            <View className="mt-3 mb-3" >
              <Text className="text-sm font-psemibold" >
                Activities Carried Out
              </Text>
            </View>
            <View className="flex-row flex-wrap mb-4" >
          {activitiesList.length > 0 ? ( 
                activitiesList.map((activity, index) => (
                  <Text 
                  key={index} className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 mx-1 my-1">
                    {activity}
                  </Text>
                ))
              ) : (
                <Text>No Activities found</Text> 
              )}
          </View>
          </View>

          {/* Inputs Used */}
          <View className="w-full  border-b border-slate-300">
            <View className="mb-3" >
              <Text className="text-sm font-psemibold" >
                Inputs Used
              </Text>
            </View>
            <View className="flex-row flex-wrap mb-4" >
          {inputsList.length > 0 ? ( 
                inputsList.map((inputs, index) => (
                  <Text 
                  key={index} className="text-sm px-2 py-1 rounded-full bg-secondary-100 text-green-800 mx-1 my-1">
                    {inputs}
                  </Text>
                ))
              ) : (
                <Text>No Inputs found</Text> 
              )}
          </View>
          </View>

          {/* Observations */}
          <View className="w-full  border-b border-slate-300">
            <View className="mb-3" >
              <Text className="text-sm font-psemibold" >
                Observations Made
              </Text>
            </View>
            <View className="flex-row flex-wrap mb-4" >
             <Text className="font-pregular text-base" > {observations} </Text>
          </View>
          </View>

             {/* Recommendations */}
             <View className="w-full  border-b border-slate-300">
            <View className="mb-3" >
              <Text className="text-sm font-psemibold" >
                Recommendations
              </Text>
            </View>
            <View className="flex-row flex-wrap mb-4" >
             <Text className="font-pregular text-base" > {recommendation} </Text>
          </View>
          </View>

          {/* Map View  */}

          <View className="w-full  border-b border-slate-300">
            <View className="mb-3" >
              <Text className="text-sm font-psemibold" >
                Visit Location
              </Text>
            </View>
            <View className="flex-row flex-wrap mb-4" >
            {region && (
                      <Text className="font-pregular text-base" >{region}</Text>
                    )}
              {/* <TouchableOpacity onPress={() => setlocationModalVisoble(true)} className=" flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-3 w-[95%] text-white border border-primary justify-center" >
                <Text className="text-lg font-pregular" >View Visit Location on Map </Text>
                    
            </TouchableOpacity> */}
              
          </View>
          </View>


          <Modal 
     
     animationType='slide'
     transparent={true}
     visible={locationModalVisoble}
     onRequestClose={() => setlocationModalVisoble(false)}
     >
       <View className="flex items-center justify-center bg-white ">
         <MapView 
         className="h-[90%] w-[100%] "
         provider={PROVIDER_GOOGLE}
         initialRegion={initial}
         mapType="satellite"
         
         >

        <Marker
          coordinate={{
            latitude: initial.latitude,
            longitude: initial.longitude,
          }}
          title="Visit Location"
          description="This is where the visit was recorded"
        />
          </MapView>
            
      
         
         <CustomButton
           title="Close Map"
           handlePress={checkcoords}
           containerStyles="mb-5 mt-3  w-[150px] bg-blue-400 "
          
         />

       </View>
      
     </Modal>

          


      
          




      </View>
      </ScrollView>

</SafeAreaView>
  )
}

export default Visit