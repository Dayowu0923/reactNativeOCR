
import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
import { launchCamera } from 'react-native-image-picker';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import openDatabaseConnection from '../../utils/db.ts';
import RNFS from 'react-native-fs';

function IndexComponent(): React.JSX.Element {
    const [image, setImage] = useState("")
    const [newText, setnewText] = useState()
    const [time, setTime] = useState()
    const downloadDir = RNFS.DownloadDirectoryPath;
    const filePath = `${downloadDir}/example1.txt`;
    const db = openDatabaseConnection();
  
    db.transaction((tx) => {

        
        tx.executeSql('SELECT * FROM tbSoldier', [], (tx, results) => {
          const rows = results.rows;
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            data.push(rows.item(i))
          }
          console.log(data)
          RNFS.writeFile(filePath, JSON.stringify(data), 'utf8', { append: false })
  .then(() => {
    console.log('成功:', filePath);
  })
  .catch((error) => {
    console.error('錯誤:', error);
  });
        })
    });
    console.log(filePath)







    const openCamera = async () => {
        let result = await launchCamera({ mediaType: 'photo' });
        if (result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    const recognitionText = async () => {
        if (image != "") {
            const result = await TextRecognition.recognize(image)
            if (result != undefined) {
                let dateTimeArray = extractDateTime(result.text);
                let txtID = extractPatternsWithNewline(result.text);
                let timetxt = ""
                if (dateTimeArray != null) {
                    setTime(dateTimeArray[0])
                    timetxt = dateTimeArray[0];
                }
                else {
                    if (extractDateTimeSim(result.text) != null && extractDateTimeSimT(result.text) != null)
                    {
                        setTime(extractDateTimeSim(result.text) + " " + extractDateTimeSimT(result.text))
                        timetxt = extractDateTimeSim(result.text) + " " + extractDateTimeSimT(result.text);
                    }
                    else
                    {
                        setTime("")
                        timetxt = "";
                    }
                       
                }

                if (txtID != undefined && timetxt!= "")
                {
                    setnewText(extractPatternsWithNewline(result.text.toUpperCase()))
                }
                else
                {
                    setnewText("")
                    Alert.alert(
                        '辨識錯誤',
                        '請重新拍一張!',
                        [{
                            text: '確定', 
                            onPress: () => openCamera()
                        }]);
                }   
            }
        }
    }
    //正規表達判斷是否符合一個字母加九個數字
    const extractPatterns = (str) => {
        var pattern = /[a-zA-Z][0-9]{9}/g;
        var matches = str.match(pattern);

        if (matches !== null) {
            return matches;
        } else {
            return null;
        }
    }

    //日期 + 時間
    const extractDateTime = (text) => {
        var regex = /^\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/gm;
        var matches = text.match(regex);
        return matches;
    }
    //月份+日期 MM/dd
    const extractDateTimeSim = (text) => {
        var regex = /^\d{2}\/\d{2}$/gm;
        var matches = text.match(regex);
        return matches;
    }
    //HH:mm:ss
    const extractDateTimeSimT = (text) => {
        var regex = /^\d{2}:\d{2}:\d{2}$/gm;
        var matches = text.match(regex);
        return matches;
    }


    const extractPatternsWithNewline = (str) => {
        var lines = str.split("\n");
        var extractedPatterns = [];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            var extracted = extractPatterns(line);
            if (extracted !== null) {
                extractedPatterns.push(...extracted);
            }
        }
        return extractedPatterns[0];
    }

    useEffect(() => {
        if (image !== "") {
            recognitionText();
        }
    }, [image]);

    return (
            <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
                <View style={styles.container}>
                    <TouchableOpacity style={styles.child} onPress={openCamera}>
                        <Image source={require('../../assets/FUN1.jpg')} style={styles.FunLogo} />
                        <Text style={styles.txt}>安檢掃描</Text>
                    </TouchableOpacity>
                    <View style={styles.child}>
                      
                    </View>
                    <View style={styles.child}>
                       
                    </View>
                   
                </View>
                <View><Text>{newText}</Text></View>
                <View><Text>{time}</Text></View>
            </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    FunLogo: {
        width: 100,
        height: 100,
    },
  

    child: {
        width: '50%',
        alignItems: 'center',
        marginTop : 20,
      
    },
    txt :{
        marginTop: 10,
        color:'black',
        textAlign: 'center',
    }
});

export default IndexComponent;