/* eslint-disable react/react-in-jsx-scope */
/**
 * @format
 */

import {AppRegistry, View, ActivityIndicator} from 'react-native';
import App from './Nav';
import TrackPlayer from 'react-native-track-player';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';
import {themeStore} from './src/store';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loadTheme} from './src/slice';
import { playbackService } from './src/Tracker/trackPlayerServices';

AppRegistry.registerComponent(appName, () => ProviderContainer);
TrackPlayer.registerPlaybackService(() => playbackService);

const ThemeComponent = () => {
  const dispatch = useDispatch();
  const {loading} = useSelector(state => state.themeChange);

  useEffect(() => {
    dispatch(loadTheme());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <App />;
};
const ProviderContainer = () => {
  return (
    <Provider store={themeStore}>
      <ThemeComponent />
    </Provider>
  );
};
