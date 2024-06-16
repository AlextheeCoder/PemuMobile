import {ScrollView, Modal, Text, View ,Alert,TouchableOpacity, ActivityIndicator,Image } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { checkAllAccounts, checkHelaAccount, createHelaAccount, getActiveHelaAccount } from '../../lib/appwrite'
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import FormField from '../../components/FormField'
import InfoBox from '../../components/InfoBox';


const HelaStatus = () => {
  
  const item = useLocalSearchParams();
  const farmerID = item.$id;
  const { data: checkAccount, loading } = useAppwrite(()=>checkHelaAccount(farmerID));
 
  const { data: AccountDetails } = useAppwrite(()=>getActiveHelaAccount(farmerID));
  const { data: AllAccounts } = useAppwrite(()=>checkAllAccounts(farmerID));


    const [uploading, setuploading] = useState(false);
    const [account, setaccount] = useState();
    const [isActive, setisActive] = useState(false);
    const [initialMoney, setinitialMoney] = useState(null);
    const [remainingMoney, setremainingMoney] = useState(null);

    const [form, setform] = useState({
    accountNumber: account,
    InitialAmount: '0',
    farmerID: item.$id,
  });

  useEffect(() => {
    
    
    // Function to generate a new account number
    const generateAccountNumber = (name, existingAccounts) => {
      let baseAccountName = name.replace(/\s+/g, '') + "HELA";
      let accountCount = existingAccounts.filter(acc => acc.startsWith(baseAccountName)).length;
      return baseAccountName + String(accountCount + 1).padStart(3, '0');
    };
  
    // Check if AllAccounts is not null or undefined
    if (AllAccounts && AllAccounts.documents) {
      let existingAccountNumbers = AllAccounts.documents.map(doc => doc.accountNumber);
      let newAccountNumber = generateAccountNumber(item.name, existingAccountNumbers);
      
      setaccount(newAccountNumber);
      setform(prevForm => ({
        ...prevForm,
        accountNumber: newAccountNumber,
      }));
    }
  }, [AllAccounts]);
  
 
  useEffect(() => {
    if (checkAccount) {
      if (checkAccount.isActive) {
        setisActive(true);
      } else {
        console.log("No active Hela account found.");
        setisActive(false);
      }
    }
  
  }, [checkAccount]);

  useEffect(() => {
    const fetchHelaAccount = async () => {
      if(AccountDetails){
        setinitialMoney(AccountDetails.InitialAmount);
        setremainingMoney(AccountDetails.RemainingAmount);
      } 
    }

    fetchHelaAccount();
  
  }, [AccountDetails]);


  





  

  const submit = async () => {
    if (!form.accountNumber || !form.InitialAmount) {
      return Alert.alert("Empty Fields","Please provide all fields");
    }
    else if (isActive) {
        return Alert.alert("Active Account Detected","An Account for this farmer is Already active");
      }

    setuploading(true);
    try {
      await createHelaAccount(form);
      Alert.alert("Success", "Farmer Transactions added successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setuploading(false);
    }
  }


  if(isActive){

    return(
        <SafeAreaView className="h-full " >
            <ScrollView className="px-4 my-6" >
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center ml-36" >

                    <Image 
                    source={{uri: item?.avatar}}
                    className="w-[90%] h-[90%] rounded-lg"
                    resizeMode='cover'
                    />

            </View>
            <View className="flex items-center justify-center">
                <Text className="text-xl font-bold text-slate-500 ">
                    {item.name}'s Current Hela Status
                </Text>
            </View>
            <View className="mt-5 flex-row items-center justify-center" >
                    <InfoBox 
                    title={initialMoney}
                    subtitle="Intial Amount"
                    containerStyles="mr-10"
                    titleStyles="text-xl"
                    />
                 
                    <InfoBox 
                    title={remainingMoney !== null ? remainingMoney : '-'}
                    subtitle="Remaining Amount"
                    titleStyles="text-xl"
                    />
            </View>

            <CustomButton
                title="Close Account"
                containerStyles="w-[45%] mt-5 rounded-lg bg-red-600 ml-[85px]"
                />

  
   
   
            </ScrollView>
      </SafeAreaView>
    )
  }



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
        Register {item.name} for Hela
      </Text>
    </View>

    <FormField
      title={<Text className="text-lg font-pregular" >Set Initial Amount:</Text>}
      value={form.InitialAmount}
      placeholder="Enter Initial Amount"
      handleChangeText={(e) => setform({...form, InitialAmount: e})}
      otherStyles="mt-5 w-[90%] ml-5 mb-5"
      keyboardType="number-pad"

     /> 

        <CustomButton
            title= "Create Hela Account"
            handlePress={submit}
            containerStyles="mt-7 mb-10"
            isLoading={uploading}
            />
   
   
  </ScrollView>
 </SafeAreaView>
  )
}

export default HelaStatus;


