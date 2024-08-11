import {StyleSheet, ScrollView, Modal, Text, View ,Alert,TouchableOpacity, ActivityIndicator,Image } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import { updateHarvestdetails,getFarmerHarvests, createPemuPayment, UpdateCropDebtPayment } from '../../lib/appwrite'
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { MultiSelect } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FormField from '../../components/FormField'



const CreatePayment = () => {
  
  
  const item = useLocalSearchParams();
  const {data: farmerHarvests, loading} = useAppwrite( ()=> getFarmerHarvests(item.$id));
  


  

  const [uploading, setuploading] = useState(false);
  const [harvests, setharvests] = useState([]);
  const [selectedHarvests, setselectedHarvests] = useState([]);
  const [TotalValue, setTotalValue] = useState(0);
  const [TotalDebt, setTotalDebt] = useState(0);
  const [PayableAmount, setPayableAmount] = useState(0);




   const [form, setform] = useState({
    HarvestIDs: selectedHarvests.join(','),
    amount_deducted: '0',
    amount_payed: '',
    debt_balance: '',
    CropID: '',
    farmerID: item.id,
  });
  


  useEffect(() => {
    if (farmerHarvests && Array.isArray(farmerHarvests.documents)) {
      const formattedHarvests = farmerHarvests.documents.map(harvest => {
        const date = new Date(harvest.$createdAt);
        const total = parseFloat(harvest.total_value);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        return {
          label: `Crop: ${harvest.CropID.crop_name} (Harvest Date: ${formattedDate}) Total Value: KES${harvest.total_value}\nCrop Debt: KES${harvest.CropID.debt}`,
          value: harvest.$id,
          totalValue: Number(total), 
        };
      });
      setharvests(formattedHarvests);
    }
  }, [farmerHarvests]);

  useEffect(() => {
    if (selectedHarvests.length > 0 && farmerHarvests) {
      const uniqueCropIds = new Set();

      selectedHarvests.forEach(id => {
        const matchingDocument = farmerHarvests.documents.find(doc => doc.$id === id);
        if (matchingDocument) {
          uniqueCropIds.add(matchingDocument.CropID.$id);
        }
      });

      if (uniqueCropIds.size === 1) {
        const cropId = [...uniqueCropIds][0];
        setform(prevForm => ({
          ...prevForm,
          HarvestIDs: selectedHarvests.join(','),
          CropID: cropId,
        }));
      } else {
        setform(prevForm => ({
          ...prevForm,
          HarvestIDs: '',
          CropID: '',
        }));
        Alert.alert("Invalid Selection", "Please ensure all selected harvests are of the same crop.");
      }
    }
  }, [selectedHarvests, farmerHarvests]);


  useEffect(() => {
    const totalValueSum = selectedHarvests.reduce((sum, id) => {
      const selectedHarvest = harvests.find(harvest => harvest.value === id);
      return sum + (selectedHarvest ? selectedHarvest.totalValue : 0);
    }, 0);

    const debtByCropId = {};
    const processedCropIds = new Set();

    selectedHarvests.forEach(id => {
      const matchingDocument = farmerHarvests.documents.find(doc => doc.$id === id);
      if (matchingDocument) {
        const cropId = matchingDocument.CropID.$id;
        const cropDebt = parseFloat(matchingDocument.CropID.debt);

        if (!processedCropIds.has(cropId)) {
          if (debtByCropId[cropId]) {
            debtByCropId[cropId] += cropDebt;
          } else {
            debtByCropId[cropId] = cropDebt;
          }

          processedCropIds.add(cropId);
        }
      }
    });

    const totalDebt = Object.values(debtByCropId).reduce((acc, debt) => acc + debt, 0);

    setTotalDebt(totalDebt);
    setTotalValue(totalValueSum);

    const payableAmount = totalValueSum - (form.amount_deducted ? parseFloat(form.amount_deducted) : 0);
    setPayableAmount(payableAmount);

  }, [selectedHarvests, harvests, farmerHarvests, form.amount_deducted]);
  
  //  console.log(farmerHarvests.documents[2]);
  // console.log("Total Debt:", TotalDebt);
  
  
  const submit = async () => {
    // Check if form is ready for submission
    if (!form.HarvestIDs || !form.amount_deducted) {
      return Alert.alert("Incomplete Form", "Please provide all fields");
    }
  
    // Ensure all selected harvests have the same CropID
    const uniqueCropIds = new Set();
  
    selectedHarvests.forEach(id => {
      const matchingDocument = farmerHarvests.documents.find(doc => doc.$id === id);
      if (matchingDocument) {
        uniqueCropIds.add(matchingDocument.CropID.$id);
      }
    });
  
    // If more than one unique CropID is found, prevent submission
    if (uniqueCropIds.size > 1) {
      return Alert.alert("Invalid Selection", "Please ensure all selected harvests are of the same crop before submitting.");
    }
  
    setuploading(true);
  
    try {
      const updatePromises = selectedHarvests.map(documentId => updateHarvestdetails(documentId));
      await Promise.all(updatePromises);
  
      await UpdateCropDebtPayment(form);
      await createPemuPayment(form);
      Alert.alert("Success", "Farmer Payment added successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setuploading(false);
    }
  };
  
  







  useEffect(() => {
    setform(prevForm => ({
      ...prevForm,
      HarvestIDs: selectedHarvests.join(','),
      amount_payed: PayableAmount.toString(),
      debt_balance: TotalDebt.toString(),
    }));
  }, [selectedHarvests,PayableAmount]);
  
  
  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };

  return (
 <SafeAreaView className="h-full bg-white " >
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
        Pay {item.name}
      </Text>
    </View>
   






    <View className="justify-center mt-5" >
    <Text className="ml-6 text-lg mb-[-10px] font-pregular" >Choose Harvest:</Text>
    <View style={styles.container}>
        <MultiSelect
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={harvests}
          labelField="label"
          valueField="value"
          placeholder="Select Harvest Date"
          value={selectedHarvests}
          search
          searchPlaceholder="Search..."
          onChange={item => {
            setselectedHarvests(item);
          }}
          renderLeftIcon={() => (
            <AntDesign
              style={styles.icon}
              color="black"
              name="Safety"
              size={20}
            />
          )}
          renderItem={renderItem}
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <View style={styles.selectedStyle}>
                <Text style={styles.textSelectedStyle}>{item.label}</Text>
                <AntDesign color="black" name="delete" size={17} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>

    <Text className="text-lg font-pregular ml-5 -mb-3" >Total Value Selected:</Text>
      <View className="flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-5 w-[90%] text-white border border-primary justify-center ml-5">
        <Text className="text-sm font-pregular">Total Value: </Text>
        <Text className="text-lg font-pregular text-primary">KES {TotalValue}</Text>
      </View>

      <Text className="text-lg font-pregular ml-5 -mb-3 mt-5" >Total Debt Selected:</Text>
      <View className="flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-5 w-[90%] text-white border border-red-600 justify-center ml-5">
        <Text className="text-sm font-pregular">Total Debt: </Text>
        <Text className="text-lg font-pregular text-red-600">KES {TotalDebt}</Text>
      </View>

      {TotalDebt > 0 ? (
      <FormField
        title={<Text className="text-lg font-pregular">Amount to be Deducted:</Text>}
        value={form.amount_deducted}
        placeholder="Enter Amount"
        handleChangeText={(e) => setform({ ...form, amount_deducted: e })}
        otherStyles="mt-5 w-[90%] ml-5 mb-5"
        keyboardType="number-pad"
      />
    ) : (
      <FormField
      title={<Text className="text-lg font-pregular">Amount to be Deducted:</Text>}
      value={form.amount_deducted} 
      placeholder="Famer has no debt"
      otherStyles="mt-5 w-[90%] ml-5 mb-5"
      keyboardType="number-pad"
      editable={false}
      showPlaceholderOnly={true} 
    />
    )}
<Text className="text-lg font-pregular ml-5 -mb-3" >Amount Payable:</Text>
      <View className="flex flex-row items-center p-4 bg-white shadow-md rounded-lg mt-5 w-[90%] text-white border border-primary justify-center ml-5">
        <Text className="text-sm font-pregular">Total Payable: </Text>
        <Text className="text-lg font-pregular text-primary">KES {PayableAmount}</Text>
      </View>


      <CustomButton
      title= "Add Payment"
      handlePress={submit}
      containerStyles="mt-7 mb-16"
      isLoading={uploading}
       />


  </ScrollView>
 </SafeAreaView>
  )
}

export default CreatePayment;

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
