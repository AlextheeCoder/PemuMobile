import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image, Modal, ActivityIndicator } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { images } from '../constants';
import CustomButton from '../components/CustomButton';
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className=" min-h-[85vh] bg-hmscreen" >
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <ScrollView contentContainerStyle={{ height: '100%' }} >
        <View className="w-full justify-center items-center h-full px-4" >
          <Image
            source={images.lgo}
            className="w-32 h-32 rounded-full"
            resizeMode='contain'
          />
          <View className="realtive mt-5">
            <Text className="text-3xl text-slate-800 font-bold text-center" >
              Welcome To
              <Text className="text-primary" > PEMU  Mobile </Text>
            </Text>

            <CustomButton
              title="Get Started"
              handlePress={() => router.push('/sign-in')}
              containerStyles='mt-7'
            />
          </View>

        </View>
      </ScrollView>

      <StatusBar backgroundColor='#f7ef31' style="light" />
    </SafeAreaView>
  );
}