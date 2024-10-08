import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { View } from '@/components/Themed';
import PostItem from '@/components/PostItem';

// Update the Post interface
interface Post {
  title: string;
  url: string;
  imageUrl: string;
  content: string;
  date: string;
}

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  function fetchPosts() {
    fetch('http://localhost:8000/results')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Posts:', data);
        // Transform the data to match your Post interface
        const transformedPosts = data.map((item: any, index: number) => ({
          id: item.url || `post-${index}`, // Use URL as ID or generate one
          title: item.title,
          image: item.imageUrl,
          description: item.content.length > 150 ? item.content.substring(0, 150) + '...' : item.content,
          link: item.url,
          date: item.date
        }));
        setPosts(transformedPosts);
      })
      .catch(error => {
        console.error('There was a problem fetching the posts:', error.message);
        console.error('Error details:', error);
      });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item, index }) => (
          <PostItem
            post={item}
            isRecent={index === 0}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});