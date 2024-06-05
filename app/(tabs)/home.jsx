import {StyleSheet, Text, View,Image, FlatList, RefreshControl, Modal, ActivityIndicator, TouchableOpacity} from 'react-native'
import { React,useState,useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from  '../../constants'
import SearchInput from '../../components/SearchInput';
import EmptyState from '../../components/EmptyState';
import { getLatestFarmers, getLatestVisits } from '../../lib/appwrite';
import useAppwrite from '../../lib/useAppwrite';
import FarmerCard from '../../components/FarmerCard';
import { useGlobalContext } from '../../context/GlobalProvider';
import { router } from 'expo-router';
import InformationCard from '../../components/InformationCard';
import * as Location from 'expo-location';
import Trending from '../../components/Trending';
import LatestVisitCard from '../../components/LatestVisitCard';

const Home = () => {
  
  const openWeatherKey = '01a34fc2805351837988550053ecf642'
  const {data: farmers, refetch,loading} = useAppwrite(getLatestFarmers);
  const {data: visits} = useAppwrite(getLatestVisits);

  const {user,setUser, setIsLogged} = useGlobalContext();
  const  url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${openWeatherKey}`;
  const [latitude, setlatitude] = useState();
  const [longitude, setlongitude] = useState();
  const [Forecast, setForecast] = useState();
  const [icon, setIcon] = useState(null);
  const [description, setDescription] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);

 

  const loadForecast = async () => {
    setrefreshing(true);
    try {
      const response = await fetch(`${url}&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      if (data && data.weather && data.weather.length > 0 && data.main) {
        const weatherData = data.weather[0];
        setCurrentWeather(weatherData);
        setIcon(weatherData.icon);
        setDescription(weatherData.description);
        setTemperature(data.main.temp);
      } else {
        console.log("Weather data is not available in the response");
      }
      setForecast(data);
    } catch (error) {
      console.error("Error fetching the forecast data:", error);
    }
    setrefreshing(false);
  };
 
 

  const [refreshing, setrefreshing] = useState(false);
  const userID= user.$id;
  const onRefresh = async () => {
    setrefreshing(true);
    await refetch();
    loadForecast();
    setrefreshing(false);
  }
  

  useEffect(() => {
    const getPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log("Please grant location permissions");
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setlatitude(currentLocation.coords.latitude);
      setlongitude(currentLocation.coords.longitude);
    };
    getPermission();
  }, []);
  
  useEffect(() => {
    if (latitude && longitude) {
      loadForecast();
    }
  }, [latitude, longitude]);
  

   
  // console.log(currentWeather);
  // console.log(icon);
  // console.log(description);

  

  if(!Forecast && !currentWeather){

    return(
      <SafeAreaView className="justify-center items-center mt-80" >
        <ActivityIndicator size='large' color="#000" />
      </SafeAreaView>
    )
  }
  

  return (
    <SafeAreaView  className="min-h-[85vh] bg-white" >
      <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>

  
      <FlatList 
      
      data={farmers}
      keyExtractor={(item) => item.$id}
      
      renderItem={({item}) => (
       
        <FarmerCard
        farmer={item}
        action={() => router.push({
          pathname: `/farmer/${item.$id}`,
          params: { ...item, userID }
        })}
      />
      
        
       

      )}
      ListHeaderComponent={() =>
        (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row -mb-6">
              <View>
                <Text className="font-pmedium text-sm">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold">{user?.username}</Text> 
              </View>
              <View className="mt-1.5">
                <Image
                source={images.lgo}
                className="w-9 h-10"
                resizeMode='contain'

                 />
              </View>
            </View>
            
            <View className="w-full flex-1 pt-5 pb-8 flex-row">
              
              <InformationCard 
              title="Top Visited Location"
              info={
                <Text>
                  Text
                </Text>
              }
              />
             <InformationCard 
             
             title={<Text className="mt-[-25px] text-xl font-plight" >
             {description}
           </Text>}

              info={ 
                
                <>
                <View  >
                  
                <Text className="text-xl font-psemibold " >
                  {Math.round(temperature) + "  °C"}
                </Text>

                 <Image
                source={{ uri: `https://openweathermap.org/img/wn/${icon}@2x.png` }}
                className="w-[100px] h-[80px]  "
                resizeMode='contain'

                 />
                </View>

              
                 
                 </>
                 }
              />
             
            </View>
         

          <SearchInput />
          <View>
            <View className="flex-row" >
            <Text className="text-lg font-pregular text-black-100">
                Latest Visits
          </Text>
          <TouchableOpacity className=" ml-44" onPress={()=> router.push('/allview/visits')} > 
                  <Text className=" text-sm mt-1 text-right  font-psemibold text-blue-600" > View All </Text>
                </TouchableOpacity>
            </View>
       
          <LatestVisitCard visits={visits}  />
         
          </View>  
          
        <View className="w-full flex-1 pt-5 flex-row">
              <Text className="text-lg font-pregular text-black-100">
                Latest Farmers
              </Text>
              
               <TouchableOpacity className="ml-36" onPress={()=> router.push('/allview/farmers')} > 
                  <Text className=" text-sm mt-1 text-right  font-psemibold text-blue-600" > View All </Text>
                </TouchableOpacity>
             
            </View>
        

          </View>
        )
       }
       ListEmptyComponent={() => (
        <EmptyState 
        title="No farmer found"
        subtitle="Add a farmer to get started"
        />
       )}
       ListFooterComponent={() => (
        <View className="my-6 px-4 space-y-6 -mt-5">
        <View className="w-full flex-1  flex-row">
        <Text className="text-lg font-pregular text-black-100">
          Read Pemu
        </Text>
        
         <TouchableOpacity className="ml-44"> 
            <Text className=" text-sm mt-1 text-right  font-psemibold text-blue-600" > View All </Text>
          </TouchableOpacity>
       
       <Trending
       
        />
      </View>
      </View>
       )}

       refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      
           />
           
    </SafeAreaView>
  )
}

export default Home