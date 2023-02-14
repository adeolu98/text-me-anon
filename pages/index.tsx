import Head from "next/head";
import Image from "next/image";
//import { Inter } from '@next/font/google'
//const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div className="flex w-full justify-center items-center h-screen px-10 pt-20 pb-10">
      <div className="border shadow-2xl rounded-3xl h-full w-full sm:w-4/6 md:w-4/6 lg:w-3/6 xl:w-2/6"></div>
    </div>
  );
}
