'use client'

import React from 'react'
import { useMap } from './hooks/useMap'

const Test = () => {
    const map = useMap()

    console.log('map', map)
  return (
    <div>Test</div>
  )
}

export default Test