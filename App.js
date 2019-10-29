import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import Hole from './components/Hole'
import Swiss from './components/Swiss'
import Nick from './components/Nick'
import { Audio } from 'expo-av'

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
  const [holes, setHoles] = useState(emptyGameBoard)
  const [score, setScore] = useState(0)
  const [count, setCount] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [difficultyLevel, setDifficultyLevel] = useState(2000)
  const [lives, setLives] = useState(5)
  const [molesProbability, setMolesProbability] = useState(28)
  const [delayTimer, setDelay] = useState(100)
  const [numWacks, setNumWacks] = useState(0)
  const [bonus, setBonus] = useState(10)
  const [lossPhrase, setLossPhrase] = useState('Game Over')
  const [win, setWin] = useState(false)
  //Create random number of Swiss holes based on molesProbability every
  //difficultyLevel interval.
  const refreshBoard = () => {
    console.log(count, 'rendered newBoard', numWacks)
    setNumWacks(0)
    const newArray = holes.map(hole => {
      const oddsSwitch = Math.floor(Math.random() * Math.floor(100))
      console.log(oddsSwitch)
      if (oddsSwitch >= 98) {
        return { isSwiss: 'enemy', isWackable: false }
      } else {
        return oddsSwitch < molesProbability
          ? { isSwiss: true, isWackable: false }
          : { isSwiss: false, isWackable: false }
      }
    })
    setHoles(newArray)
  }

  // Set a timer counting up every 1/10 second
  useInterval(() => {
    if (isRunning) {
      // if (difficultyLevel > 800 && count % 5000 === 0) {
      //   setDifficultyLevel(prevDiff => prevDiff - 100)
      //   setMolesProbability(prevProb => prevProb + 5)
      // }

      if (count % difficultyLevel === 0 || count === 500) {
        console.log('refreshBoard called')
        refreshBoard()
      }
      // if (count % (difficultyLevel + difficultyLevel - 100) === 0) {
      //   console.log('emptyGameBoard called')
      //   setHoles(emptyGameBoard)
      // }
      // if (count % 5000 === 0) {
      //   console.log(difficultyLevel, molesProbability)
      // }
      setCount(prevCount => prevCount + 100)
      // Expires timer after 60 seconds - redirect Game Over
      if (count >= 60000) {
        setLives(0)
      }
      // if lives runout Game Over - capture seconds and score.
      if (lives === 0) {
        setDelay(null)
      }
      if (score > 1000) {
        setDelay(null)
        setLossPhrase('You wacked Swiss so hard! You win!')
        setLives(0)
      }
    }
  }, delayTimer)

  //handles misclicks
  const handlePressEmpty = e => {
    if (isRunning) {
      setLives(prevLives => prevLives - 1)
      setScore(score - 22)
      setNumWacks(0)
      setBonus(10)
    }
  }
  // Handles pressed Swiss(mole).
  const handlePress = index => {
    if (isRunning) {
      setNumWacks(prevWacks => prevWacks + 1)
      console.log(numWacks)
      if (numWacks === 3) {
        playTrippleWackAudio()
        setBonus(20)
      } else if (numWacks === 2) {
        setBonus(15)
      }

      setScore(prevScore => prevScore + bonus)
      const newHoles = holes.map((curHole, i) => {
        return i === index ? { isSwiss: true, isWackable: true } : curHole
      })
      setHoles(newHoles)
    }
  }
  const playTrippleWackAudio = async () => {
    console.log('You got 3 in a row!')
    const soundOhBill_1 = new Audio.Sound()
    try {
      await soundOhBill_1.loadAsync(require('./audio/OhBill.mp3'))
      await soundOhBill_1.playAsync()
    } catch (error) {
      console.log(error)
    }
    bonusFlash()
  }
  const bonusFlash = () => {
    setScore(prevScore => prevScore + 50)
  }
  const toggleStart = () => {
    setIsRunning(!isRunning)
  }
  const handlePressEnemy = () => {
    setLossPhrase('You let Nick win??? You monster, Nick is Not-a-Swiss')
    setLives(0)
  }
  // Resets all to initial state.
  const handleReset = () => {
    setIsRunning(false)
    setNumWacks(0)
    setCount(0.0)
    setScore(0)
    setLives(5)
    setHoles(emptyGameBoard)
    setDelay(100)
    setMolesProbability(40)
    setDifficultyLevel(1600)
  }
  const displayCount = count / 1000
  if (lives > 0) {
    return (
      <View>
        <View style={{ alignItems: 'center', backgroundColor: 'red' }}>
          <View style={styles.row}>
            <View>
              <Text style={styles.subTitle}>{`Score:${score} `}</Text>
            </View>
            <View>
              <Text style={styles.subTitle}>{`Time: ${displayCount}`}</Text>
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
          onPress={e => toggleStart(e)}
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
            if (hole.isSwiss === 'enemy') {
              return (
                <Nick
                  key={i}
                  index={i}
                  handlePressEnemy={e => handlePressEnemy(e)}
                  wackable={hole.isWackable}
                />
              )
            } else {
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
            }
          })}
        </View>
      </View>
    )
  } else {
    const finalTime = displayCount

    return (
      <View style={styles.loser}>
        <Text style={styles.loserText}>{`${lossPhrase}`}</Text>
        <Text style={styles.loserText}>{`Final score/time: ${score} `}</Text>
        <Text style={styles.loserText}>{`Final time: ${finalTime} `}</Text>
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
