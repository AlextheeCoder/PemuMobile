import {View,Modal, ActivityIndicator} from 'react-native'
import { React,useState,useEffect} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import useAppwrite from '../../lib/useAppwrite';
import AllBlogsCard from '../../components/AllBlogsCard';
import axios from 'axios';




const AllBlogs = () => {

  
  const [blogs, setBlogs] = useState([]);
  const [loading, setloading] = useState(true);


  useEffect(() => {

    axios.get('https://pemuagrifood.com/api/blogs')
      .then(response => {
       
        setBlogs(response.data.blogs);
        setloading(false);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);





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
      <AllBlogsCard blogs={blogs} />
    </SafeAreaView>
  )
}

export default AllBlogs