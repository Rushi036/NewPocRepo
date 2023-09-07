import Image from 'next/image'
import { Inter } from 'next/font/google'
import Login from './page/login/login'
import BLayout from './Components/bLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
   <div><Login/></div>
  )
}
Home.getLayout = function getLayout(page:any) {
  return (
    <BLayout>
      {page}
    </BLayout>
  )
}
