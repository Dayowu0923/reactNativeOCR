import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

function HeadComponent(): React.JSX.Element {
    return (
            <View style={styles.topBar}>
                <View style={styles.topBarButtonContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/back.png')} style={styles.topFunLogo} />
                    </TouchableOpacity>
                </View>
                <View style={styles.logoContainer}>
                    <Image source={require('../../assets/兵整log.jpg')} style={styles.logo} />
                </View>
                <View style={styles.topBarButtonContainer}>
                    <TouchableOpacity>
                        <Image source={require('../../assets/home.png')} style={styles.topFunLogo} />
                    </TouchableOpacity>
                </View>
            </View>
    );
}
const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#E6A800',
        padding: 10,
        height: 60,
    },
    topBarButtonContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 3,
    },
    logo: {
        width: 50,
        height: 50,
    },
    topFunLogo: {
        width: 35,
        height: 35,
    },
});
export default HeadComponent;