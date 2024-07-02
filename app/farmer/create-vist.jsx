import { StyleSheet,ScrollView, Image, Text, View ,Alert, TouchableOpacity, Modal} from 'react-native'
import React,{useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { creatFarmer, createFarmerVisit, createVisit } from '../../lib/appwrite'
import { useLocalSearchParams,router } from 'expo-router';
import  MapView, { PROVIDER_GOOGLE,Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { icons } from '../../constants';
import * as DocumentPicker from 'expo-document-picker';


const CreateVisit = () => {

  const activities = [
    { label: 'Crop Follow Up', value: 'Crop Follow Up' },
    { label: 'Spray', value: 'Spray' },
    { label: 'Scouting', value: 'Scouting' },
    { label: 'Harvesting', value: 'Harvesting' },
    { label: 'Planting', value: 'Planting' },

  ];

  const inputs = [
    { label: 'Other', value: 'Other' },
    { label: 'C-Bon', value: 'C-Bon' },
    { label: 'Cal G', value: 'Cal G' },
    { label: 'Kazoo GR', value: 'Kazoo GR' },
    { label: 'Kazoo Liquid', value: 'Kazoo Liquid' },
    { label: 'Kazoo Powder', value: 'Kazoo Powder' },
    { label: 'N.P.K. 00 40 40', value: 'N.P.K. 00 40 40' },
    { label: 'N.P.K. 05 00 46', value: 'N.P.K. 05 00 46' },
    { label: 'N.P.K. 13 40 13', value: 'N.P.K. 13 40 13' },
    { label: 'N.P.K. 21 21 21', value: 'N.P.K. 21 21 21' },
    { label: 'Sporemax', value: 'Sporemax' },
    { label: 'Zenesta 39.5%', value: 'Zenesta 39.5%' },
    { label: 'Fertilizers Granular', value: 'Fertilizers Granular' },
    { label: 'Agricultural Gypsum', value: 'Agricultural Gypsum' },
    { label: 'Barat T C 200mls', value: 'Barat T C 200mls' },
    { label: 'Bhart CS', value: 'Bhart CS' },
    { label: 'CAN', value: 'CAN' },
    { label: 'DAP', value: 'DAP' },
    { label: 'GRA', value: 'GRA' },
    { label: 'GRANULATED LIME', value: 'GRANULATED LIME' },
    { label: 'NPK 17 17 17', value: 'NPK 17 17 17' },
    { label: 'NPK 23 23 0', value: 'NPK 23 23 0' },
    { label: 'Solubor Boron', value: 'Solubor Boron' },
    { label: 'Urea', value: 'Urea' },
    { label: 'Beanclean', value: 'Beanclean' },
    { label: 'Kausha', value: 'Kausha' },
    { label: 'Mahindra', value: 'Mahindra' },
    { label: 'Acentamiprid Shortgun', value: 'Acentamiprid Shortgun' },
    { label: 'Acentamiprid Twiga Ace', value: 'Acentamiprid Twiga Ace' },
    { label: 'Alonze', value: 'Alonze' },
    { label: 'AMINO GOLD', value: 'AMINO GOLD' },
    { label: 'CLICK 200 SL', value: 'CLICK 200 SL' },
    { label: 'Difenoconazole Score', value: 'Difenoconazole Score' },
    { label: 'Escort 1.9%', value: 'Escort 1.9%' },
    { label: 'Hable', value: 'Hable' },
    { label: 'Imidacloprid Click', value: 'Imidacloprid Click' },
    { label: 'Klassic', value: 'Klassic' },
    { label: 'Knockbectin', value: 'Knockbectin' },
    { label: 'Lambda Pentagon', value: 'Lambda Pentagon' },
    { label: 'Lambda Pentagon SEC', value: 'Lambda Pentagon SEC' },
    { label: 'Metamanco Matco 71', value: 'Metamanco Matco 71' },
    { label: 'Metamanco Matco 72', value: 'Metamanco Matco 72' },
    { label: 'Ortiva 250SC ORD 20 mls', value: 'Ortiva 250SC ORD 20 mls' },
    { label: 'PROVE 1.9 EC', value: 'PROVE 1.9 EC' },
    { label: 'Red Copper Nordox Super', value: 'Red Copper Nordox Super' },
    { label: 'Silesta', value: 'Silesta' },
    { label: 'edda 250EW', value: 'edda 250EW' },
    { label: 'Fertilizers', value: 'Fertilizers' },
    { label: 'Herbicides', value: 'Herbicides' },
    { label: 'Insecticides', value: 'Insecticides' },
    { label: 'Pesticides', value: 'Pesticides' },
    { label: 'None', value: 'None' },
  ];


  const [selectedActivities, setselectedActivities] = useState([]);
  const [selectedInputs, setselectedInputs] = useState([]);
  const [locationModalVisoble, setlocationModalVisoble] = useState(false);
  const [latitude, setlatitude] = useState();
  const [longitude, setlongitude] = useState();
  const [newMarker, setNewMarker] = useState(null);
  const [coordinates, setCoordinates] = useState([null, null]);
  const [address, setaddress] = useState();
  const [region, setregion] = useState();
   const [uploading, setuploading] = useState(false)
   const item = useLocalSearchParams();
   const { user } = useGlobalContext();
   const userId = user.$id;
   const farmerID = item.id;
   const [form, setForm] = useState({
    activities: selectedActivities.join(','),
    observation: '',
    inputs: selectedInputs.join(','),
    recommendation: '',
    coordinates: [`${latitude}`, `${longitude}`],
    picture1: null,
    userId: userId,
    farmerID: farmerID,
  });



  const closeMap = async () =>{
    
    await reverseGeocode();
    setForm(prevForm => ({
      ...prevForm,
      coordinates: [`${latitude}`, `${longitude}`],
    }));
    setlocationModalVisoble(false);
  }
  const initial ={
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  }
  const reverseGeocode =async () => {
    try {
      const reverseGeocodedAddress = await Location.reverseGeocodeAsync({
        longitude: longitude,
        latitude: latitude,
      });

      setaddress(reverseGeocodedAddress[0]);
      setregion(reverseGeocodedAddress[0].region);
      setCoordinates([latitude, longitude]);
    } catch (error) {
      console.error("Error in reverse geocoding: ", error);
    }
  }
 



 useEffect(() => {
  const getPermission = async () =>{
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted'){
      console.log("Please grant location permissions")
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
  
    setlatitude(currentLocation.coords.latitude);
    setlongitude(currentLocation.coords.longitude)
   
  };
  
  getPermission();
 }, [])
 
 const handleMapPress = (event) => {
  // Update state with new coordinates
  const { latitude, longitude } = event.nativeEvent.coordinate;
  setlatitude(latitude);
  setlongitude(longitude);
   // Update the form state with new coordinates
   setForm(prevForm => ({
    ...prevForm,
    coordinates: [`${latitude}`, `${longitude}`],
  }));

  // Create a new marker
  setNewMarker({
    latitude,
    longitude,
    title: 'New Location',
    description: 'Set visit to this location?',
  });
};
const renderItem = item => {
  return (
    <View style={styles.item}>
      <Text style={styles.selectedTextStyle}>{item.label}</Text>
      <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
    </View>
  );
};
useEffect(() => {
  setForm(prevForm => ({
    ...prevForm,
    activities: selectedActivities.join(','),
    inputs: selectedInputs.join(','),
    coordinates:  [`${latitude}`, `${longitude}`],
  }));
}, [selectedActivities, selectedInputs]);

const openPicker =async (selectType) => {
  const result = await DocumentPicker.getDocumentAsync({
    type: selectType === 'image'? ['image/png', 'image/jpg', 'image/jpeg'] : ['video/mp4', 'video/gif']
  })
  if (!result.canceled){
    if (selectType ==='image'){
      setForm({...form, picture1: result.assets[0] })
    }
  }
  else{
    setTimeout(()=>{
      Alert.alert('Document Picked', 'You have not picked an image')
    },100)
  }
}

const submit = async () => {
  if (
    !form.activities || !form.inputs || !form.observation || !form.recommendation || !form.coordinates || !form.picture1
  ) {
    return Alert.alert("Alert! ","Please provide all fields");
  }

  setuploading(true);
  try {
    console.log(coordinates);
    await createFarmerVisit(form);

    Alert.alert("Success", "Visit created successfully");
    router.push("/home");
  } catch (error) {
    Alert.alert("Error", error.message);
  } finally {
    setForm({
      observation: "",
      recommendation: "",     
    });
    setuploading(false);
  }
}



  return (
    
 <SafeAreaView className="h-full bg-white " >
  <ScrollView className="px-4 my-6" >
    <View className=" justify-center items-center " >
      <Image 
        source={{uri: user?.avatar}}
        className="w-16 h-16 rounded-lg"
        resizeMode='cover'
      />

    <Text className="font-pmedium " >
      Hello {user?.username}
    </Text>
    <Text className="text-sm font-psemibold" >
      Create Visit for {item.name}
    </Text>
    </View>
    
    <View className="mt-10" >
      <View className="justify-center" >
   <Text className=" text-xl mb-[-10px] font-pmedium" >Activities:</Text>
    <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={activities}
          labelField="label"
          valueField="value"
          placeholder="Select Activity"
          value={selectedActivities}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            setselectedActivities(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="black" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      
    </View>

    <View className="justify-center " >
   <Text className="text-xl mb-[-10px] font-pmedium" >Inputs Used:</Text>
    <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={inputs}
          labelField="label"
          valueField="value"
          placeholder="Select Input"
          value={selectedInputs}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            setselectedInputs(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="black" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      
    </View>

    <FormField 
          title="Observations: "
          value={form.observation}
          placeholder="Enter Your Observations"
          handleChangeText={(e) => setForm({...form, observation: e})}
          MoreStyles="w-[95%] ml-2"
          TextStyles=" text-xl font-pmedium"
        />
      
      <FormField 
          title="Recommendation: "
          value={form.recommendation}
          placeholder="Enter Your Recommendation"
          handleChangeText={(e) => setForm({...form, recommendation: e})}
          MoreStyles="w-[95%] ml-2"
          TextStyles=" text-xl font-pmedium mt-5"
        />

          {/* <View className="mt-5" >
            <Text className="text-xl mb-[-10px] font-pmedium" >Location: </Text>
            <TouchableOpacity onPress={() => setlocationModalVisoble(true)} className="ml-3 flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-3 w-[95%] text-white border border-primary" >
                <Text className="text-lg font-pregular" >Set Location: </Text>
                    {region && (
                      <Text className=" text-lg font-pregular text-secondary-100 " >{region}</Text>
                    )}
            </TouchableOpacity>
          </View> */}

          <View className="mt-5 space-y-2" >
                    <Text className="text-base font-pmedium" >
                      Visit Image 1
                    </Text>
                    <TouchableOpacity onPress={()=>openPicker('image')}>
                      {form.picture1 ? (
                        <Image 
                        source={{uri: form.picture1.uri}}
                        resizeMode='cover'
                        className="w-full h-64 rounded-2xl"
                        />

                      ): (
                        <View className="w-full h-40 px-4 border border-primary bg-white rounded-2xl justify-center items-center" >
                        <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center " >
                          <Image
                          source={icons.upload}
                          resizeMode='contain'
                          className="w-1/2 h-1/2"
                           />
                        </View>
                      </View>
                      )}

                   
                    </TouchableOpacity>
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
          onPress={handleMapPress}
          >
             
              {/* Render the initial marker */}
        <Marker
          coordinate={{
            latitude: initial.latitude,
            longitude: initial.longitude,
          }}
          title="Your Current Location"
          description="Set visit to this location?"
        />

        {/* Render the new marker */}
        {newMarker && (
          <Marker
            coordinate={{
              latitude: newMarker.latitude,
              longitude: newMarker.longitude,
            }}
            title={newMarker.title}
            description={newMarker.description}
          />
        )}

          </MapView>
          <CustomButton
            title="Set Location"
            handlePress={closeMap}
            containerStyles="mb-5 mt-3  w-[150px] bg-blue-400 "
           
          />

        </View>
       
      </Modal>

      <CustomButton
      title="Create Visit"
      handlePress={submit}
      containerStyles="mt-7"
      isLoading={uploading}
       />
       
 
   <View>
    
   </View>

    </View>
  

  </ScrollView>
 </SafeAreaView>
  )
}

export default CreateVisit

const styles = StyleSheet.create({
  container: { padding: 16 },
  dropdown: {
    height: 58,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 14,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FF9C01',
    shadowColor: '#000',
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
