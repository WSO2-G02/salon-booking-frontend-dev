import { NextResponse } from 'next/server'

export async function GET() {
  const services = [
    { title: "Hair Styling", desc: "Professional cuts and styles for every occasion." },
    { title: "Makeup", desc: "Flawless makeup for weddings, shoots, or any event." },
    { title: "Spa & Relaxation", desc: "Relax and rejuvenate with our luxury spa packages." },
  ]
  return NextResponse.json(services)
}
