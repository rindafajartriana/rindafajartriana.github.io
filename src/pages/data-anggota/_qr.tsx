import Button from '@components/atoms/button'
import Img from '@components/atoms/img'
import { clearPopup } from '@store/redux-collection/popup'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const GenerateQr = ({ data }) => {
  const dispatch = useDispatch()
  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <Img src={data} className='w-[13rem] h-[13rem]' />
      <div className='flex gap-3'>
        <a className='btn color-primary' href={data} target='_blank' download>Unduh</a>
        <Button className='btn color-secondary' onClick={() => dispatch(clearPopup())}>Tutup</Button>
      </div>
    </div>
  )
}

export default GenerateQr