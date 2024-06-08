import { ScrollView, StyleSheet, Text, View,Image,Alert } from 'react-native'
import {React, useState}from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { getCurrentUser, signIn } from '../../lib/appwrite'
import { Link,router } from 'expo-router'
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSignIn  = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setIsSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", "Wrong credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView  className="h-full bg-white" >
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6" >

          <Image source={images.lgo} className="w-[115px] h-[115px]  rounded-full"/>
          <Text className="text-2xl text-semibold mt-10 font-psemibold" >Log In to PEMU </Text>

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
         title="Sign In" 
         containerStyles="mt-7"
         handlePress={handleSignIn}
         isLoading={isSubmitting}
        
          />
         <View className="justify-center pt-5 flex-row gap-2">
            <Link href="/sign-up" className="text-lg text-blue-500 font-pregular" >  Don't have an account? Sign Up</Link>
        </View>
        </View>

       
       
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({})