import React from 'react'
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native'

const NotSwiss = props => {
  const { index, handlePressEnemy, wackable } = props

  return !wackable ? (
    <View>
      <TouchableWithoutFeedback onPress={() => handlePressEnemy(index)}>
        <Image source={require('../images/Nick.png')} style={styles.holes} />
      </TouchableWithoutFeedback>
    </View>
  ) : (
    <View>
      <Image source={require('../images/biff.png')} style={styles.holes} />
    </View>
  )
}
const styles = StyleSheet.create({
  holes: {
    height: 100,
    width: 100,
    borderRadius: 50,
    margin: 10,
    marginTop: 10
  }
})
export default NotSwiss
