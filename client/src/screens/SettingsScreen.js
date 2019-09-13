import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import firebase from 'react-native-firebase';

export default function SettingsScreen(props) {
  // Intial State
  const [user, setUser] = useState(null);
  // Firebase References
  const postsRef = firebase.database().ref('posts/');
  const usersRef = firebase
    .database()
    .ref('people/')
    .child('users/');

  //Event Handlers
  useEffect(() => {
    console.log('useEffect triggered');
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      setUser(user);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const removeFromUsersDB = () => {
    usersRef
      .orderByChild('username')
      .equalTo(user.displayName)
      .once('value', snapshot => {
        snapshot.forEach(data => {
          const removeRef = usersRef.child(data.key);
          removeRef
            .remove()
            .then(() => {
              removeFromPostsDB();
            })
            .catch(err => {
              console.log(err);
            });
        });
      });
  };

  const removeFromPostsDB = () => {
    postsRef
      .orderByChild('username')
      .equalTo(user.displayName)
      .once('value', snapshot => {
        snapshot.forEach(data => {
          const removeRef = postsRef.child(data.key);
          removeRef
            .remove()
            .then(() => {})
            .catch(err => {
              console.log(err);
            });
        });
        deleteUser();
      });
  };

  const deleteUser = () => {
    user
      .delete()
      .then(() => {
        props.navigation.navigate('phone');
      })
      .catch(err => {
        console.log(err);
        signOut();
      });
  };

  const signOut = () => {
    firebase.auth().signOut();
    console.log('Signed Out !');
    props.navigation.navigate('phone');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={removeFromUsersDB}>
        <Text style={styles.ButtonText}>Delete Account</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.ButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  button: {
    height: 50,
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderColor: 'red',
    borderWidth: 2,
    marginTop: 25,
    marginBottom: 25,
  },
  ButtonText: {
    color: '#808B96',
    fontSize: 18,
    fontFamily: 'Roboto',
  },
  image: {
    height: 20,
    width: 20,
    backgroundColor: 'pink',
  },
});
