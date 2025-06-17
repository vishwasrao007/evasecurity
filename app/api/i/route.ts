export const runtime = 'edge'

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let agentId = process.env.AGENT_ID
  let apiKey = process.env.XI_API_KEY
  try {
    const body = await request.json()
    if (body.apiKey) apiKey = body.apiKey
    if (body.agentId) agentId = body.agentId
  } catch (e) {}
  if (!agentId) throw Error('5cdzSWhG3fofGrvizK2f')
  if (!apiKey) throw Error('sk_f67a5011d01c49813404fef52d4cae91dde536348f84ae07')
  try {
    const apiUrl = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url')
    apiUrl.searchParams.set('agent_id', agentId)
    const response = await fetch(apiUrl.toString(), {
      headers: { 'xi-api-key': apiKey },
    })
    if (!response.ok) throw new Error(response.statusText)
    const data = await response.json()
    return NextResponse.json({ apiKey: data.signed_url })
  } catch (error) {
    // @ts-ignore
    const message = error.message || error.toString()
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
