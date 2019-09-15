import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import LoadingIndicator from './LoadingIndicator';
import YouTubeVideo from './VideoUploadComponents/YouTubeVideo';

const { width } = Dimensions.get('window');
const videoHeight = width * 0.6;

const UserProfileHeader = props => {
  const { user, userData, userKey } = props;
  // Initial State
  const [isLoaded, setIsLoaded] = useState(null);
  const [bio, setBio] = useState(null);
  const [videoExists, setVideoExists] = useState(null);
  // Event Handlers
  const editButtonPress = () => {
    props.navigation.navigate('Settings');
  };

  const navigateToVideo = () => {
    props.navigation.navigate('Video', {
      user,
      currentUser: userData,
      userKey,
    });
  };

  useEffect(() => {
    if (userData.bio) {
      setBio(userData.bio);
    }
    if (userData.youtubeURL) {
      setVideoExists(true);
    }
    setIsLoaded(true);
    return () => {
      setIsLoaded(false);
      console.log('user Profile Feed Header unmounted');
    };
  }, []);

  return (
    <View>
      {!isLoaded && <LoadingIndicator />}
      {isLoaded && (
        <View style={styles.container}>
          <View style={styles.viewOne}>
            {videoExists ? (
              <YouTubeVideo
                key={userKey}
                style={{ height: '100%', width: '100%' }}
                url={userData.youtubeURL}
                startTime={userData.startTime}
              />
            ) : (
              <Avatar
                size="large"
                icon={{ name: 'md-add-circle', type: 'ionicon', size: 72 }}
                containerStyle={{
                  height: '100%',
                  width: '100%',
                }}
                onPress={navigateToVideo}
              />
            )}
          </View>
          <View style={styles.viewTwo}>
            <View style={styles.viewThree}>
              <Text style={styles.username}>{'@' + user.displayName}</Text>
              <Avatar
                rounded
                size={100}
                source={{
                  uri: user.photoURL,
                }}
                containerStyle={styles.avatar}
              />
            </View>
            <View style={styles.viewFour}>
              <Text style={{ fontSize: 16 }}> Followers: </Text>
              <Text style={styles.followCount}>{userData.followersCount}</Text>
              <Text style={{ fontSize: 16, paddingLeft: 15 }}>Following:</Text>
              <Text style={styles.followCount}>{userData.followingCount}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={editButtonPress}
            >
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
            <Text style={styles.bioText}>{bio}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default withNavigation(UserProfileHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    flex: 1,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 14,
  },
  viewOne: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: videoHeight,
    width: '100%',
    flex: 1,
  },
  viewTwo: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 3,
    paddingLeft: 15,
    paddingRight: 10,
    height: '100%',
    width: '100%',
  },
  viewThree: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    height: '100%',
    width: '100%',
    flex: 1,
  },
  username: {
    fontSize: 20,
    color: 'black',
    marginTop: 10,
    position: 'absolute',
    left: 0,
    fontWeight: 'bold',
  },
  viewFour: {
    marginTop: 45,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
  },
  followCount: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'Roboto',
  },
  editButton: {
    color: 'red',
    height: 30,
    width: '35%',
    backgroundColor: 'orangered',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12.5,
    borderRadius: 15,
    marginBottom: 10,
  },
  editText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  bioText: {
    color: 'black',
    fontSize: 16,
    paddingRight: 10,
  },
  avatar: {
    position: 'absolute',
    right: 0,
    marginTop: 10,
  },
});
