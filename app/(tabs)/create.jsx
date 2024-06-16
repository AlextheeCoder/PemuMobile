import { ScrollView, StyleSheet, Text, View ,Alert} from 'react-native'
import React,{useState,useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { creatFarmer } from '../../lib/appwrite'
import { router } from 'expo-router'
import { Dropdown } from 'react-native-element-dropdown'
import AntDesign from '@expo/vector-icons/AntDesign';


const data = [
  { label: 'Walk In', value: 'Walk In' },
  { label: 'Walk In With Service', value: 'Walk In With Service' },
  { label: 'Outgrower', value: 'Outgrower' },
];

const create = () => {

  const [value, setValue] = useState(null);
   const [uploading, setuploading] = useState(false)
   const { user } = useGlobalContext();
   const userId = user.$id;
  const [form, setform] = useState({
    name: '',
    phonenumber: '',
    location: '',
    IDnumber: '',
    type: value,
    userId: userId
  })

  

  const submit = async () => {
    if (
      (form.name === "") |
      (form.phonenumber === "") |
      (form.location === "")
    ) {
      return Alert.alert("Please provide all fields");
    }

    setuploading(true);
    try {
      await creatFarmer(form);

      Alert.alert("Success", "Farmer registerd successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setform({
        name: "",
        phonenumber: "",     
        location: "",
        IDnumber: "",
      });

      setuploading(false);
    }
  }

  useEffect(() => {
    setform(prevForm => ({
      ...prevForm,
      type: value,
    }));
  }, [value]);
  

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
        {item.value === value && (
          <AntDesign
            style={styles.icon}
            color="black"
            name="Safety"
            size={20}
          />
        )}
      </View>
    );
  };


  return (
 <SafeAreaView className="h-full bg-white " >
  <ScrollView className="px-4 my-6" >
    <Text className="text-2xl font-psemibold" >
      Register Farmer
    </Text>

    <FormField 

      title="Farmer Name"
      value={form.name}
      placeholder="Enter Farmer Name"
      handleChangeText={(e) => setform({...form, name: e})}
      otherStyles="mt-10"
    />
        <FormField 
          title="Farmer Phone Number"
          value={form.phonenumber}
          placeholder="Enter Farmer Phone Number"
          handleChangeText={(e) => setform({...form, phonenumber: e})}
          otherStyles="mt-10"
          keyboardType="number-pad"
      />
       <FormField 
          title="Farmer ID Number"
          value={form.IDnumber}
          placeholder="Enter Farmer ID Number"
          handleChangeText={(e) => setform({...form, IDnumber: e})}
          otherStyles="mt-10"
          keyboardType="number-pad"
      />
      <View>
        <Text className="mt-7 text-base font-pmedium" >
          Type of Farmer
        </Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={data}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Type"
            searchPlaceholder="Search..."
            value={value}
            onChange={item => {
              setValue(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>
       
       <FormField 
          title="Farm Location"
          value={form.location}
          placeholder="Enter Farm Location"
          handleChangeText={(e) => setform({...form, location: e})}
          otherStyles="mt-10"
        />
      <CustomButton
      title="Register Farmer"
      handlePress={submit}
      containerStyles="mt-7"
      isLoading={uploading}
       />
   

  </ScrollView>
 </SafeAreaView>
  )
}

export default create
const styles = StyleSheet.create({
  dropdown: {
    borderWidth: 1,
    borderColor: '#cbd5e0',
    marginTop: 2,
    height: 50,
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
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});