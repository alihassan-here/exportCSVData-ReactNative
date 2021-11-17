import React, { useState } from 'react';
import { DataTable } from 'react-native-paper';
import XLSX from 'xlsx';
import FileViewer from 'react-native-file-viewer';
import {
  SafeAreaView,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  Text,
  View,
  Platform,
  Button,
} from 'react-native';

import { writeFile, readFile, DocumentDirectoryPath, DownloadDirectoryPath } from 'react-native-fs';
//ANDROID 
var DDP = `${DownloadDirectoryPath}/`;
//IOS

const input = res => res;
const output = str => str;

const App = () => {
  let [stateData, setStateData] = useState([
    { "Name": "John", "City": "Lahore", "Tech": "React Native" },
    { "Name": "Smith", "City": "Islamabad", "Tech": "React Js" },
    { "Name": "Michael", "City": "Faisalabad", "Tech": "NodeJs" },
    { "Name": "Brad", "City": "Karachi", "Tech": "Django" },
    { "Name": "Stephen", "City": "Sialkot", "Tech": "ROR" },
  ]);
  const [filePath, setFilePath] = useState('')

  const requestRunTimePermission = () => {

    const externalStoragePermission = async (DDP) => {
      try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
          title: 'External Storage Write Permission',
          message: 'App needs access to storage data.',
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        });
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          exportFile(DDP);
        } else {
          alert("write external storage prmission denied");
        }
      } catch (err) {
        Alert.alert("Write Permission err", err)
        console.warn(err);
      }
    }
    if (Platform.OS === 'android') {
      DDP = `${DownloadDirectoryPath}/`
      externalStoragePermission(DDP);
    } else {
      DDP = `${DocumentDirectoryPath}/`;
      exportFile(DDP);
    }
  }
  const exportFile = (DDP) => {
    try {
      const ws = XLSX.utils.json_to_sheet(stateData);

      //BUILD NEW WORKBOOK
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "SheetJs");

      //WRITE FILE
      const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx', cellStyles : true });
      const file = `${DDP}sheetjsx.xlsx`;
      setFilePath(file);
      // console.log(file)
      writeFile(file, output(wbout), 'ascii').then(res => {
        console.log("success");
        Alert.alert("Success", "Exported to " + file);
      }).catch(err => { Alert.alert("Error", err.message); })
    } catch (error) {
      console.log(error)
    }
  }
  const previewFile = async () => {
    try {
      // readFile(filePath, 'ascii').then((res) => {
      //   /* parse file */
      //   console.log(res)
      //   const wb = XLSX.read(res, { type: 'binary' });
        
      //   /* convert first worksheet to AOA */
      //   const wsname = wb.SheetNames[0];
      //   const ws = wb.Sheets[wsname];
      //   const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      //   console.log(data)

      //   /* update state */
      //   // this.setState({ data: data, cols: make_cols(ws['!ref']), widthArr: make_width(ws['!ref']) });

      // }).
      //   catch((err) => { Alert.alert("importFile Error", "Error " + err.message); });
// console.log("file:///"+filePath)
      // FileViewer.open(filePath,{showOpenWithDialog:true})
      //   .then(() => {
      //     console.log('congrats')
      //   })
      //   .catch(error => {
      //     // throw error
      //   });
      // const content = await readFile(setFilePath, "ascii");

      // this.setState({ singleFileOBJ: res });
      // console.log(res[0].name)
      // console.log(res[0].size)
      // console.log(res[0].uri)
      // const wb = XLSX.read(input(content), { type: 'binary' });

      // /* convert first worksheet to AOA */
      // const wsname = wb.SheetNames[0];
      // const ws = wb.Sheets[wsname];
      // const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      // // console.log(data)
      // this.setState({ data: data, cols: make_cols(ws['!ref']), widthArr: make_width(ws['!ref']) });

    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        Alert.alert('Canceled');
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  }



  const DataTablehere = () => (
    <DataTable style={{ borderWidth: 2, borderColor: '#ffffff', borderRadius: 5, borderStyle: 'dashed', }}>
      <DataTable.Header style={{ backgroundColor: '#dddddd', }}>
        <DataTable.Title><Text style={styles.headerFont}>Name</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.headerFont}>City</Text></DataTable.Title>
        <DataTable.Title numeric><Text style={styles.headerFont}>Tech</Text></DataTable.Title>
      </DataTable.Header>
      {
        stateData.map((item, index) => (
          // console.log(item.City)
          <DataTable.Row key={index}>
            <DataTable.Cell><Text style={[styles.bodyColor]}>{item.Name}</Text></DataTable.Cell>
            <DataTable.Cell numeric><Text style={styles.bodyColor}>{item.City}</Text></DataTable.Cell>
            <DataTable.Cell numeric><Text style={styles.bodyColor}>{item.Tech}</Text></DataTable.Cell>
          </DataTable.Row>
        ))
      }

    </DataTable>
  )

  return (
    <SafeAreaView>
      <View style={styles.sectionContainer}>
        <Text style={{ fontSize: 25, color: 'green', fontWeight: 'bold' }}>Sheet Current Data</Text>
        {/* DATATABLE HERE */}
        {<DataTablehere />}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '80%', backgroundColor: '#E6EAED', padding: 10, borderRadius: 5, borderWidth: 1 }}>
          <Button title="Preview Data" disabled={!(filePath !== "")} onPress={previewFile} color="green" />
          <Button title="Export Data" onPress={requestRunTimePermission} color="#0079CA" />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  headerFont: {
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default App;
