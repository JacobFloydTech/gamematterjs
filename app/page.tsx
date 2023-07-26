import Image from 'next/image'
import Game from './game'
import '../public/globals.css'

export default function Home() {
  return (
    <div className='h-full w-full'>
      <Game />
    </div>
  )
}
