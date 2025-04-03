import React, { useState, useEffect, useRef } from "react";
import * as motion from "motion/react-client";
import { FaRandom, FaPlay, FaPause } from "react-icons/fa";

export default function Visualiser() {
  const [array, setArray] = useState([]);
  const [size, setSize] = useState(25);
  // Higher speed value means faster sort.
  const [speed, setSpeed] = useState(100);
  const [isSorting, setIsSorting] = useState(false);
  const [sortAlgorithm, setSortAlgorithm] = useState("bubble");
  const [activeIndices, setActiveIndices] = useState([]);
  const [isPaused, setIsPaused] = useState(false);

  // Refs to hold latest values for async loops.
  const isPausedRef = useRef(isPaused);
  const speedRef = useRef(speed);
  // The sortOperationIdRef is used to cancel an ongoing sort.
  const sortOperationIdRef = useRef(0);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Define a constant for maximum delay.
  const maxDelay = 500; // When slider is at its minimum, delay is maximum.

  motion; // Fix for motion import

  useEffect(() => {
    generateArray();
  }, [size]);

  const generateArray = () => {
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
  };

  // Basic sleep function.
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Wait while paused.
  const waitIfPaused = async () => {
    while (isPausedRef.current) {
      await sleep(50);
    }
  };

  // Cancellation helper: throw an error if the current op doesn't match.
  const checkCancelled = (opId) => {
    if (opId !== sortOperationIdRef.current) {
      throw new Error("Sort cancelled");
    }
  };

  // ---------------------------
  // Bubble Sort Implementation
  const bubbleSort = async () => {
    setIsSorting(true);
    const opId = sortOperationIdRef.current; // Capture current operation id.
    let arr = [...array];

    try {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          checkCancelled(opId);
          setActiveIndices([j, j + 1]);
          await waitIfPaused();
          await sleep(maxDelay - speedRef.current);
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            setArray([...arr]);
            setActiveIndices([j, j + 1]);
            await waitIfPaused();
            await sleep(maxDelay - speedRef.current);
          }
        }
      }
    } catch (e) {
      // Sort was cancelled—exit gracefully.
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  // ---------------------------
  // Selection Sort Implementation
  const selectionSort = async () => {
    setIsSorting(true);
    const opId = sortOperationIdRef.current;
    let arr = [...array];

    try {
      for (let i = 0; i < arr.length; i++) {
        checkCancelled(opId);
        let indexOfLowestValue = i;
        setActiveIndices([i]);
        await waitIfPaused();
        await sleep(maxDelay - speedRef.current);
        for (let j = i + 1; j < arr.length; j++) {
          checkCancelled(opId);
          setActiveIndices([i, j, indexOfLowestValue]);
          await waitIfPaused();
          await sleep(maxDelay - speedRef.current);
          if (arr[j] < arr[indexOfLowestValue]) {
            indexOfLowestValue = j;
            setActiveIndices([i, indexOfLowestValue]);
            await waitIfPaused();
            await sleep(maxDelay - speedRef.current);
          }
        }
        if (indexOfLowestValue !== i) {
          [arr[i], arr[indexOfLowestValue]] = [arr[indexOfLowestValue], arr[i]];
          setArray([...arr]);
          setActiveIndices([i, indexOfLowestValue]);
          await waitIfPaused();
          await sleep(maxDelay - speedRef.current);
        }
      }
    } catch (e) {
      // Sort cancelled.
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  // ---------------------------
  // Insertion Sort Implementation
  const insertionSort = async () => {
    setIsSorting(true);
    const opId = sortOperationIdRef.current;
    let arr = [...array];

    try {
      for (let i = 1; i < arr.length; i++) {
        checkCancelled(opId);
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
          checkCancelled(opId);
          setActiveIndices([j, j + 1]);
          await waitIfPaused();
          await sleep(maxDelay - speedRef.current);
          arr[j + 1] = arr[j];
          setArray([...arr]);
          j--;
        }
        arr[j + 1] = key;
        setArray([...arr]);
        await sleep(maxDelay - speedRef.current);
      }
    } catch (e) {
      // Sort cancelled.
    }
    setActiveIndices([]);
    setIsSorting(false);
  };

  // ---------------------------
  // Merge Sort Implementation
  const mergeSort = async () => {
    setIsSorting(true);
    const opId = sortOperationIdRef.current;
    let arr = [...array];

    try {
      await mergeSortHelper(arr, 0, arr.length - 1, opId);
    } catch (e) {
      // Sort cancelled.
    }
    setIsSorting(false);
  };

  const mergeSortHelper = async (arr, start, end, opId) => {
    checkCancelled(opId);
    if (start < end) {
      let mid = Math.floor((start + end) / 2);
      await mergeSortHelper(arr, start, mid, opId);
      await mergeSortHelper(arr, mid + 1, end, opId);
      await merge(arr, start, mid, end, opId);
    }
  };

  const merge = async (arr, start, mid, end, opId) => {
    let left = arr.slice(start, mid + 1);
    let right = arr.slice(mid + 1, end + 1);
    let i = 0,
      j = 0,
      k = start;
    while (i < left.length && j < right.length) {
      checkCancelled(opId);
      setActiveIndices([k]);
      await waitIfPaused();
      await sleep(maxDelay - speedRef.current);
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        arr[k] = right[j];
        j++;
      }
      setArray([...arr]);
      k++;
    }
    while (i < left.length) {
      checkCancelled(opId);
      arr[k] = left[i];
      setActiveIndices([k]);
      await waitIfPaused();
      await sleep(maxDelay - speedRef.current);
      setArray([...arr]);
      i++;
      k++;
    }
    while (j < right.length) {
      checkCancelled(opId);
      arr[k] = right[j];
      setActiveIndices([k]);
      await waitIfPaused();
      await sleep(maxDelay - speedRef.current);
      setArray([...arr]);
      j++;
      k++;
    }
    setActiveIndices([]);
  };

  // ---------------------------
  // Quick Sort Implementation
  const quickSort = async () => {
    setIsSorting(true);
    const opId = sortOperationIdRef.current;
    let arr = [...array];
    try {
      await quickSortHelper(arr, 0, arr.length - 1, opId);
    } catch (e) {
      // Sort cancelled.
    }
    setIsSorting(false);
  };

  const quickSortHelper = async (arr, low, high, opId) => {
    checkCancelled(opId);
    if (low < high) {
      let pi = await partition(arr, low, high, opId);
      await quickSortHelper(arr, low, pi - 1, opId);
      await quickSortHelper(arr, pi + 1, high, opId);
    }
  };

  const partition = async (arr, low, high, opId) => {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      checkCancelled(opId);
      setActiveIndices([j, high]); // Highlight current element and pivot.
      await waitIfPaused();
      await sleep(maxDelay - speedRef.current);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        setActiveIndices([i, j]);
        await waitIfPaused();
        await sleep(maxDelay - speedRef.current);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    setActiveIndices([i + 1, high]);
    await waitIfPaused();
    await sleep(maxDelay - speedRef.current);
    return i + 1;
  };

  // ---------------------------
  // Unified button: start sort or toggle pause/resume.
  const handleSortButton = async () => {
    if (!isSorting) {
      // Reset the operation ID before starting a new sort.
      sortOperationIdRef.current++;
      if (sortAlgorithm === "bubble") {
        bubbleSort();
      } else if (sortAlgorithm === "selection") {
        selectionSort();
      } else if (sortAlgorithm === "insertion") {
        insertionSort();
      } else if (sortAlgorithm === "merge") {
        mergeSort();
      } else if (sortAlgorithm === "quick") {
        quickSort();
      }
    } else {
      setIsPaused((prev) => !prev);
    }
  };

  // When clicking "New Array", cancel any ongoing sort and generate a new array.
  const handleNewArray = () => {
    // Cancel current sort by incrementing the operation ID.
    sortOperationIdRef.current++;
    // Also ensure we unpause any paused sort.
    setIsPaused(false);
    setIsSorting(false);
    generateArray();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold p-10">Visualiser</h1>
        <div className="flex flex-col justify-center">
          {/* Dropdown to select sort algorithm */}
          <div className="mb-4">
            <label htmlFor="sortSelect" className="mr-2">
              Choose Sort:
            </label>
            <select
              id="sortSelect"
              value={sortAlgorithm}
              disabled={isSorting}
              onChange={(e) => setSortAlgorithm(e.target.value)}
              className="border border-gray-300 rounded p-1"
            >
              <option value="bubble">Bubble Sort</option>
              <option value="selection">Selection Sort</option>
              <option value="insertion">Insertion Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
            </select>
          </div>
          <div className="flex-1 border-2 border-black p-10 min-w-full">
            <label htmlFor="size" className="mr-2">
              Array Size:
            </label>
            <input
              type="number"
              id="size"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min="5"
              max="100"
              disabled={isSorting}
              className="border border-black rounded p-1"
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
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="range-black range-thumb"
            />
            <div className="flex justify-center mt-4">
              <button
                className="btn m-5"
                onClick={handleSortButton}
                disabled={isSorting && array.length === 0}
              >
                {!isSorting && (
                  <>
                    <FaPlay className="inline mr-2" /> Start
                  </>
                )}
                {isSorting &&
                  (isPaused ? (
                    <>
                      <FaPlay className="inline mr-2" /> Resume
                    </>
                  ) : (
                    <>
                      <FaPause className="inline mr-2" /> Pause
                    </>
                  ))}
              </button>
              <button className="btn m-5" onClick={handleNewArray}>
                <FaRandom className="inline mr-2" />
                New Array
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Bars Container */}
      <div className="mt-auto">
        <div className="flex items-end gap-1 w-full justify-center overflow-x-auto px-2">
          {array.map((value, idx) => (
            <motion.div
              key={idx}
              animate={{ height: `${value * 3}px` }}
              transition={{ duration: speed / 500 }}
              className={`flex-1 ${
                activeIndices.includes(idx) ? "bg-red-500" : "bg-black"
              }`}
              style={{
                width: `${100 / array.length}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
