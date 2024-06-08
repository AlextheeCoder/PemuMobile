import {View,Image,TouchableOpacity ,Text,  Modal, ActivityIndicator ,ScrollView} from 'react-native'
import { React,useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '../../components/InfoBox';
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import CustomButton from '../../components/CustomButton'
import { getFarmerById, getFarmerDetails,getFarmerVisits } from '../../lib/appwrite';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE,Polygon } from 'react-native-maps';



const Farmer = () => {

  const item = useLocalSearchParams();
  const userID=item.userID;
  const {data: visits} = useAppwrite( ()=> getFarmerVisits(item.$id));
  const {data: useid} =useAppwrite(()=> getFarmerById(item.$id))
  const {data: farmerDetails, loading} = useAppwrite( ()=> getFarmerDetails(item.$id));

  const checker = useid && useid.users ? useid.users.$id : null;



  const [crops, setcrops] = useState();
  const [treatments, settreatments] = useState();
  const[size,setSize] = useState(0);
  const[visit,setvisit] = useState(0);
  const [checkifEqual, setcheckifEqual] = useState(false);
  const [location, setlocation] = useState();
  const [longitude, setlongitude] = useState();
  const [latitude, setlatitude] = useState();
  const [Coordinates, setCoordinates] = useState([])
  const [farmLocation, setfarmLocation] = useState([null, null]);
  const [showTouchableOpacity, setShowTouchableOpacity] = useState(false);
  const [locationModalVisoble, setlocationModalVisoble] = useState(false);
  const [formatedCoords, setformatedCoords] = useState([]);

  
  let farmerDocument;
  
  if (farmerDetails && farmerDetails.documents) {
    const farmerID = item.$id;
    farmerDocument = farmerDetails.documents.find(doc => doc.farmerID === farmerID);
  }


  const cropList = crops ? crops.split(',') : [];
  const treatmentList = treatments ? treatments.split(',') : [];


  const isValidCoordinates = (longitude, latitude) => {
    return !isNaN(parseFloat(longitude)) && !isNaN(parseFloat(latitude));
  };

  useEffect(() => {
    console.log('Checking coordinates:', longitude, latitude);
    setShowTouchableOpacity(isValidCoordinates(longitude, latitude));
  }, [longitude, latitude]);

  useEffect(() => {
    if (userID === checker) {
      setcheckifEqual(true);
    };
  
    if (farmerDocument) {
      setcrops(farmerDocument.crops);
      settreatments(farmerDocument.treatments);
      setSize(farmerDocument.farm_size);
      setvisit(visits.length);
      setCoordinates(farmerDocument.coordinates);
      const doc= farmerDocument.Farmcoordinates;
      setfarmLocation(farmerDocument.Farmcoordinates);
      const formattedCoordinates = Coordinates.map(coordString => {
        const [latitude, longitude] = coordString.split(',').map(parseFloat);
        return { latitude, longitude };
      });
      

        setformatedCoords(formattedCoordinates)
    };
    
    const [lat, long] = farmLocation;
    setlatitude(parseFloat(lat));
    setlongitude(parseFloat(long));


  }, [userID, checker, farmerDocument]);



  

  


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

      <View className="w-full justify-center items-center mt-6 mb-12 px-4" >
         
         <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center" >

          <Image 
            source={{uri: item?.avatar}}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode='cover'
          />
          
         </View>
         <InfoBox 
          title={item.name}
          containerStyles="mt-5"
          titleStyles="text-lg"
         />
         <View className="mt-5 flex-row" >
         <InfoBox 
          title={item.location}
          subtitle="Location"
          containerStyles="mr-10"
          titleStyles="text-xl"
         />
          <InfoBox 
          title={visit}
          subtitle="Visits Made"
          titleStyles="text-xl"
         />
          <InfoBox 
          title={size + " acres"}
          containerStyles="ml-10"
          subtitle="Farm Size"
          titleStyles="text-xl"
         />
         </View>

     </View>
     <View>
      
      <View className="justify-center items-center mt-[-10px] " >
      {showTouchableOpacity && (
        <TouchableOpacity  onPress={() => setlocationModalVisoble(true)} >
          <Text className="text-lg text-blue-600 font-pregular mt-[-15px]">
            View on Map
          </Text>
        </TouchableOpacity>
      )}

        {checkifEqual && (
  <View className="flex-row justify-between">
    <CustomButton
      title="Edit Details"
      containerStyles="w-[45%] mt-5 mr-5"
      handlePress={() =>
        router.push({
          pathname: `/farmer/edit-farmer`,
          params: { ...item, id: item.$id },
        })
      }
    />

    <CustomButton
      title="Visit Farmer"
      containerStyles="w-[45%] mt-5"
      handlePress={() =>
        router.push({
          pathname: `/farmer/create-vist`,
          params: { ...item, id: item.$id },
        })
      }
    />

  
  </View>
)}


      </View>

    
        
        {/* View crops grown */}
      <View className="mt-10 bg-slate-50 shadow-md rounded-lg overflow-hidden h-[150px] w-[90%] ml-5 items-center">
        <View className="p-6">
        <Text className="text-lg text-black underline font-pbold"> CROPS GROWN </Text>

          <View className="flex-row flex-wrap" >
          {cropList.length > 0 ? ( 
                cropList.map((crop, index) => (
                  <Text 
                  key={index} className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 mx-1 my-1">
                    {crop}
                  </Text>
                ))
              ) : (
                <Text>No crops found</Text> // Display message if no crops
              )}
          </View>

      
            
        </View>
      </View>

          {/* View crops grown */}
          <View className="mt-10 bg-slate-50 shadow-md rounded-lg overflow-hidden h-[150px] w-[90%] ml-5 items-center mb-10">
        <View className="p-6">
        <Text className="text-lg text-black underline font-pbold"> Products in Use</Text>
        
        <View className="flex-row flex-wrap" >
          {treatmentList.length > 0 ? ( 
                treatmentList.map((treatment, index) => (
                  <Text 
                  key={index} className="text-sm px-2 py-1 rounded-full  bg-secondary-100 text-white mx-1 my-1">
                    {treatment}
                  </Text>
                ))
              ) : (
                <Text>No treatments found</Text> // Display message if no crops
              )}
          </View>

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
              <Polyline
              coordinates={formatedCoords}
              strokeColor="#27ac88"
              strokeWidth={4}
            />
           <Polygon
              coordinates={formatedCoords}
              fillColor="rgba(255, 165, 0, 0.5)"
              strokeColor="#000"
              strokeWidth={1}
            />

                  {formatedCoords.map((coordinate, index) => (
                    <Marker key={index} coordinate={coordinate} />
                  ))}
          
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

export default Farmer



