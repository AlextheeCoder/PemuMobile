import { ScrollView, StyleSheet, Text, View,Image,Alert } from 'react-native'
import {React, useState}from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link,router } from 'expo-router'
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from "../../context/GlobalProvider";


const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });


  const handleSignUp  = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <SafeAreaView  className="h-full bg-white" >
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6" >

          <Image source={images.lgo} className="w-[115px] h-[115px]  rounded-full"/>
          <Text className="text-2xl text-semibold mt-10 font-psemibold" >Sign Up to PEMU </Text>

          <FormField 
        title="Username"
        value={form.username}
        handleChangeText={(e) => setForm({...form, username: e})}
        otherStyles="mt-7"
        
        />
        <FormField 
        title="Email"
        value={form.email}
        handleChangeText={(e) => setForm({...form, email: e})}
        otherStyles="mt-7"
        keyboardType="email-address"
        />

<FormField 
        title="Password"
        value={form.password}
        handleChangeText={(e) => setForm({...form, password: e})}
        otherStyles="mt-7 "
       
        />

         <CustomButton 
         title="Sign Up" 
         containerStyles="mt-7"
         handlePress={handleSignUp}
         isLoading={isSubmitting}
        
          />
           <View className="justify-center pt-5 flex-row gap-2">
          <Link href="/sign-in" className="text-lg text-blue-500 font-pregular" >Have an account already? Sign In</Link>
        </View>
        </View>

       
       
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({})