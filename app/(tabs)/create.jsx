import { ScrollView, StyleSheet, Text, View ,Alert} from 'react-native'
import React,{useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { useGlobalContext } from '../../context/GlobalProvider'
import { creatFarmer } from '../../lib/appwrite'
import { router } from 'expo-router'

const create = () => {

   const [uploading, setuploading] = useState(false)
   const { user } = useGlobalContext();
   const userId = user.$id;
  const [form, setform] = useState({
    name: '',
    phonenumber: '',
    location: '',
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
      });

      setuploading(false);
    }
  }

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

const styles = StyleSheet.create({})