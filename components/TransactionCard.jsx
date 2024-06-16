import { View, Text} from 'react-native'
import React from 'react'



const TransactionCard = ({transaction: {product_name, amount, payment_method}}) => {
  console.log("Card::", transaction);
  return (
    <View className="flex-row flex-wrap mb-4 ml-5" >
    <Text className="mr-3">{product_name}</Text>
    <Text className="mr-3">{amount}</Text>
    <Text className="mr-3">{payment_method}</Text>
</View>
   
  )
}

export default TransactionCard