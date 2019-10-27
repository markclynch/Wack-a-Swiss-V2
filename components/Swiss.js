import React from 'react'
import { StyleSheet, View, Image, TouchableWithoutFeedback } from 'react-native'

const Swiss = props => {
  const { index, handlePress, wackable } = props
  console.log(wackable)
  return !wackable ? (
    <View>
      <TouchableWithoutFeedback onPress={() => handlePress(index)}>
        <Image source={require('../images/Swiss.png')} style={styles.holes} />
      </TouchableWithoutFeedback>
    </View>
  ) : (
    <View>
      <Image source={require('../images/pow.png')} style={styles.holes} />
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
export default Swiss
