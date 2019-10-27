import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Hole from './components/Hole'
import Swiss from './components/Swiss'

// Constant empty game board for resets.
const emptyGameBoard = [
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false },
  { isSwiss: false, isWackable: false }
]
// const arrayIndexIndicator = -1
//import { getCurrentFrame } from 'expo/build/AR'
function useInterval(callback, delay) {
  const savedCallback = useRef()

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}

export default function App() {
  const [holes, setHoles] = useState([
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false },
    { isSwiss: false, isWackable: false }
  ])
  const [score, setScore] = useState(0)
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [difficultyLevel, setDifficultyLevel] = useState(1.5)

  const [lives, setLives] = useState(2)
  const [molesProbability, setMolesProbability] = useState(30)
  const [delayTimer, setDelay] = useState(100)
  //Create random number of Swiss holes based on molesProbability every
  //difficultyLevel interval.
  const refreshBoard = () => {
    const newArray = holes.map(hole => {
      const oddsSwitch = Math.floor(Math.random() * Math.floor(100))
      return oddsSwitch > molesProbability
        ? { isSwiss: false, isWackable: false }
        : { isSwiss: true, isWackable: false }
    })
    setHoles(newArray)
  }
  // Set a timer counting up every 1/10 second

  useInterval(() => {
    if (isRunning) {
      if (lives === 0) {
        setDelay(null)
      }
      if (
        count.toFixed(1) === 0.1 ||
        (count.toFixed(1) >= 1 && count.toFixed(1) % difficultyLevel === 0)
      ) {
        setHoles(emptyGameBoard)
        refreshBoard(emptyGameBoard)
      }

      setCount(prevCount => prevCount + 0.1)
    }
  }, delayTimer)

  const handlePressEmpty = e => {
    if (isRunning) {
      setLives(lives - 1)
      setScore(score - 22)
    }
  }

  const handlePress = index => {
    if (isRunning) {
      setScore(score + 11)

      const newHoles = holes.map((curHole, i) => {
        console.log(curHole)
        return i === index ? { isSwiss: true, isWackable: true } : curHole
      })
      setHoles(newHoles)
    }
  }

  const handleStart = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setCount(0)
    setScore(0)
    setLives(5)
    setHoles(emptyGameBoard)
  }
  if (lives > 0) {
    return (
      <View>
        <View style={{ alignItems: 'center', backgroundColor: 'red' }}>
          <View style={styles.row}>
            <View>
              <Text style={styles.subTitle}>{`Score:${score} `}</Text>
            </View>
            <View>
              <Text style={styles.subTitle}>{`Time: ${count.toFixed(1)}`}</Text>
            </View>
            <View>
              <Text style={styles.subTitle}>{`Lives: ${lives}`}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.title}>Wack'a'Swiss</Text>

        <Button
          title={!isRunning ? 'START WACKING' : 'PAUSE'}
          titleStyle={{
            fontSize: 26
          }}
          buttonStyle={{
            backgroundColor: 'rgb(79, 185, 77)'
          }}
          containerStyle={{ marginLeft: 100, marginRight: 100 }}
          onPress={e => handleStart(e)}
        />
        <Button
          title='RESET'
          titleStyle={{
            fontSize: 26
          }}
          containerStyle={{
            marginLeft: 100,
            marginRight: 100,
            marginTop: 10
          }}
          buttonStyle={{
            backgroundColor: 'red'
          }}
          onPress={e => handleReset(e)}
        />

        <View style={styles.container}>
          {holes.map((hole, i) => {
            return !hole.isSwiss ? (
              <Hole
                key={i}
                index={i}
                handlePressEmpty={e => handlePressEmpty(e)}
              />
            ) : (
              <Swiss
                key={i}
                index={i}
                handlePress={e => handlePress(e)}
                wackable={hole.isWackable}
              />
            )
          })}
        </View>
      </View>
    )
  } else {
    const finalTime = count.toFixed(2)

    return (
      <View style={styles.loser}>
        <Text style={styles.loserText}>Game Over</Text>
        <Text
          style={styles.loserText}
        >{`Final score/time: ${score} ${finalTime}`}</Text>
        <Button
          title='Start Over'
          titleStyle={{
            fontSize: 26
          }}
          containerStyle={{
            marginLeft: 100,
            marginRight: 100,
            marginTop: 10
          }}
          buttonStyle={{
            backgroundColor: 'red'
          }}
          onPress={e => handleReset(e)}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontWeight: 'bold',
    fontSize: 50,
    color: 'rgb(79, 185, 77)',
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center'
  },
  subTitle: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    alignContent: 'center'
  },
  loserText: {
    fontWeight: 'bold',
    fontSize: 30,
    color: 'rgb(79, 185, 77)',
    marginTop: 15,
    alignSelf: 'center'
  },
  loser: {
    marginTop: 200
  }
})
