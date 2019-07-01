import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableHighlight } from 'react-native';
import firebase from 'react-native-firebase';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
// import HeartRed from '../components/heartRed';

export default function Post(props) {
  const { item, user, handleLikePress } = props;
  const postsRef = firebase.database().ref('posts/');
  const [liked, setHasLiked] = useState(null);
  const [likeCounter, setLikeCounter] = useState(null);

  useEffect(() => {
    console.log('useEffect on INDIVIDUAL POSTS');

    const heartRef = postsRef
      .child(item.key)
      .child('usersLiked')
      .orderByChild('user_name')
      .equalTo(user.displayName)
      .once('value')
      .then(snapshot => {
        setHasLiked(snapshot.val());
        setLikeCounter(item._value.likes);
      });
  }, [handleLocalLikePress]);

  const handleLocalLikePress = item => {
    handleLikePress(item, item.key);
    if (liked) {
      setHasLiked(null);
      const counter = likeCounter - 1;
      setLikeCounter(counter);
    } else {
      setHasLiked(true);
      const positivecounter = likeCounter + 1;
      setLikeCounter(positivecounter);
    }
  };

  return (
    <View style={styles.tweet}>
      <View style={styles.firstContainer}>
        <TouchableHighlight underlayColor="white" activeOpacity={0.75}>
          <View>
            <Avatar
              source={{
                uri: item._value.userPhoto,
              }}
              rounded
              size={60}
            />
          </View>
        </TouchableHighlight>
      </View>
      <View style={styles.secondaryContainer}>
        <View style={styles.usernameContainer}>
          <Text style={styles.usernameText}>{item._value.username}</Text>
        </View>
        <View style={styles.tweetBodyContainer}>
          <Text style={styles.tweetText}>{item._value.text}</Text>
        </View>
        <View style={styles.footerContainer}>
          <TouchableHighlight>
            <View style={styles.iconContainer}>
              <Icon name="md-chatboxes" size={20} />
              <Text style={styles.badgeCount}>{item._value.comments}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight>
            <View style={styles.iconContainer}>
              <Icon name="md-repeat" size={20} />
              <Text style={styles.badgeCount}>{item._value.retweets}</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight>
            <View style={styles.iconContainer}>
              {liked && (
                <Icon
                  name="ios-heart"
                  size={25}
                  color="red"
                  onPress={() => handleLocalLikePress(item)}
                />
              )}
              {!liked && (
                <Icon
                  name="ios-heart-empty"
                  size={25}
                  onPress={() => handleLocalLikePress(item)}
                />
              )}
              <Text style={styles.badgeCount}>{likeCounter}</Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  firstContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: '#8acafe',
  },
  secondaryContainer: {
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingLeft: 5,
    // backgroundColor: '#cccccc',
  },
  usernameText: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  tweet: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 5,
    paddingRight: 15,
    borderBottomColor: 'red',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // flex: 1,
  },
  tweetText: {
    marginTop: 1,
    fontSize: 17,
    color: '#555',
  },
  tweetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flex: 1,
    backgroundColor: '#ff3333',
  },
  usernameContainer: {
    // backgroundColor: '#ff7f50', // light orange
    height: '100%',
    width: '100%',
    flex: 1,
  },
  tweetBodyContainer: {
    // backgroundColor: '#00ff00', // lime green
    height: '100%',
    width: '100%',
    flex: 1,
  },
  footerContainer: {
    // backgroundColor: 'red',
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 5,
    flex: 1,
    justifyContent: 'space-evenly',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'purple',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  badgeCount: {
    fontSize: 16,
    paddingLeft: 7,
  },
});