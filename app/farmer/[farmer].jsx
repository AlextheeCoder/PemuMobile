import {View,Image,TouchableOpacity ,Text,  Modal, ActivityIndicator ,ScrollView ,FlatList} from 'react-native'
import { React,useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import InfoBox from '../../components/InfoBox';
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import CustomButton from '../../components/CustomButton'
import { getFarmerById, getFarmerDetails,getFarmerTransactions,getFarmerVisits, getFarmerCrops} from '../../lib/appwrite';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE,Polygon } from 'react-native-maps';
import TransactionCard from '../../components/TransactionCard';



const Farmer = () => {

  const item = useLocalSearchParams();
  const userID=item.userID;
  const {data: visits, loading} = useAppwrite( ()=> getFarmerVisits(item.$id));
  const {data: transactiondata} = useAppwrite( ()=> getFarmerTransactions(item.$id));
  const {data: useid} =useAppwrite(()=> getFarmerById(item.$id))
  const { data: cropsFromDB } = useAppwrite(() => getFarmerCrops(item.$id));
  const checker = useid && useid.users ? useid.users.$id : null;


  const [transactions, setTransactions] = useState([]);
  const[visit,setvisit] = useState(0);
  const [checkifEqual, setcheckifEqual] = useState(false);
  const [showTouchableOpacity, setShowTouchableOpacity] = useState(false);
  const [locationModalVisoble, setlocationModalVisoble] = useState(false);
  const [formatedCoords, setformatedCoords] = useState([]);
  const [isOutgrower, setisOutgrower] = useState(false);
  const [farmerCrops, setFarmerCrops] = useState([]);
  const [transactionscount, settransactionscount] = useState(0);




  useEffect(() => {
    if (userID === checker) {
      setcheckifEqual(true);
    };

    if (item.type === "Outgrower"){
      setisOutgrower(true);
    }
  
    setvisit(visits.length);
   
  }, [userID, checker]);

  
  
  useEffect(() => {
    const fetchTransactions = async () => {
        if (transactiondata && transactiondata.documents) {
            setTransactions(transactiondata.documents);
            settransactionscount(transactiondata.documents.length);
        }
    }
    fetchTransactions();
}, [transactiondata]);


 



  useEffect(() => {
    if (cropsFromDB && Array.isArray(cropsFromDB.documents)) {
      const formattedCrops =  cropsFromDB.documents.map(crop => {
        const date = new Date(crop.planting_date);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; // Format as DD-MM-YYYY
        return {
          label: `${crop.crop_name} ( ${formattedDate})`,
          value: crop.$id,
        };
      });
      setFarmerCrops(formattedCrops);
    }
  }, [cropsFromDB]);



  return (
    <SafeAreaView  className="min-h-[85vh]" >
        <Modal
        transparent={true}
        animationType={'none'}
        visible={loading}
        onRequestClose={() => { console.log('close modal') }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
      <ScrollView>

      <View className="w-full justify-center items-center mt-6 mb-12 px-4" >
         
         <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center" >

          <Image 
            source={{uri: item?.avatar}}
            className="w-[90%] h-[90%] rounded-lg"
            resizeMode='cover'
          />
          
         </View>
         <InfoBox 
          title={item.name}
          containerStyles="mt-5"
          titleStyles="text-lg"
         />
         <View className="mt-5 flex-row" >
         <InfoBox 
          title={item.location}
          subtitle="Location"
          containerStyles="mr-10"
          titleStyles="text-xl"
         />
          <InfoBox 
          title={visit}
          subtitle="Visits Made"
          titleStyles="text-xl"
         />
          <InfoBox 
          title={transactionscount ?? 0}
          containerStyles="ml-10"
          subtitle="Transactions"
          titleStyles="text-xl"
         />
         </View>

     </View>
     <View>
      
      <View className="justify-center items-center mt-[-10px] " >
      {/* {showTouchableOpacity && (
        <TouchableOpacity  onPress={() => setlocationModalVisoble(true)} >
          <Text className="text-lg text-blue-600 font-pregular mt-[-15px]">
            View on Map
          </Text>
        </TouchableOpacity>
      )} */}

        {checkifEqual && (
          <View>
 <View className="flex-row justify-between">
    <CustomButton
      title="Add Crop"
      containerStyles="w-[45%] mt-5 mr-3 rounded-lg bg-green-600"
      handlePress={() =>
        router.push({
          pathname: `farmer/add-crop`,
          params: { ...item, id: item.$id },
        })
      }
    />

    <CustomButton
      title="Visit Farmer"
      containerStyles="w-[45%] mt-5 rounded-lg bg-secondary"
      handlePress={() =>
        router.push({
          pathname: `/farmer/create-vist`,
          params: { ...item, id: item.$id },
        })
      }
    />
   
  
  </View>
  <View className="flex-row justify-between" >
  <CustomButton
      title="Record Transaction"
      containerStyles="w-[50%] mt-5 rounded-lg bg-blue-500"
      handlePress={() =>
        router.push({
          pathname: `/farmer/create-transaction`,
          params: { ...item, id: item.$id },
        })
      }
    />
    {isOutgrower && (
        <CustomButton
          title="Add Unit"
          containerStyles="w-[45%] mt-5 rounded-lg bg-green-300"
          handlePress={() =>
            router.push({
              pathname: `/farmer/create-unit`,
              params: { ...item, id: item.$id },
            })
          }
        />
    )}
  </View>
  


  
  </View>
 
)}


      </View>

    
        
        {/* View crops grown */}
        <View className="w-full border-t border-b border-slate-300 mt-10">
            <View className="mt-3 mb-3 ml-5" >
              <Text className="text-sm font-psemibold" >
               Crops Grown
              </Text>
            </View>
          
            <View className="flex-row flex-wrap mb-4 ml-5">
            {farmerCrops.length > 0 ? (
              farmerCrops.map((crop, index) => (
                <Text
                  key={index}
                  className="text-sm px-2 py-1 rounded-full bg-green-100 text-green-800 mx-1 my-1"
                >
                  {crop.label}
                </Text>
              ))
            ) : (
              <Text>No Crops found</Text>
            )}
          </View>

          </View>

    {/* View Treatments used */}
   
           {/* View Farmer Transactions */}
        <View className="w-full  border-b border-slate-300 mb-20">
            <View className="mt-3 mb-3 ml-5" >
              <Text className="text-sm font-psemibold" >
             {item.name}'s Transactions
              </Text>
            </View>
            <View>
              
            <View className="flex-row flex-wrap mb-4 ml-3 justify-center items-center" >
                  <View className="w-[40%]" > 
                    <Text className="mr-3 text-sm font-psemibold underline">Product</Text>
                  </View>
                  <View className="w-[30%]" > 
                  <Text className="mr-3 text-sm font-psemibold underline">Amount</Text>
                  </View>
                  <View className="w-[30%]" > 
                  <Text className="mr-3 text-sm font-psemibold underline">Method</Text>
                  </View>
                </View>
                { transactions && transactions.length === 0 ? (
                  <Text className="ml-5 mb-1" >No transactions yet.</Text>
                ) : (
                  transactions && transactions.map((transaction) => (
                    <View key={transaction.$id} className="flex-row flex-wrap mb-4 ml-3 justify-center items-center">
                      <View className="w-[40%]">
                        <Text className="mr-3 text-sm font-pregular">{transaction.product_name}</Text>
                      </View>
                      <View className="w-[30%]">
                        <Text className="mr-3 text-sm font-pregular text-green-600">KES {transaction.amount}</Text>
                      </View>
                      <View className="w-[30%]">
                        <Text className="text-sm px-2 py-1 rounded-lg bg-secondary-100 text-white mx-1 my-1">{transaction.payment_method}</Text>
                      </View>
                    </View>
                  ))
                )}


          

              
        </View>
          
          </View>

   

      

          
      

     </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default Farmer



