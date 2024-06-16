import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Slot,SplashScreen,Stack } from 'expo-router'
import {useFonts} from 'expo-font'
import GlobalProvider from '../context/GlobalProvider'


SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
   }, [fontsLoaded, error])

   if (!fontsLoaded && !error) return null;

  return (
    <GlobalProvider>
    <Stack>
      <Stack.Screen name='index' options={{headerShown: false}} />
      <Stack.Screen name='(auth)' options={{headerShown: false}} />
      <Stack.Screen name='(tabs)' options={{headerShown: false}} />
      <Stack.Screen name='search/[query]' options={{headerShown: true , headerTitle:"Search"}} /> 
      <Stack.Screen name='farmer/[farmer]' options={{headerShown: true, headerTitle:"Farmer"}} />
      <Stack.Screen name='farmer/edit-farmer' options={{headerShown: true, headerTitle:"Edit Farmer"}} />
      <Stack.Screen name='farmer/create-transaction' options={{headerShown: true, headerTitle:"Create Transaction"}} />
      <Stack.Screen name='farmer/hela-status' options={{headerShown: true, headerTitle:"Hela Status"}} />
      <Stack.Screen name='farmer/create-vist' options={{headerShown: true, headerTitle:"Create Visit"}} />
      <Stack.Screen name='allview/farmers' options={{headerShown: true, headerTitle:"All Farmers"}} />
      <Stack.Screen name='allview/visits' options={{headerShown: true, headerTitle:"All Visits"}} />
      <Stack.Screen name='allview/blogs' options={{headerShown: true, headerTitle:"All Blogs"}} />
      <Stack.Screen name='visit/[visit]' options={{headerShown: true,headerTitle:"Visit Details"}} />
      <Stack.Screen name='blog/[blog]' options={{headerShown: true,headerTitle:"Pemu Blog"}} />
    </Stack>
    </GlobalProvider>

  
  )
}

export default RootLayout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})