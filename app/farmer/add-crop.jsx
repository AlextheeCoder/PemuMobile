import {StyleSheet, ScrollView, Modal, Text, View ,Alert,TouchableOpacity, ActivityIndicator,Image } from 'react-native';
import React,{useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { getFarmerDetails, creatFarmerDetails, createFarmerCrop} from '../../lib/appwrite';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { MultiSelect,Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FormField from '../../components/FormField'




const AddCrop = () => {
  
  
  const item = useLocalSearchParams();
  
  const crops = [
    { label: 'Maize', value: 'Maize' },
    { label: 'Sukumawiki', value: 'Sukumawiki' },
    { label: 'French Beans', value: 'French Beans' },
    { label: 'Cabbage', value: 'Cabbage' },
    { label: 'Coffee', value: 'Coffee' },
    { label: 'Tomato', value: 'Tomato' }, 
    { label: 'Green Pepper', value: 'Green Pepper' },
    { label: 'Onion', value: 'Onion' },
    { label: 'Avocado', value: 'Avocado' },
    { label: 'Spinach', value: 'Spinach' },
    { label: 'Coriander', value: 'Coriander' },
    { label: 'Apples', value: 'Apples' },
    { label: 'Potato', value: 'Potato' }, 
    { label: 'Wheat', value: 'Wheat' },
    { label: 'Banana', value: 'Banana' },
    { label: 'Tea', value: 'Tea' },
    { label: 'Watermelon', value: 'Watermelon' },
    { label: 'Rice', value: 'Rice' },  
    { label: 'Cassava', value: 'Cassava' },  
    { label: 'Millet', value: 'Millet' },  
    { label: 'Sorghum', value: 'Sorghum' },  
    { label: 'Pineapple', value: 'Pineapple' },  
    { label: 'Mango', value: 'Mango' },  
    { label: 'Passion Fruit', value: 'Passion Fruit' },  
    { label: 'Sweet Potato', value: 'Sweet Potato' },  
    { label: 'Peas', value: 'Peas' },  
    { label: 'Sunflower', value: 'Sunflower' },  
    { label: 'Sugarcane', value: 'Sugarcane' },  
    { label: 'Other', value: 'Other' }
  ];
  

 

  const [selectedCrops, setSelectedCrops] = useState([]);
  const [uploading, setuploading] = useState(false);
  const [date, setDate] = useState(null);
  const [harvestDate, setHarvestDate] = useState(null);
  const [showPlantingPicker, setShowPlantingPicker] = useState(false);
  const [showHarvestPicker, setShowHarvestPicker] = useState(false);
 


  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || date;
      setDate(currentDate);
    }
    setShowPlantingPicker(false);
  }

  const handleHarvestDateChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || harvestDate;
      setHarvestDate(currentDate);
    }
    setShowHarvestPicker(false);
  }

  const formatDate = (date) => {
    if (!date) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };



  const [form, setform] = useState({
    crop_name: selectedCrops,
    planting_date: date,
    harvest_date: harvestDate,
    field_size: '',
    units_number: '',
    seeds_number: '',
    farmerID: item.id,
  });


  const submit = async () => {
    if (!form.crop_name || !form.planting_date || !form.harvest_date || !form.field_size) {
      return Alert.alert("Incomplete Form","Please provide all fields");
    }

    setuploading(true);
    try {
      await createFarmerCrop(form);
      Alert.alert("Success", "Crop added successfully");
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
      crop_name: selectedCrops,
      planting_date: date,
      harvest_date: harvestDate,
    }));
  }, [selectedCrops, date, harvestDate]);
  

  return (
 <SafeAreaView className="h-full " >
   
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
            data={crops}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Crop"
            search
            searchPlaceholder="Search..."
            value={selectedCrops}
            onChange={item => {
              setSelectedCrops(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>
      
    </View>


    <View className="justify-center items-center mb-5" >
    <Text className="ml-[-180px] text-xl mb-[-10px] font-pmedium" >Planting Date:</Text>
    <TouchableOpacity onPress={()=> setShowPlantingPicker(true)} className="flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-5 w-[90%] text-white border border-primary justify-center" >
      <Text className="text-lg font-pregular" >Enter Date: </Text>
      {date && (
            <Text className=" text-lg font-pregular text-secondary-100 " >{formatDate(date)}</Text>
        )}
    </TouchableOpacity>
    {
        showPlantingPicker && (
            <DateTimePicker 
            mode={'date'}
            value={date || new Date()}
            onChange={handleDateChange}
        />
        )
    }
   

    </View>
    <View className="justify-center items-center mb-5" >
    <Text className="ml-[-90px] text-xl mb-[-10px] font-pmedium" >Expected Harvest Date:</Text>
    <TouchableOpacity onPress={()=> setShowHarvestPicker(true)} className="flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-5 w-[90%] text-white border border-primary justify-center" >
      <Text className="text-lg font-pregular" >Enter Date: </Text>
      {harvestDate && (
            <Text className=" text-lg font-pregular text-secondary-100 " >{formatDate(harvestDate)}</Text>
        )}
    </TouchableOpacity>
    {
       showHarvestPicker && (
            <DateTimePicker 
            mode={'date'}
            value={harvestDate || new Date()}
            onChange={handleHarvestDateChange}
        />
        )
    }
   

    </View>



<View className="justify-center items-center" >
<Text className="ml-[-150px] text-xl mb-[-20px] font-pmedium" >Number of Units:</Text>
  <FormField 
    value={form.units_number}
    placeholder="Number of Units"
    handleChangeText={(e) => setform({...form, units_number: e})}
    otherStyles="w-[90%]"
    keyboardType="number-pad"
  />

</View>
<View className="justify-center items-center mt-5" >
<Text className="ml-[-110px] text-xl mb-[-20px] font-pmedium" >Number of Seeds:</Text>
  <FormField 
    value={form.seeds_number}
    placeholder="Number of Seeds"
    handleChangeText={(e) => setform({...form, seeds_number: e})}
    otherStyles="w-[90%]"
    keyboardType="number-pad"
  />

</View>

<View className="justify-center items-center mt-5" >
<Text className="ml-[-110px] text-xl mb-[-20px] font-pmedium" >Enter Field Size in m²:</Text>
  <FormField 
    value={form.field_size}
    placeholder="Enter Field Size in m²"
    handleChangeText={(e) => setform({...form, field_size: e})}
    otherStyles="w-[90%]"
    keyboardType="number-pad"
  />

</View>


      <CustomButton
      title="Add Crop"
      containerStyles="mt-7"
      isLoading={uploading}
      handlePress={submit}
       />
   

  </ScrollView>
 </SafeAreaView>
  )
}

export default AddCrop;

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
