import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const redirectUrl = new URL(
    'https://3000-henrique008-nlwspacetim-26dzknvznsw.ws-us98.gitpod.io/',
    req.url,
  )

  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=; Path=/; max-age=0`,
    },
  })
}
