import {StyleSheet, ScrollView, Modal, Text, View ,Alert, ActivityIndicator,Image } from 'react-native';
import React,{useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import {createFarmerUnit, getFarmerCrops_Units} from '../../lib/appwrite';
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import {Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FormField from '../../components/FormField'




const Createunit = () => {
  
  
  const item = useLocalSearchParams();
  

  const { data: cropsFromDB,loading } = useAppwrite(() => getFarmerCrops_Units(item.$id));


  const [uploading, setuploading] = useState(false);
  const [farmerCrops, setFarmerCrops] = useState([]);
  const [selectedCrop, setselectedCrop] = useState(null);
  const [form, setform] = useState({
    CropID: selectedCrop,
    unit_name: '',
    farmerID: item.id,
  });

 


  useEffect(() => {
    if (cropsFromDB && Array.isArray(cropsFromDB.documents)) {
      const formattedCrops = cropsFromDB.documents.map(crop => {
        const date = new Date(crop.planting_date);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; // Format as DD-MM-YYYY
        return {
          label: `${crop.crop_name} (Planting Date: ${formattedDate})`,
          value: crop.$id,
        };
      });
      setFarmerCrops(formattedCrops);
    }
  }, [cropsFromDB]);





 

  const submit = async () => {
    if (!form.unit_name || !form.CropID) {
      return Alert.alert("Incomplete Form","Please provide all fields");
    }

    setuploading(true);
    try {
      await createFarmerUnit(form);
      Alert.alert("Success", "Unit added successfully");
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
    setform(prevForm => ({
      ...prevForm,
      CropID: selectedCrop,
    }));
  }, [selectedCrop]);

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
        Add Crop For {item.name}
      </Text>
    </View>
   

    <View className="justify-center mt-5" >
   <Text className="ml-6 text-xl mb-[-10px] font-pmedium" >Select Crop:</Text>
    <View style={styles.container}>
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={farmerCrops}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Crop"
            search
            searchPlaceholder="Search..."
            value={setselectedCrop}
            onChange={item => {
                setselectedCrop(item.value);
              }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>
      
    </View>







<View className="justify-center items-center" >
<Text className="ml-[-110px] text-xl mb-[-20px] font-pmedium" >Unit Name:</Text>
  <FormField 
    value={form.unit_name}
    placeholder="Unit Name"
    handleChangeText={(e) => setform({...form, unit_name: e})}
    otherStyles="w-[90%]"
  />

</View>

      <CustomButton
      title="Add Unit"
      containerStyles="mt-7"
      isLoading={uploading}
      handlePress={submit}
       />
   

  </ScrollView>
 </SafeAreaView>
  )
}

export default Createunit;

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
