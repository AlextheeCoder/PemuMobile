import {StyleSheet, ScrollView, Modal, Text, View ,Alert,TouchableOpacity, ActivityIndicator,Image } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getFarmerDetails, creatFarmerDetails,updatefarmerdetails } from '../../lib/appwrite'
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE,Polygon } from 'react-native-maps';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import FormField from '../../components/FormField'


const EARTH_RADIUS = 6371000; // Earth radius in meters
const SQM_TO_ACRES = 0.000247105; // Conversion factor from square meters to acres


// Utility Functions
const toRadians = (degrees) => {
  return degrees * Math.PI / 180;
};

const calculateArea = (coordinates) => {
  let area = 0;

  if (coordinates.length < 3) {
    return area;
  }

  for (let i = 0; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i];
    const p2 = coordinates[i + 1];
    area += toRadians(p2.longitude - p1.longitude) *
            (2 + Math.sin(toRadians(p1.latitude)) + Math.sin(toRadians(p2.latitude)));
  }

  area = Math.abs(area * EARTH_RADIUS * EARTH_RADIUS / 2.0);
  return area * SQM_TO_ACRES; // Area in acres
};


const Editfarmer = () => {
  
  
  const item = useLocalSearchParams();
  const {data: farmerDetails, loading} = useAppwrite( ()=> getFarmerDetails(item.$id));
  let documentId;

  if (farmerDetails && farmerDetails.documents && farmerDetails.documents.length > 0) {
    documentId = farmerDetails.documents[0].$id;
  }
  
  const crops = [
    { label: 'Maize', value: 'Maize' },
    { label: 'Sukumawiki', value: 'Sukumawiki' },
    { label: 'French Beans', value: 'French Beans' },
    { label: 'Cabbage', value: 'Cabbage' },
    { label: 'Coffee', value: 'Coffee' },
    { label: 'Tomatoes', value: 'Tomatoes' },
    { label: 'Peas', value: 'Peas' },
    { label: 'Hoho', value: 'Hoho' },
    { label: 'Onion', value: 'Onion' },
    { label: 'Avocado', value: 'Avocado' },
    { label: 'Spinach', value: 'Spinach' },
    { label: 'Dania', value: 'Dania' },
    { label: 'Apples', value: 'Apples' },
    { label: 'Potatoe', value: 'Potatoe' },
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Banana', value: 'Banana' },
    { label: 'Bean', value: 'Bean' },
    { label: 'Pepper', value: 'Pepper' },
    { label: 'Tea', value: 'Tea' },
    { label: 'Watermelon', value: 'Watermelon' },
    { label: 'Other', value: 'Other' },
  ];

  const treatments = [
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
    { label: 'Other', value: 'Other' },
  ];
  
  
  const [Farmcoordinates, setFarmcoordinates] = useState([null, null]);
  const [coordinates, setCoordinates] = useState([]);
  const [ModalVisible, setModalVisible] = useState(false);
  const [area, setArea] = useState(0);
  const mapRef = useRef(null);
  const [latitude, setlatitude] = useState();
  const [longitude, setlongitude] = useState();
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedTreatments, setselectedTreatments] = useState([]);
  const [uploading, setuploading] = useState(false);

  const { user } = useGlobalContext();

   const [form, setform] = useState({
    treatments: selectedTreatments.join(','),
    crops: selectedCrops.join(','),
    size: 0,
    area:'',
    coordinates: [],
    Farmcoordinates: [`${latitude}`, `${longitude}`],
    documentId:documentId,
    farmerID: item.id,
  });
  

  const initial = {
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  };



  const setPoint = () => {
    if (mapRef.current) {
      mapRef.current.getCamera().then(camera => {
        const center = camera.center;
        if (coordinates.length < 6) {
          setCoordinates((prev) => [...prev, center]);
        }
      });
    }
  };


  const completeShape = () => {
    if (coordinates.length > 2) {
      const closedCoordinates = [...coordinates, coordinates[0]];
      const formattedCoordinates = closedCoordinates.map(coord => [coord.latitude.toString(), coord.longitude.toString()]);
      setCoordinates(closedCoordinates);
      const area = calculateArea(closedCoordinates);
      setArea(area);
      setform((prevForm) => ({
        ...prevForm,
        size: area.toFixed(3),
        coordinates: formattedCoordinates,
      }));
    }
  };

  const closeModal = () => {
   
    setModalVisible(false);
  };

  
  

  const submit = async () => {
    if (!form.crops || !form.treatments || !form.area) {
      return Alert.alert("Incomplete Form","Please provide all fields");
    }

    setuploading(true);
    try {
      await creatFarmerDetails(form);
      Alert.alert("Success", "Farmer Details added successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      
      setuploading(false);
    }
  }

  const updateFarmerDetails = async () => {
    
    if (
      (form.size === "")
    ) {
      return Alert.alert("Please provide all fields");
    }

    setuploading(true);
    try {
     
      await updatefarmerdetails(form,documentId);
      Alert.alert("Success", "Farmer updated successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      
      setuploading(false);
    }

  }
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

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


  useEffect(() => {
    setform(prevForm => ({
      ...prevForm,
      crops: selectedCrops.join(','),
      treatments: selectedTreatments.join(','),
      coordinates: coordinates.map(coord => [coord.latitude, coord.longitude].join(',')),
      Farmcoordinates: [`${latitude}`, `${longitude}`],
    }));
  }, [selectedCrops, selectedTreatments,coordinates]);
  
  

  return (
 <SafeAreaView className="h-full " >
    <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
  <ScrollView className="px-4 my-6" >
      <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center ml-36" >

            <Image 
              source={{uri: item?.avatar}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode='cover'
            />

    </View>
    <View className="flex items-center justify-center  ">
      <Text className="text-xl font-bold text-slate-500 ">
        Edit {item.name}
      </Text>
    </View>
   

    <View className="justify-center mt-5" >
   <Text className="ml-6 text-xl mb-[-10px] font-pmedium" >Select Crops:</Text>
    <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={crops}
          labelField="label"
          valueField="value"
          placeholder="Select Crop"
          value={selectedCrops}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            setSelectedCrops(item);
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




    <View className="justify-center mt-5" >
    <Text className="ml-6 text-xl mb-[-10px] font-pmedium" >Select Treatments:</Text>
    <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={treatments}
          labelField="label"
          valueField="value"
          placeholder="Select Treatment"
          value={selectedTreatments}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            setselectedTreatments(item);
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


<View className="justify-center items-center" >
<Text className="ml-[-110px] text-xl mb-[-20px] font-pmedium" >Enter Farm Size in m²:</Text>
  <FormField 
    value={form.area}
    placeholder="Enter Farm Size in m²"
    handleChangeText={(e) => setform({...form, area: e})}
    otherStyles="w-[90%] "
    keyboardType="number-pad"
  />

</View>

{/* 
<View className="justify-center mt-5" >
    <Text className="ml-6 text-xl mb-[-10px] font-pmedium" >Set Farm Size on Map:</Text>
    <TouchableOpacity onPress={()=>{setModalVisible(true)}} className="ml-3 flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-3 w-[93%] text-white border border-slate-500 justify-center" >
                <Text className="text-lg font-pregular" >Set Farm Size: </Text>
            
                      <Text className=" text-lg font-pregular text-secondary-100 " >{area.toFixed(3)} acres  </Text>
               
            </TouchableOpacity>
      
    </View> */}

          <Modal
              animationType='slide'
              transparent={true}
              visible={ModalVisible}
              onRequestClose={() => setModalVisible(false)}
          >

<GestureHandlerRootView className="flex-1  justify-center items-center h-full w-full bg-white" >
      <MapView
        className="h-[90%] w-[100%] "
        provider={PROVIDER_GOOGLE}
        initialRegion={initial}
        mapType="satellite"
        ref={mapRef}
      >
          <Polyline
              coordinates={coordinates}
              strokeColor="#27ac88"
              strokeWidth={6}
            />
            {coordinates.length > 2 && coordinates[0] === coordinates[coordinates.length - 1] && (
              <Polygon
                coordinates={coordinates}
                fillColor="rgba(255, 165, 0, 0.5)"
                strokeColor="#000"
                strokeWidth={1}
              />
            )}

             {coordinates.map((coordinate, index) => (
              <Marker key={index} coordinate={coordinate} />
            ))}
       
      </MapView>
    <View style={styles.circleGuide}>
            <View style={styles.dot} />
          </View>
    </GestureHandlerRootView>
    <View  className="bg-white" >
    <View style={styles.buttonContainer} >
          <TouchableOpacity onPress={setPoint} style={styles.button} >
            <Text style={styles.buttonText}>Set Point</Text>
          </TouchableOpacity>
          {coordinates.length > 2 && (
            <TouchableOpacity onPress={completeShape} style={styles.button} className="ml-4 mr-4" >
              <Text style={styles.buttonText}>Complete Shape</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={closeModal} style={styles.button}>
            <Text style={styles.buttonText}>Close Map</Text>
          </TouchableOpacity>
        </View>
    </View>

   

          </Modal>

      <CustomButton
      title={farmerDetails && farmerDetails.documents && farmerDetails.documents.length > 0 ? "Update Details" : "Add Details"}
      handlePress={farmerDetails && farmerDetails.documents && farmerDetails.documents.length > 0 ? updateFarmerDetails : submit}
      containerStyles="mt-7"
      isLoading={uploading}
       />
   

  </ScrollView>
 </SafeAreaView>
  )
}

export default Editfarmer;

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
  drawingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  circleGuide: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 40, // Increased size of the circle
    height: 40, // Increased size of the circle
    marginLeft: -20,
    marginTop: -20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'red',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
