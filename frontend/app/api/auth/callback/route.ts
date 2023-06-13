import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  const redirectTo = req.cookies.get('redirectTo')?.value

  const response = await api.post('/register', {
    code,
  })

  const { token } = response.data

  const redirectUrl =
    redirectTo ??
    new URL(
      'https://3000-henrique008-nlwspacetim-26dzknvznsw.ws-us98.gitpod.io/',
      req.url,
    )

  const cookieExpiresInSeconds = 60 * 60 * 24 * 30

  return NextResponse.redirect(redirectUrl, {
    headers: {
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
