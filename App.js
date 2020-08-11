import 'react-native-get-random-values';
import React from 'react';
import {
  StyleSheet,
  View,
  RefreshControl,
  Image,
  Dimensions,
  ScrollView, Text, BackHandler
} from 'react-native';
import ProgressWebView from "react-native-progress-webview";
const windowHeight = Dimensions.get('window').height;

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      refreshing: false,
      isLoadingError: false,
      CanGoBack: false
    }
    this.WEBVIEW_REF = React.createRef();
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton = () => {
    const { CanGoBack } = this.state;
    if (CanGoBack) {
      this.WEBVIEW_REF.current.goBack();
      return true;
    } else {
      return false;
    }

  }
  refreshWebview = () => {
    this.WEBVIEW_REF.reload();
  }
  onRefresh = () => {
    this.setState({ refreshing: true })

    this.WEBVIEW_REF.current.reload();
    this.setState({ refreshing: false, isLoadingError: false })
  };

  RenderErrorScreen = () => {

    const { refreshing } = this.state;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={this.onRefresh} />
        }
        style={[styles.container, { backgroundColor: 'white', }]}>
        <View style={styles.viewStyles}>
          <Image
            source={require('./assets/images/offline.png')}
            style={styles.Errorlogo}
            resizeMode="contain"
          />
          <Text style={styles.fail} >Connection failed, Please try again!</Text>
        </View>

      </ScrollView>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {
          this.state.isLoadingError ? this.RenderErrorScreen() : null
        }
        <ProgressWebView
          style={styles.map}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          geolocationEnabled={true}
          javaScriptEnabled={true}
          ref={this.WEBVIEW_REF}
          startInLoadingState={true}
          renderLoading={() => (
            <SplashScreen />
          )}
          onError={() => this.setState({ isLoadingError: true })}
          source={{ uri: 'https://www.buymall.com.mm/shop' }}
          onNavigationStateChange={navState => {
            this.setState({ CanGoBack: navState.canGoBack })
          }}
        />
      </View>
    );
  }
}
class SplashScreen extends React.Component {
  render() {
    return (
      <View style={styles.viewStyles}>
        <Image
          source={require('./assets/images/loader.gif')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: windowHeight
  },

  container: {
    zIndex: 1,
    minHeight: '100%',
    flex: 1,
  },
  viewStyles: {
    flex: 1,
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#fff"
  },
  Errorlogo: {
    maxWidth: 250
  },
  logo: {
    maxWidth: "100%"
  },
  fail: {
    top: '65%',
    fontSize: 12,
    position: "absolute",
    color: "#666"
  }
});

