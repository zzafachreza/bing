import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';
import { MyButton } from '../../components';
import { Color } from '../../utils';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

export default function Petunjuk({ navigation, route }) {
  const html = route.params.web;


  const printPDF = async () => {
    const fileName = 'Transaksi_bing';




    try {
      const file = await RNHTMLtoPDF.convert({
        html,
        fileName,
        directory: 'Download',
      });

      await Share.open({
        title: 'Bagikan PDF',
        url: 'file://' + file.filePath,
        type: 'application/pdf',
      });
    } catch (error) {
      console.error('Gagal membuat/membagikan PDF:', error);
    }
  };
  return (

    <View style={{
      flex: 1,
    }}>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        source={{
          html: html
        }} style={{ flex: 1 }} />

      <View style={{
        padding: 10,
        backgroundColor: Color.white[900]
      }}>
        <MyButton title="Cetak PDF" onPress={printPDF} />
      </View>
    </View>

  )
}

const styles = StyleSheet.create({})