'use client'

import { useContext } from "react";
import { MapBoxContext } from "../MapBox";



export function useMap() {
  const context = useContext(MapBoxContext);

  if(context !== undefined) {
    return context
  }
  return 'error'
}