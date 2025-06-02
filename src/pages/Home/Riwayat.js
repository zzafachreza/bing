import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TouchableNativeFeedback,
    Modal,
    TextInput,
    Alert,
    StyleSheet,
    FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { MyHeader } from '../../components';
import { Icon } from 'react-native-elements';
import QRCode from 'react-native-qrcode-svg';
import { fonts, colors } from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData, storeData } from '../../utils/localStorage';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

export default function Riwayat({ navigation, route }) {
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [editNama, setEditNama] = useState('');

    const getTransaksi = async () => {
        getData('transaksi').then(res => {
            console.log(res);
            const tmp = res ? res : [];
            setData(tmp);
        })
    };

    const simpanEdit = async () => {

        getData('transaksi').then(res => {
            let tmp = res ? res : []; // 
            let updated = [...tmp];
            updated[editIndex] = {
                ...updated[editIndex],
                nama: editNama,
                last_update: moment().format('YYYYMMDDHHmmss'),
            };

            // Simpan kembali ke localStorage
            storeData('transaksi', updated);
            setModalVisible(false);
            getTransaksi();

        })

    };




    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', getTransaksi);
        return unsubscribe;
    }, [navigation]);


    const hapusData = (index) => {
        Alert.alert(
            'Konfirmasi',
            'Yakin ingin menghapus data ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        const dataBaru = [...data];
                        dataBaru.splice(index, 1);
                        try {
                            storeData('transaksi', dataBaru);
                            getTransaksi();
                        } catch (e) {
                            Alert.alert('Gagal', 'Tidak bisa menghapus data');
                        }
                    },
                },
            ]
        );
    };

    const number_format = (x) => {

        return new Intl.NumberFormat().format(x);

    }


    const MyListData = ({ label, value }) => {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <Text style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    fontSize: 10,
                }}>{label}</Text>
                <Text style={{
                    flex: 0.1,
                    fontFamily: fonts.secondary[600],
                    fontSize: 10,
                }}>:</Text>
                <Text style={{
                    flex: 1,
                    fontFamily: fonts.secondary[600],
                    fontSize: 10,
                }}>{value}</Text>
            </View>
        )
    }

    const printPDF = async (item) => {
        const fileName = 'Transaksi_bing';

        let html = `
                 <!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Ringkasan Penjualan</title>
  <style>
 
    body{
      font-family: 'Consolas';
      background:#CDCDCD;
      padding: 0px;
      font-size: 14px;
      letter-spacing: -0.8px;
      
    }


    p{
      font-family: 'Open Sans';
      background:#FFFFFF;
      letter-spacing:1px;
    }
     .receipt {
  width: 55mm;               
  margin: auto;
  background: white;
  padding: 15px;
  border:1px solid #FAFAFAFA;

  box-sizing: border-box;
}

    h2 {
      text-align: center;
      font-size: 16px;
      margin-bottom: 20px;
    }

    .section {
      margin-bottom: 16px;
    }

    .label {
      font-weight: normal;
      display: block;
      margin-bottom: 4px;
    }

    .value {
      margin-left: 10px;
    }

    .row {
      display: flex;
      justify-content: flex-start;
      margin-bottom: 6px;
    }

    .divider {
      border: 1px solid #000000;
      
    }
  </style>
</head>
<body>
 <div class="receipt">
   
      
       <div>
       
            <center>Ringkasan Penjualan</center>
            <hr class="divider"/>
            Tanggal Bisnis:${item.tanggalBisnis}
            <br/>${item.tanggalBisnis}<br/>
           Saluran Pemesanan:${item.saluranPemesanan}<br/>
           Cara Pengambilan Makanan:<br/>
          ${item.caraPengambilanMakanan}<br/>
            <hr class="divider"/>
            Jumlah total: ${number_format(item.jumlahTotal)}<br/>
            Jumlah diskon: ${number_format(item.jumlahDiskon)}<br/>
            Jumlah Tidak Termasuk Pajak:<br/>${number_format(item.jumlahTidakTermasukPajak)}
            <hr class="divider"/>
            Jumlah pembayaran aktual:<br/>${number_format(item.jumlahPembayaranAktual)}
            <hr class="divider"/>
            Penjualan per Transaksi: ${number_format(item.penjualanPerTransaksi)}<br/>
            Nilai Transaksi Rata-rata:<br/>${number_format(item.nilaiTransaksiRataRata)}<br/>
            <hr class="divider"/>
            Ringkasan Berdasarkan<br/>
            Saluran Pesanan<br/>
            Order penjualanMenghitung<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Jumlah<br/>
            POS&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.jumlah1)}<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.pos)}<br/>
            Subtotal saluran toko<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.jumlah1)}<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.subtotalSaluranToko)}<br/>
            Total&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.jumlah1)}<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.total1)}<br/>
            <hr class="divider"/>
            Pesanan Pengembalian<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;Menghitung<br/>
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Jumlah<br/>
            Total&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.jumlah2)}&emsp;&emsp;&emsp;${item.total2}<br/>
            <hr class="divider"/>
            Ringkasan Berdasarkan<br/>
            Metode Pengambilan<br/>
            Order penjualanMenghitung
            &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;Jumlah<br/>
              Dine-in&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.jumlah3)}<br/>
              &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;${number_format(item.dineIn)}<br/>
              <hr class="divider"/>
              Detail Pajak(Total:${number_format(item.detailPajak)})
              <hr class="divider"/>
              Rincian Pembayaran(Total:<br/>${number_format(item.rincianPembayaran)})<br/>
              Tunai: ${number_format(item.tunai)}<br/>
              QRIS: ${number_format(item.qris)}<br/>
              Shopee: ${number_format(item.shopee)}<br/>
              Gojek: ${number_format(item.gojek)}<br/>
              Grab: ${number_format(item.grab)}<br/>
              <hr class="divider"/>
              Operator: ${item.operator}<br/>
              Toko: ${item.toko}<br/>
              Waktu: ${item.waktu}<br/>
            
        </div>
        
        
            


 </div>

</body>
</html>`;

        navigation.navigate('Petunjuk', {
            web: html
        })

        // try {
        //     const file = await RNHTMLtoPDF.convert({
        //         html,
        //         fileName,
        //         directory: 'Download',
        //     });

        //     await Share.open({
        //         title: 'Bagikan PDF',
        //         url: 'file://' + file.filePath,
        //         type: 'application/pdf',
        //     });
        // } catch (error) {
        //     console.error('Gagal membuat/membagikan PDF:', error);
        // }
    };


    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <MyHeader title="Riwayat Struk" />

            <FlatList data={data} renderItem={({ item, index }) => {
                return (
                    <View
                        key={index}
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 10,
                            backgroundColor: '#fafafa',
                            borderRadius: 12,
                            marginBottom: 16,
                            padding: 10,
                            borderWidth: 1,
                            borderColor: colors.primary,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 2,
                        }}>
                        <Text style={{ fontFamily: fonts.secondary[800], fontSize: 12, color: colors.primary }}>
                            {item.id}
                        </Text>
                        <Text style={styles.judul}>1. Ringkasan Penjualan</Text>
                        <MyListData label="Tanggal Bisnis" value={item.tanggalBisnis} />
                        <MyListData label="Saluran Pemesanan" value={item.saluranPemesanan} />
                        <MyListData label="Cara Pengambilan Makanan" value={item.caraPengambilanMakanan} />
                        <MyListData label="Jumlah Total" value={item.jumlahTotal} />
                        <MyListData label="Jumlah Diskon" value={item.jumlahDiskon} />
                        <MyListData label="Jumlah Tidak Termasuk Pajak" value={item.jumlahTidakTermasukPajak} />
                        <MyListData label="Jumlah Pembayaran Aktual" value={item.jumlahPembayaranAktual} />
                        <MyListData label="Penjualan per Transaksi" value={item.penjualanPerTransaksi} />
                        <MyListData label="Nilai Transaksi Rata-rata" value={item.nilaiTransaksiRataRata} />
                        <Text style={styles.judul}>2. Ringkasan Berdasarkan Saluran Pesanan</Text>
                        <Text style={styles.judul}>Order Penjualan</Text>
                        <MyListData label="Menghitung Jumlah" value={item.jumlah1} />
                        <MyListData label="POS" value={item.pos} />
                        <MyListData label="Subtotal Saluran Toko" value={item.subtotalSaluranToko} />
                        <MyListData label="Total" value={item.total1} />
                        <Text style={styles.judul}>3. Pesanan Pengembalian</Text>
                        <MyListData label="Menghitung Jumlah" value={item.jumlah2} />
                        <MyListData label="Total" value={item.total2} />
                        <Text style={styles.judul}>4. Ringkasan Berdasarkan Metode Pengambilan</Text>
                        <Text style={styles.judul}>Order Penjualan</Text>
                        <MyListData label="Menghitung Jumlah" value={item.jumlah3} />
                        <MyListData label="Dine-In" value={item.dineIn} />
                        <MyListData label="Detail Pajak" value={item.detailPajak} />
                        <MyListData label="Rincian Pembayaran" value={item.rincianPembayaran} />
                        <MyListData label="Tunai" value={item.tunai} />
                        <MyListData label="QRIS" value={item.qris} />
                        <MyListData label="Shopee" value={item.shopee} />
                        <MyListData label="Gojek" value={item.gojek} />
                        <MyListData label="Grab" value={item.grab} />
                        <MyListData label="Operator" value={item.operator} />
                        <MyListData label="Toko" value={item.toko} />
                        <MyListData label="Waktu" value={item.waktu} />



                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-end',
                                marginTop: 8,
                            }}>
                            <TouchableOpacity
                                style={{ marginRight: 12 }}
                                onPress={() => printPDF(item)}>
                                <Icon type="ionicon" name="print" size={20} color={colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => hapusData(index)}>
                                <Icon type="ionicon" name="trash" size={20} color="#FF3B30" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }}
            />


            {/* Tombol tambah di bawah */}

            {/* Modal edit */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View
                    style={{
                        flex: 1,
                        backgroundColor: '#00000088',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            backgroundColor: 'white',
                            padding: 20,
                            borderRadius: 10,
                            width: '85%',
                        }}>
                        <Text
                            style={{
                                fontFamily: fonts.primary[600],
                                fontSize: 16,
                                marginBottom: 10,
                            }}>
                            Edit Nama Petani
                        </Text>
                        <TextInput
                            value={editNama}
                            onChangeText={setEditNama}
                            placeholder="Masukkan nama baru"
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                borderRadius: 8,
                                marginBottom: 20,
                            }}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{
                                    marginRight: 10,
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                }}>
                                <Text style={{ color: '#666' }}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={simpanEdit}
                                style={{
                                    backgroundColor: colors.primary,
                                    paddingVertical: 8,
                                    paddingHorizontal: 16,
                                    borderRadius: 6,
                                }}>
                                <Text style={{ color: 'white' }}>Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    judul: {
        fontFamily: fonts.secondary[800],
        fontSize: 10,
        marginTop: 5,
    }
})
