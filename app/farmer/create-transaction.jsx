import {StyleSheet, ScrollView, Modal, Text, View ,Alert,TouchableOpacity, ActivityIndicator,Image } from 'react-native'
import React,{useState,useEffect,useRef} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomButton from '../../components/CustomButton'
import {getAllProducts, createFarmerTransaction,getFarmerCrops,checkHelaAccount, getFarmerUnits, UpdateCropDebt } from '../../lib/appwrite'
import { useLocalSearchParams,router } from 'expo-router';
import useAppwrite from '../../lib/useAppwrite';
import { MultiSelect,Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FormField from '../../components/FormField'


const CreateTransaction = () => {
  
  const item = useLocalSearchParams();
  const { data: productsFromDB, loading } = useAppwrite(getAllProducts);
  const { data: cropsFromDB } = useAppwrite(() => getFarmerCrops(item.$id));




  const units = [
    { label: 'Liters', value: 'liters' },
    { label: 'Kilograms', value: 'kgs' }, 
    { label: 'Bucket', value: 'bkt' },
  ];
  


  
  const [methodofPayment, setMethodofPayment] = useState([
    { label: 'M-Pesa', value: 'M-Pesa' },
    { label: 'Cash', value: 'Cash' },
  ]);
  
  const [isOutgrower, setisOutgrower] = useState(false);
  const [selectedProducts, setselectedProducts] = useState(null);
  const [selectedUnits, setselectedUnits] = useState(null);
  const [selectedmethodofPayment, setselectedmethodofPayment] = useState(null);
  const [uploading, setuploading] = useState(false);
  const [products, setProducts] = useState([]);
  const [salesPrice, setsalesPrice] = useState(null);
  const [selectedProductSalesPrice, setSelectedProductSalesPrice] = useState(null);
  const [selectedCrop, setselectedCrop] = useState(null);
  
  const [farmerCrops, setFarmerCrops] = useState([]);


   const [form, setform] = useState({
    products: selectedProducts,
    quantity: '',
    amount: '',
    units:selectedUnits,
    payment_method:selectedmethodofPayment,
    Mpesa_Code:'',
    farmerID: item.$id,
    CropID: selectedCrop,
  });
  
  //get current active hela account Id



  
  useEffect(() => {
    if (item.type === "Outgrower"){
      setisOutgrower(true);
      setMethodofPayment(currentPayments => [
        ...currentPayments,
        { label: 'Hela', value: 'Hela' }
      ]);
    }
   
  }, []);




  useEffect(() => {
    // When productsFromDB updates, format data for dropdown
    const formattedProducts = productsFromDB.map(product => ({
      label: product.product_name,
      value: product.product_name,
    }));

    const formattedSalesPrices = productsFromDB.map(product => product.sales_price);

    setProducts(formattedProducts);
    setsalesPrice(formattedSalesPrices);
  }, [productsFromDB]);


  useEffect(() => {
    if (cropsFromDB && Array.isArray(cropsFromDB.documents)) {
      const formattedCrops = cropsFromDB.documents.map(crop => {
        const date = new Date(crop.planting_date);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`; // Format as DD-MM-YYYY
        return {
          label: `${crop.crop_name} (Planting Date: ${formattedDate})`,
          value: crop.$id,
        };
      });
      setFarmerCrops(formattedCrops);
    }
  }, [cropsFromDB]);


  


  // Handle change in selected product
  useEffect(() => {
    if (selectedProducts) {
      const selectedIndex = products.findIndex(product => product.value === selectedProducts);
      if (selectedIndex !== -1) {
        setSelectedProductSalesPrice(salesPrice[selectedIndex]);
      } else {
        setSelectedProductSalesPrice(null);
      }
    } else {
      setSelectedProductSalesPrice(null);
    }
  }, [selectedProducts, products, salesPrice]);


  const submit = async () => {
    if (!form.quantity || !form.units || !form.products || !form.payment_method) {
      return Alert.alert("Please provide all fields");
    }

    setuploading(true);

    try {
      if (selectedmethodofPayment === "Hela") {
        const qua = parseFloat(form.quantity);
        const salo = parseFloat(selectedProductSalesPrice);
        const value = (qua * salo).toFixed(2).toString();
        setform(prevForm => ({
          ...prevForm,
          amount: value,
         
        }));
        await createFarmerTransaction({ ...form, amount: value });
        await UpdateCropDebt({ ...form, amount: value });
        Alert.alert("Success", "Outgorwer Transaction added successfully");
        router.push("/home");
      } else {
        const qua = parseFloat(form.quantity);
        const salo = parseFloat(selectedProductSalesPrice);
        const value = (qua * salo).toFixed(2).toString();
        setform(prevForm => ({
          ...prevForm,
          amount: value,
        }));
        await createFarmerTransaction({ ...form, amount: value });
        Alert.alert("Success", "Farmer Transactions added successfully");
        router.push("/home");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setuploading(false);
    }
  };


  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.selectedTextStyle}>{item.label}</Text>
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      </View>
    );
  };


  useEffect(() => {
   
    setform(prevForm => ({
      ...prevForm,
      products: selectedProducts,
      units: selectedUnits,
      payment_method:selectedmethodofPayment,
      CropID: selectedCrop,
    
      
    }));
  }, [selectedUnits, selectedProducts,selectedmethodofPayment,selectedCrop]);



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
        Transact with {item.name}
      </Text>



    </View>

    {item.type === 'Outgrower' && (
    <View className="justify-center mt-5" >
    <Text className="ml-6 text-lg mb-[-10px] font-pregular" >Select Crop:</Text>
    <View style={styles.container}>
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={farmerCrops}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Crop"
            search
            searchPlaceholder="Search..."
            value={selectedCrop}
            onChange={item => {
              setselectedCrop(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>

     
    </View>
 )}


   
    <View className="justify-center mt-5" >
    <Text className="ml-6 text-lg mb-[-10px] font-pregular" >Select Products:</Text>
    <View style={styles.container}>
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={products}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Product"
            search
            searchPlaceholder="Search..."
            value={selectedProducts}
            onChange={item => {
              setselectedProducts(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>

     
    </View>

    <View className="justify-center mt-5" >
   <Text className="ml-6 text-lg mb-[-10px] font-pregular" >Units:</Text>
    <View style={styles.container}>
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={units}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Unit"
            searchPlaceholder="Search..."
            value={selectedUnits}
            onChange={item => {
              setselectedUnits(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>
      
    </View>
    <FormField
      title={<Text className="text-lg font-pregular" >Quantity:</Text>}
      value={form.quantity}
      placeholder="Enter Quantity"
      handleChangeText={(e) => setform({...form, quantity: e})}
      otherStyles="mt-5 w-[90%] ml-5 mb-5"
      keyboardType="number-pad"

     />   
     <View className="justify-center mt-5" >
   <Text className="ml-6 text-lg mb-[-10px] font-pregular" >Method of Payment:</Text>
    <View style={styles.container}>
    <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={methodofPayment}
            maxHeight={300}
            labelField="label"
            valueField="value"
            placeholder="Select Method"
            searchPlaceholder="Search..."
            value={selectedmethodofPayment}
            onChange={item => {
              setselectedmethodofPayment(item.value);
            }}
            renderLeftIcon={() => (
              <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
            )}
            renderItem={renderItem}
          />
      </View>
      
    </View>

    {selectedmethodofPayment === 'M-Pesa' && (
        <FormField
          title={<Text className="text-lg font-pregular">M-Pesa Code:</Text>}
          value={form.Mpesa_Code}
          placeholder="Enter M-Pesa Code"
          handleChangeText={(e) => setform({ ...form, Mpesa_Code: e })}
          otherStyles="mt-5 w-[90%] ml-5 mb-5"
        />
      )}


      <CustomButton
      title= "Add Transaction"
      handlePress={submit}
      containerStyles="mt-7 mb-16"
      isLoading={uploading}
       />
   

  </ScrollView>
 </SafeAreaView>
  )
}

export default CreateTransaction;

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
