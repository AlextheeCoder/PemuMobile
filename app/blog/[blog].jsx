import { View, Image, Text, ActivityIndicator, SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams } from 'expo-router';
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
                setLoading(false);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [item]);

    const htmlStyles = useMemo(() => ({
        p: {
            fontSize: 16,
            lineHeight: 24,
            color: '#333',
        },
        h1: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: -4,
            color: '#000',
        },
        h2: {
            fontWeight: 'bold',
            marginBottom: -4,
            color: '#000',
        },
        ul: {
            fontSize: 16,
            marginBottom: -4,
            lineHeight: 24,
            color: '#333',
        },
        img: {
            width: 300,
            marginBottom: -28,
            borderRadius: 10,
        },
        ol: {
            fontSize: 16,
            marginBottom: -4,
            marginLeft: 18,
            lineHeight: 24,
            color: '#333',
        },
    }), []);

    const { width } = useWindowDimensions();

    const source = blog ? { html: blog.content } : null;

    const formatDate = useCallback((dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }, []);

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading Blog...</Text>
            </SafeAreaView>
        );
    }

    if (!blog) {
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>Blog not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ margin: 16 }}>
                    <View style={{ alignItems: 'center', marginVertical: 16 }}>
                        <Image 
                            source={{ uri: `https://pemuagrifood.com/storage/${blog.image}` }}
                            resizeMode='cover'
                            style={{ width: '100%', height: 200, borderRadius: 10 }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600'}} className="text-primary" >{blog.category}</Text>
                        <Text style={{ fontSize: 14, fontWeight: '600'}} className=" text-secondary-100" >{formatDate(blog.created_at)}</Text>
                    </View>
                    <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 16 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700',marginBottom: 8 }} className="underline"  >
                            {blog.title}
                        </Text>
                        {source && (
                            <RenderHTML
                                contentWidth={width}
                                source={source}
                                tagsStyles={htmlStyles}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default BlogDetail;
