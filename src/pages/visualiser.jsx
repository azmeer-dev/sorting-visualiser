import React, { useState, useEffect } from "react"
import * as motion from "motion/react-client"
import { FaRandom, FaPlay } from "react-icons/fa"

export default function Visualiser() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(25);
  const [speed, setSpeed] = useState(100);
  const [isSorting, setIsSorting] = useState(false);
  motion; // Fix for motion import

  useEffect(() => {
    generateArray()
  }, [size])

  const generateArray = () => {
    const newArray = Array.from({ length: size }, () =>
      Math.floor(Math.random() * 100) + 1
    )
    setArray(newArray)
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const bubbleSort = async () => {
    setIsSorting(true)
    let arr = [...array]

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr]) //force re-render
          await sleep(speed) //wait after each swap
        }
      }
    }
    setIsSorting(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold p-10">Visualiser</h1>
        <div className="flex flex-col justify-center ">
          <div className="flex-1 border-2 border-black p-10 min-w-full">
            <label htmlFor="size" className="mr-2">
              Array Size:
            </label>
            <input
              type="number"
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              min="5"
              max="100"
              disabled={isSorting}
              className="border-1 border-black rounded p-1"
            />
            <label htmlFor="speed" className="ml-4 mr-2">
              Speed:
            </label>
            <input
              type="range"
              id="speed"
              min="10"
              max="500"
              value={speed}
              disabled={isSorting}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="range-black range-thumb"
            />
            <div className="flex justify-center mt-4">
              <button
                className="btn m-5"
                onClick={bubbleSort}
                disabled={isSorting}
              >
                <FaPlay />
                Start
              </button>
              <button
                className="btn m-5"
                onClick={generateArray}
                disabled={isSorting}
              >
                <FaRandom />
                New Array
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <div className="flex items-end gap-1 w-full justify-center overflow-hidden px-8">
          {array.map((value, idx) => (
            <motion.div
              key={idx}
              animate={{ height: `${value * 3}px` }}
              transition={{ duration: speed / 500 }}
              className="bg-black flex-1"
              style={{
                minWidth: `${100 / array.length}%`,
                margin: "0 1px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
