import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Animated,
  ImageBackground,
  ScrollView,
  Dimensions,
  TouchableNativeFeedback,
} from 'react-native';
import { getData } from '../../utils/localStorage';
import { Color, colors, fonts, windowWidth } from '../../utils';
import { TouchableOpacity } from 'react-native';



const windowHeight = Dimensions.get('window').height;

export default function Home({ navigation, route }) {
  const [user, setUser] = useState({});
  const scrollX = useRef(new Animated.Value(0)).current; // Untuk animasi scroll
  const scrollViewRef = useRef(null); // Untuk mengontrol scroll view
  const [currentIndex, setCurrentIndex] = useState(0);

  const __getUser = () => {
    getData('user').then((u) => {
      setUser(u);
    });
  };

  useEffect(() => {
    __getUser();
  }, []);


  return (
    <View

      style={{
        flex: 1,
        backgroundColor: colors.white,
        width: '100%',
        height: '100%',
      }}
    >
      <ScrollView>
        <View style={{ padding: 20 }}>
          <Text style={{
            flex: 1,
            fontFamily: fonts.primary[500],
            color: colors.primary,
            fontSize: 18
          }}>Selamat Datang</Text>
          <Image style={{
            borderRadius: 10,
            width: '100%',
            height: windowWidth,
            resizeMode: 'contain'
          }} source={require('../../assets/logo.png')} />


          <TouchableOpacity onPress={() => navigation.navigate('Tambah')} style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderWidth: 1,
            borderRadius: 10,
            borderColor: colors.primary
          }}>
            <Image style={{
              width: 100,
              height: 100,
            }} source={require('../../assets/a1.png')} />
            <Text style={{
              flex: 1,
              paddingLeft: 10,
              fontFamily: fonts.secondary[800],
              fontSize: 20,
            }}>Tambah Struk</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Riwayat')} style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderColor: colors.primary,
            borderRadius: 10,
            borderWidth: 1,
          }}>
            <Image style={{
              width: 100,
              height: 100,
            }} source={require('../../assets/a2.png')} />
            <Text style={{
              flex: 1,
              paddingLeft: 10,
              fontFamily: fonts.secondary[800],
              fontSize: 20,
            }}>Riwayat Struk</Text>
          </TouchableOpacity>


        </View>
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  judul: {
    fontFamily: fonts.secondary[800],
    fontSize: 14,
    marginTop: 10,
  }
})