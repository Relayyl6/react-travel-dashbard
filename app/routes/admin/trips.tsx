import { Header } from 'components'
import React from 'react'

const Trips = () => {
  return (
    <main className="w-full min-h-screen flex flex-col gap-10 wrapper">
      <Header
        title="Trips"
        description='View and edit AI-generated Travel Plans'
        ctaText="Create a Trip"
        ctaUrl="/trips/create"
      />
    </main>
  )
}

export default Trips