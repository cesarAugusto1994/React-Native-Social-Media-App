import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  Modal,
  TextInput,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import firebase from 'react-native-firebase';

const { width } = Dimensions.get('window');

export default function HomeFeedHeader(props) {
  // Intial State
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [tweet, setTweet] = useState(null);
  const [username1, setUsername] = useState(null);

  // Firebase Reference
  const dataRef = firebase.database().ref('posts/');

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUsername(user.displayName);
        setProfilePhoto(user.photoURL);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const openPostModal = () => {
    setModalOpen(true);
  };

  const writeUserData = () => {
    dataRef
      .push({
        text: tweet,
        username: username1,
        userPhoto: profilePhoto,
        likes: 0,
        comments: 0,
        retweets: 0,
        usersLiked: {},
      })
      .then(data => {
        console.log('data ', data);
      })
      .catch(error => {
        console.log('error ', error);
      });
  };

  return (
    <View style={styles.container}>
      <Avatar
        rounded
        size={55}
        source={{
          uri: profilePhoto,
        }}
        containerStyle={{
          position: 'absolute',
          left: 0,
          marginTop: 10,
          marginLeft: 10,
          marginBottom: 10,
        }}
      />
      <TouchableOpacity style={styles.messageButton} onPress={openPostModal}>
        <Text style={styles.messageButtonText}>What's on your mind?</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
        }}
      >
        <View
          style={{
            height: '100%',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Avatar
            rounded
            size={150}
            source={{ uri: profilePhoto }}
            // icon={{ name: 'ios-camera', type: 'ionicon' }}
          />
          <TextInput
            placeholder="What's on your mind?"
            onChangeText={input => setTweet(input)}
          />
          <TouchableOpacity
            style={styles.messageButton}
            onPress={writeUserData}
          >
            <Text style={styles.messageButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: '100%',
    width: '100%',
    flex: 1,
    paddingBottom: 20,
    paddingLeft: 10,
  },
  messageButton: {
    height: 45,
    width: width * 0.7,
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 25,
    marginTop: 15,
    borderColor: '#808B96',
    borderWidth: 1,
    marginLeft: 65,
    paddingLeft: 20,
  },
  messageButtonText: {
    color: '#808B96',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
});
