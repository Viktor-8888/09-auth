import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkSession } from '@/lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();

  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  const isPrivateRoute = privateRoutes.some(route =>
    pathname.startsWith(route)
  );

  if (!accessToken) {
    if (refreshToken) {
      const { headers } = await checkSession();

      const setCookie = headers['set-cookie'];

      if (setCookie) {
        const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

        for (const cookieString of cookieArray) {
          const parsed = parseSetCookie(cookieString);

          const { name, value, ...cookieOptions } = parsed;

          if (value !== undefined) {
            cookieStore.set(name, value, cookieOptions);
          }
        }

        if (isPublicRoute) {
          return NextResponse.redirect(new URL('/', request.url), {
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }

        if (isPrivateRoute) {
          return NextResponse.next({
            headers: {
              Cookie: cookieStore.toString(),
            },
          });
        }
      }
    }

    if (isPublicRoute) {
      return NextResponse.next();
    }

    if (isPrivateRoute) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isPrivateRoute) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};
