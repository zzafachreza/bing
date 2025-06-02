import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import moment from 'moment';
import { SafeAreaView } from 'react-native';
import { colors, fonts } from '../../utils';
import { MyButton, MyCalendar, MyGap, MyHeader, MyInput } from '../../components';
import { ScrollView } from 'react-native';
import { useToast } from "react-native-toast-notifications";
import { getData, storeData } from '../../utils/localStorage';
export default function Tambah({ navigation, route }) {

    const [kirim, setKirim] = useState({
        tanggalBisnis: moment().format('YYYY-MM-DD'),
        saluranPemesanan: '',
        caraPengambilanMakanan: '',
        jumlahTotal: '',
        jumlahDiskon: '',
        jumlahTidakTermasukPajak: '',
        jumlahPembayaranAktual: '',
        penjualanPerTransaksi: '',
        nilaiTransaksiRataRata: '',
        pos: '',
        jumlah1: '',
        subtotalSaluranToko: '',
        total1: '',
        jumlah2: '',
        total2: '',
        jumlah3: '',
        dineIn: '',
        detailPajak: '',
        rincianPembayaran: '',
        tunai: '',
        qris: '',
        shopee: '',
        gojek: '',
        grab: '',
        operator: '',
        toko: '',
        waktu: moment().format('YYYY-MM-DD HH:mm:ss'), // (Tanggal dan Waktu pada saat Menginput Struk)
    });


    const toast = useToast();
    const sendData = () => {


        getData('transaksi').then(res => {
            let tmp = res ? res : [];
            let KIRIM = {
                ...kirim,
                id: 'TRX' + moment().format('YYMMDDHHmmss')
            }
            console.log(KIRIM);
            tmp.push(KIRIM); // tambahkan data baru
            storeData('transaksi', tmp);
            toast.show('Struk berhasil ditambah !', {
                type: 'success'
            });
            navigation.navigate('Riwayat')

        })
    }


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: colors.white
        }}>
            <MyHeader title="Tambah Struk" />
            <ScrollView style={{
                flex: 1,
                padding: 20,
            }}>
                <Text style={styles.judul}>1. Ringkasan Penjualan</Text>
                <MyCalendar label="Tanggal Bisnis" value={kirim.tanggalBisnis} onDateChange={x => setKirim({ ...kirim, tanggalBisnis: x })} />
                <MyInput label="Saluran Pemesanan" value={kirim.saluranPemesanan} onChangeText={x => setKirim({ ...kirim, saluranPemesanan: x })} />
                <MyInput label="Cara Pengambilan Makanan" value={kirim.caraPengambilanMakanan} onChangeText={x => setKirim({ ...kirim, caraPengambilanMakanan: x })} />
                <MyInput keyboardType='number-pad' label="Jumlah Total" value={kirim.jumlahTotal} onChangeText={x => setKirim({ ...kirim, jumlahTotal: x })} />
                <MyInput keyboardType='number-pad' label="Jumlah Diskon" value={kirim.jumlahDiskon} onChangeText={x => setKirim({ ...kirim, jumlahDiskon: x })} />
                <MyInput keyboardType='number-pad' label="Jumlah Tidak Termasuk Pajak" value={kirim.jumlahTidakTermasukPajak} onChangeText={x => setKirim({ ...kirim, jumlahTidakTermasukPajak: x })} />
                <MyInput keyboardType='number-pad' label="Jumlah Pembayaran Aktual" value={kirim.jumlahPembayaranAktual} onChangeText={x => setKirim({ ...kirim, jumlahPembayaranAktual: x })} />
                <MyInput keyboardType='number-pad' label="Penjualan per Transaksi" value={kirim.penjualanPerTransaksi} onChangeText={x => setKirim({ ...kirim, penjualanPerTransaksi: x })} />
                <MyInput keyboardType='number-pad' label="Nilai Transaksi Rata-rata" value={kirim.nilaiTransaksiRataRata} onChangeText={x => setKirim({ ...kirim, nilaiTransaksiRataRata: x })} />
                <Text style={styles.judul}>2. Ringkasan Berdasarkan Saluran Pesanan</Text>
                <Text style={styles.judul}>Order Penjualan</Text>
                <MyInput label="Menghitung Jumlah" value={kirim.jumlah1} onChangeText={x => setKirim({ ...kirim, jumlah1: x })} />
                <MyInput label="POS" value={kirim.pos} onChangeText={x => setKirim({ ...kirim, pos: x })} />

                <MyInput keyboardType='number-pad' label="Subtotal Saluran Toko" value={kirim.subtotalSaluranToko} onChangeText={x => setKirim({ ...kirim, subtotalSaluranToko: x })} />
                <MyInput keyboardType='number-pad' label="Total" value={kirim.total1} onChangeText={x => setKirim({ ...kirim, total1: x })} />
                <Text style={styles.judul}>3. Pesanan Pengembalian</Text>
                <MyInput label="Menghitung Jumlah" value={kirim.jumlah2} onChangeText={x => setKirim({ ...kirim, jumlah2: x })} />
                <MyInput keyboardType='number-pad' label="Total" value={kirim.total2} onChangeText={x => setKirim({ ...kirim, total2: x })} />
                <Text style={styles.judul}>4. Ringkasan Berdasarkan Metode Pengambilan</Text>
                <Text style={styles.judul}>Order Penjualan</Text>
                <MyInput label="Menghitung Jumlah" value={kirim.jumlah3} onChangeText={x => setKirim({ ...kirim, jumlah3: x })} />
                <MyInput label="Dine-In" value={kirim.dineIn} onChangeText={x => setKirim({ ...kirim, dineIn: x })} />
                <MyInput label="Detail Pajak" value={kirim.detailPajak} onChangeText={x => setKirim({ ...kirim, detailPajak: x })} />
                <MyInput label="Rincian Pembayaran" value={kirim.rincianPembayaran} onChangeText={x => setKirim({ ...kirim, rincianPembayaran: x })} />
                <MyInput keyboardType='number-pad' label="Tunai" value={kirim.tunai} onChangeText={x => setKirim({ ...kirim, tunai: x })} />
                <MyInput keyboardType='number-pad' label="QRIS" value={kirim.qris} onChangeText={x => setKirim({ ...kirim, qris: x })} />
                <MyInput keyboardType='number-pad' label="Shopee" value={kirim.shopee} onChangeText={x => setKirim({ ...kirim, shopee: x })} />
                <MyInput keyboardType='number-pad' label="Gojek" value={kirim.gojek} onChangeText={x => setKirim({ ...kirim, gojek: x })} />
                <MyInput keyboardType='number-pad' label="Grab" value={kirim.grab} onChangeText={x => setKirim({ ...kirim, grab: x })} />
                <MyInput label="Operator" value={kirim.operator} onChangeText={x => setKirim({ ...kirim, operator: x })} />
                <MyInput label="Toko" value={kirim.toko} onChangeText={x => setKirim({ ...kirim, toko: x })} />
                <MyInput keyboardType='number-pad' label="Waktu" value={kirim.waktu} onChangeText={x => setKirim({ ...kirim, waktu: x })} />
                <MyGap jarak={20} />
                <MyButton title="Simpan Struk" onPress={sendData} />
                <MyGap jarak={40} />

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    judul: {
        fontFamily: fonts.secondary[800],
        fontSize: 14,
        marginTop: 10,
    }
})