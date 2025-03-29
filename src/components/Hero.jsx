
import {Link} from "react-router-dom";

export default function Hero() {
    return (
      // using flex-1 so that hero takes up available space in parent container
      <section className="flex flex-col justify-center items-center flex-1 bg-[snow]">
        <h1 className="text-6xl text-center font-bold mb-4">Welcome to SortVisualizer</h1>
        <p className="text-lg mb-6">
          Visualise and understand sorting algorithms easily
        </p>
        <Link className="btn" to="/visualiser" >Get Started</Link>
      </section>
    )
  }
  