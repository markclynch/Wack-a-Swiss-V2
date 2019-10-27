import React from 'react'
import { StyleSheet, View, TouchableWithoutFeedback } from 'react-native'
const Hole = props => {
  const { index, handlePressEmpty } = props

  return (
    <View>
      <TouchableWithoutFeedback onPress={() => handlePressEmpty(index)}>
        <View style={styles.holes}></View>
      </TouchableWithoutFeedback>
    </View>
  )
}

const styles = StyleSheet.create({
  holes: {
    backgroundColor: '#222',
    height: 100,
    width: 100,
    borderRadius: 50,
    margin: 10,
    marginTop: 10
  }
})

export default Hole
