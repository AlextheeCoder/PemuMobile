import {View,Image,TouchableOpacity ,Text,  Modal, ActivityIndicator,SafeAreaView, ScrollView,useWindowDimensions   } from 'react-native'
import{ React,useState,useEffect} from 'react'
import { useLocalSearchParams,router  } from 'expo-router';
import axios from 'axios';
import RenderHTML from 'react-native-render-html';



const BlogDetail = () => {
    const item = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await axios.get(`https://pemuagrifood.com/api/blog/post/${item.blog}`);
                setBlog(response.data.blog);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [item]);

    const htmlStyles = {
        p: {
            fontSize: 16,
            lineHeight: 24,
            
        },
        h1: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: -4,
        },
        h2: {
            marginBottom: -4,
        },
        ul: {
            fontSize: 16,
            marginBottom: -4,
        },
        img: {
            width: 300,
            marginBottom: -28,
            borderRadius: 10,
        }
      
    };

    const { width } = useWindowDimensions();

    // Only set source if blog is not null
    const source = blog ? { html: blog.content } : null;
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <Modal
                transparent={true}
                animationType={'none'}
                visible={loading}
                onRequestClose={() => { console.log('close modal') }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000040' }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </Modal>
        );
    }

    if (!blog) {
        return (
            <SafeAreaView className="min-h-[85vh]">
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text>Blog not found.</Text>
                </View>
            </SafeAreaView>
        );
    }

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
      <View className="my-6 px-4 space-y-6" >
      
        <View className="px-4 mt-10 "  >
                <View className="justify-center items-center w-full rounded-3xl " >
                <Image 
                      source={{ uri: `https://pemuagrifood.com/storage/${blog.image}` }}
                      resizeMode='cover'
                      className="w-full h-[200px] rounded-lg"
                      />
                </View>

                <View className=" justify-between flex-row  mt-3 " >
                  <View className=" justify-between flex-row  w-[45%] "> 
                     <Text className="text-sm font-psemibold text-primary " >{blog.category}</Text>
                    
                  </View>
                  <View className=" justify-between flex-row "> 
                     <Text className="text-sm font-psemibold text-secondary-100 "  > {formatDate(blog.created_at)}</Text>
                     
                  </View>
                  
                    
                </View>
          </View>

          <View className="w-full border-t border-b border-slate-300 ">
            <View className="mt-3 mb-3" >
              <Text className="text-lg font-psemibold underline text-primary" >
               {blog.title}
              </Text>
            </View>
            <View className="flex px-3" >
            <RenderHTML
                contentWidth={width}
                source={source}
                tagsStyles={htmlStyles}
            />
                   
          </View>
          </View>

      </View>
      </ScrollView>

</SafeAreaView>
  )
}

export default BlogDetail