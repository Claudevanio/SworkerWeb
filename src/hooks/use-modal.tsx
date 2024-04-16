'use client'
import { useState } from 'react'

type Output = [boolean, () => void, () => void]

export const useModal = (): Output => {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = () => {
    console.log('oiii')
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return [isOpen, openModal, closeModal]
}
